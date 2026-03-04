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
