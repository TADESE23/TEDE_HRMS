const db = require('./DB_config/db');
const ss = require('simple-statistics');

async function debugGen() {
    try {
        console.log("Fetching employees...");
        const [employees] = await db.query(`
            SELECT date_of_joining 
            FROM employees 
            WHERE date_of_joining IS NOT NULL 
            ORDER BY date_of_joining ASC
        `);
        console.log(`Found ${employees.length} employees.`);

        if (employees.length < 5) {
            console.error("Not enough data (<5)");
            process.exit(0);
        }

        let headcount = 0;
        const monthMap = new Map();

        employees.forEach(emp => {
            const date = new Date(emp.date_of_joining);
            if (isNaN(date.getTime())) {
                console.warn("Invalid date:", emp.date_of_joining);
                return;
            }
            const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            headcount++;
            monthMap.set(key, headcount);
        });

        const sortedMonths = Array.from(monthMap.keys()).sort();
        if (sortedMonths.length === 0) {
            console.error("No valid months data.");
            process.exit(0);
        }

        const dataPoints = [];
        const firstMonth = new Date(sortedMonths[0] + "-01");

        sortedMonths.forEach((monthStr) => {
            const current = new Date(monthStr + "-01");
            const monthDiff = (current.getFullYear() - firstMonth.getFullYear()) * 12 + (current.getMonth() - firstMonth.getMonth());
            const count = monthMap.get(monthStr);
            dataPoints.push([monthDiff, count]);
        });

        console.log("Data Points (first 5):", dataPoints.slice(0, 5));

        console.log("Training model...");
        const regressionLine = ss.linearRegression(dataPoints);
        const regressionLineFunc = ss.linearRegressionLine(regressionLine);
        const rSquared = ss.rSquared(dataPoints, regressionLineFunc);

        console.log(`Model: m=${regressionLine.m}, b=${regressionLine.b}. R2=${rSquared}`);

        // Try DB Insertion logic check
        const futureDate = new Date();
        const testVal = 100;
        const testConf = 85.5;

        console.log("Testing DB Insert...");
        // Use a transaction or rollback? Or just a test table?
        // Let's just try to insert one mock row to see if the table schema matches
        // hr_forecasts (forecast_date, metric, predicted_value, confidence_score)

        await db.query(
            'INSERT INTO hr_forecasts (forecast_date, metric, predicted_value, confidence_score) VALUES (?, ?, ?, ?)',
            [futureDate, 'debug_test', testVal, testConf]
        );
        console.log("Insert success.");

        // Clean up
        await db.query('DELETE FROM hr_forecasts WHERE metric = "debug_test"');

        process.exit(0);

    } catch (error) {
        console.error("CRITICAL FAILURE:", error);
        process.exit(1);
    }
}

debugGen();
