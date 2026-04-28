const db = require('./DB_config/db');

async function fix() {
    try {
        // Reassign 'Social Science' -> 'Computer Science' (doesn't exist at Tewodros)
        await db.query("UPDATE employees SET department = 'Computer Science' WHERE department = 'Social Science'");
        console.log("Removed 'Social Science' assignments.");

        // Reassign 'IT' -> 'Information Technology' (full name)
        await db.query("UPDATE employees SET department = 'Information Technology' WHERE department = 'IT'");
        console.log("Renamed 'IT' -> 'Information Technology'.");

        // Also clean up any 'Human Resources' or 'Administration' from old seeds
        await db.query("UPDATE employees SET department = 'Software Engineering' WHERE department = 'Human Resources'");
        await db.query("UPDATE employees SET department = 'Information Systems' WHERE department = 'Administration'");
        console.log("Cleaned up any other non-UoG departments.");

        // Verify
        const [result] = await db.query('SELECT DISTINCT department FROM employees ORDER BY department');
        console.log('\nFinal departments in employees table:');
        result.forEach(r => console.log('  ✅', r.department));

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
fix();
