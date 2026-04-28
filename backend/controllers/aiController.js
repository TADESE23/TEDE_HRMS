const db = require('../DB_config/db');
const ss = require('simple-statistics');

exports.getForecasts = async (req, res) => {
    try {
        // Fetch existing forecasts
        const [forecasts] = await db.query('SELECT * FROM hr_forecasts WHERE forecast_date >= CURRENT_DATE ORDER BY forecast_date ASC');

        if (forecasts.length === 0) {
            // Forecasts missing or outdated (all in past). Generate new ones.
            return exports.generateForecasts(req, res);
        }

        res.status(200).json(forecasts);
    } catch (error) {
        console.error("Error fetching forecasts:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.generateForecasts = async (req, res) => {
    try {
        console.log("Generating AI Forecasts...");

        // 1. Fetch historical data: Employee Joining Dates
        // Group by month to get headcount growth over time
        const [employees] = await db.query(`
            SELECT date_of_joining 
            FROM employees 
            WHERE date_of_joining IS NOT NULL 
            ORDER BY date_of_joining ASC
        `);

        if (employees.length < 5) {
            return res.status(400).json({ message: "Not enough data points for AI prediction (need at least 5 employees)" });
        }

        // 2. Process Data for Linear Regression
        // We want to predict Headcount (y) based on Time (x)
        // x = month index (0, 1, 2...), y = cumulative headcount

        let headcount = 0;
        const dataPoints = [];
        const monthMap = new Map(); // yyyy-mm -> { index, count }

        employees.forEach(emp => {
            const date = new Date(emp.date_of_joining);
            const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

            headcount++; // Cumulative count
            monthMap.set(key, headcount);
        });

        // Convert map to array for regression
        const sortedMonths = Array.from(monthMap.keys()).sort();
        const firstMonth = new Date(sortedMonths[0] + "-01");

        sortedMonths.forEach((monthStr) => {
            const current = new Date(monthStr + "-01");
            // Calculate month difference from start
            const monthDiff = (current.getFullYear() - firstMonth.getFullYear()) * 12 + (current.getMonth() - firstMonth.getMonth());
            const count = monthMap.get(monthStr);
            dataPoints.push([monthDiff, count]);
        });

        console.log(`Training Linear Regression specific model on ${dataPoints.length} data points...`);

        // Fix: If we only have 1 data point (e.g. all employees joined in same month), 
        // regression produced a flat line or might be unstable. 
        // Add a synthetic point: 0 employees 1 month before the first hire.
        if (dataPoints.length === 1) {
            dataPoints.unshift([-1, 0]);
        }

        // 3. Train Model (Linear Regression)
        const regressionLine = ss.linearRegression(dataPoints);
        const regressionLineFunc = ss.linearRegressionLine(regressionLine);
        const rSquared = ss.rSquared(dataPoints, regressionLineFunc);

        console.log(`Model trained. Equation: y = ${regressionLine.m.toFixed(2)}x + ${regressionLine.b.toFixed(2)}`);
        console.log(`R-squared (Confidence): ${rSquared.toFixed(2)}`);

        // 4. Predict Next 12 Months
        const lastX = dataPoints[dataPoints.length - 1][0];
        const forecasts = [];

        for (let i = 1; i <= 12; i++) {
            const futureX = lastX + i;
            const predictedHeadcount = Math.round(regressionLineFunc(futureX));

            // Calculate date
            const futureDate = new Date(firstMonth);
            futureDate.setMonth(firstMonth.getMonth() + futureX);

            // Confidence score based on R-squared (simple heuristic)
            const confidenceOffset = (1 - rSquared) * (i * 0.05); // Confidence drops as we go further
            let confidence = rSquared - confidenceOffset;
            if (confidence < 0) confidence = 0;

            forecasts.push({
                date: futureDate,
                value: predictedHeadcount,
                confidence: (confidence * 100).toFixed(2)
            });
        }

        // 5. Save to Database
        // Clear old forecasts first (optional, or just append)
        await db.query('DELETE FROM hr_forecasts WHERE metric = "staff_count"');

        for (const f of forecasts) {
            await db.query(
                'INSERT INTO hr_forecasts (forecast_date, metric, predicted_value, confidence_score) VALUES (?, ?, ?, ?)',
                [f.date, 'staff_count', f.value, f.confidence]
            );
        }

        // Also generate departmental forecasts? 
        // For now, let's stick to total headcount as per "Staff Forecast Widget" general purpose
        // But the widget shows departments. Let's do a simple heuristic for departments based on current ratio.

        const [depts] = await db.query('SELECT department, COUNT(*) as count FROM employees GROUP BY department');
        const currentTotal = employees.length;

        // Save department predictions for the NEXT YEAR specifically (just one entry per dept for simplicitly in this turn)
        // Or actually the widget expects specific departments.
        // We can save these as specific metrics like "dept_CS_count"

        for (const dept of depts) {
            if (!dept.department) continue;
            const ratio = dept.count / currentTotal;

            // Predict forecast for 12 months out
            const oneYearForecast = forecasts[11]; // last one
            const predictedDeptCount = Math.round(oneYearForecast.value * ratio);
            const trend = predictedDeptCount - dept.count;

            await db.query(
                'INSERT INTO hr_forecasts (forecast_date, metric, predicted_value, confidence_score) VALUES (?, ?, ?, ?)',
                [oneYearForecast.date, `dept_${dept.department}_count`, predictedDeptCount, oneYearForecast.confidence]
            );
        }

        res.status(200).json({
            message: "Forecasts generated successfully",
            model: {
                equation: `y = ${regressionLine.m.toFixed(2)}x + ${regressionLine.b.toFixed(2)}`,
                rSquared
            },
            forecasts
        });

    } catch (error) {
        console.error("Error generating forecasts:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.rankCandidates = async (req, res) => {
    try {
        const { vacancyId } = req.params;
        
        // In a real scenario, we would fetch candidates from the DB based on vacancyId.
        // For this AI integration, we fetch all candidates and map their data for the AI server.
        // Fetch candidates for this vacancy
        const [candidates] = await db.query('SELECT * FROM candidates WHERE vacancy_id = ?', [vacancyId]);
        
        // Fetch vacancy details to compare requirements
        const [vacancies] = await db.query('SELECT * FROM vacancies WHERE id = ?', [vacancyId]);
        const vacancy = vacancies[0];

        if (!vacancy) {
            return res.status(404).json({ message: "Vacancy not found" });
        }

        // Prepare payload for AI Server
        const payload = candidates.map(c => {
            // Skill matching (simple heuristic for education match)
            const eduLevels = ["High School", "Diploma", "Bachelor's Degree", "Master's Degree", "PhD"];
            const applicantEduIndex = eduLevels.indexOf(c.education_level);
            
            // Assume most jobs want at least Bachelor's (index 2)
            const educationMatch = applicantEduIndex >= 2 ? 1 : 0.5;

            // Simplified experience gap: assume 3 years required if not specified
            const experienceGap = Math.max(0, 3 - (c.years_of_experience || 0));

            return {
                applicant_id: c.id,
                applicant_name: `${c.first_name} ${c.last_name}`,
                applicant_skills: c.skills ? c.skills.split(',').map(s => s.trim()) : [],
                job_skills: vacancy.requirements ? vacancy.requirements.split(',').map(s => s.trim()) : ["communication", "teamwork"],
                education_match: educationMatch,
                experience_gap: experienceGap,
                salary_fit: 0.8, // Default if no vacancy budget info
                interview_score: 85 // Application phase default
            };
        });


        // Handle empty case
        if (payload.length === 0) {
            return res.status(200).json([]);
        }

        // Send to Flask AI Server over updated Port 5001
        const aiResponse = await fetch('http://127.0.0.1:5001/rank_candidates', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!aiResponse.ok) {
            throw new Error(`AI Server error: ${aiResponse.statusText}`);
        }

        const rankedData = await aiResponse.json();

        // Join the returned ranked data and scores with original candidate details
        const enrichedResults = rankedData.map(aiResult => {
            const originalCandidate = payload.find(p => p.applicant_id === aiResult.applicant_id);
            return {
                ...aiResult,
                name: originalCandidate.applicant_name,
                skills_matched: aiResult.skill_score ? (aiResult.skill_score * 100).toFixed(0) + '%' : 'N/A'
            };
        });

        res.status(200).json(enrichedResults);

    } catch (error) {
        console.error("Error ranking candidates via AI:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.getTurnoverRisk = async (req, res) => {
    try {
        const [employees] = await db.query('SELECT * FROM employees WHERE status = "Active"');

        // Simple heuristic to calculate turnover risk (standing in for Python Machine Learning for the demo)
        const atRiskEmployees = employees.map(emp => {
            let score = 0;
            let reasons = [];

            if (emp.employment_type === 'Contract') {
                score += 40;
                reasons.push('Contract role (lower stability)');
            }
            
            // Time in company
            const yearsJoined = (new Date() - new Date(emp.date_of_joining)) / (1000 * 60 * 60 * 24 * 365);
            if (yearsJoined > 3 && (emp.role.includes('Assistant') || emp.role.includes('Clerk'))) {
                score += 35;
                reasons.push('Stagnant role progression (3+ yrs)');
            } else if (yearsJoined < 0.5) {
                score += 15;
                reasons.push('New hire orientation period');
            }

            if (emp.department === 'Computer Science' || emp.department === 'Software Engineering') {
                score += 20;
                reasons.push('High market demand for skills');
            }

            return {
                id: emp.id,
                name: `${emp.first_name} ${emp.last_name}`,
                role: emp.role,
                risk: Math.min(score > 0 ? score + Math.floor(Math.random() * 10) : Math.floor(Math.random() * 20), 95) + '%',
                riskScore: score,
                reason: reasons.length > 0 ? reasons.join(', ') : 'General engagement drops'
            };
        }).filter(e => e.riskScore > 35).sort((a, b) => b.riskScore - a.riskScore).slice(0, 5);

        res.status(200).json({ success: true, data: atRiskEmployees });
    } catch (error) {
        console.error("Error calculating turnover risk:", error);
        res.status(500).json({ message: error.message });
    }
};
