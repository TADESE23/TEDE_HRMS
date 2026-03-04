const db = require('./DB_config/db');

async function describeForecasts() {
    try {
        const [columns] = await db.query('SHOW COLUMNS FROM hr_forecasts');
        console.log("hr_forecasts columns:", columns);

        const [rows] = await db.query('SELECT * FROM hr_forecasts LIMIT 5');
        console.log("Sample data:", rows);

        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

describeForecasts();
