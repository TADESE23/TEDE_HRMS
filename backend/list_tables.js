const db = require('./DB_config/db');

async function listTables() {
    try {
        const [tables] = await db.query('SHOW TABLES');
        console.log("Tables in database:", tables);

        // Also describe employees table to see if it has relevant data
        const [columns] = await db.query('SHOW COLUMNS FROM employees');
        console.log("\nEmployees columns:", columns.map(c => c.Field));

        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

listTables();
