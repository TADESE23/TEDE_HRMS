const db = require('./DB_config/db');

async function testForecasts() {
    try {
        console.log("Checking current forecasts...");
        const [existing] = await db.query('SELECT * FROM hr_forecasts');
        console.log(`Found ${existing.length} existing forecasts.`);

        if (existing.length > 0) {
            console.log("Top 3 forecasts:", existing.slice(0, 3));
        }

        console.log("\nIf this is 0, login to the frontend admin dashboard to trigger generation, or call the API manually.");

        // Let's check if we even have enough employee data (>= 5 needed)
        const [emps] = await db.query('SELECT COUNT(*) as count FROM employees WHERE date_of_joining IS NOT NULL');
        console.log(`\nEmployee count with join date: ${emps[0].count}`);

        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

testForecasts();
