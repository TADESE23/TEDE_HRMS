const db = require('./DB_config/db');

async function run() {
    try {
        await db.query(`INSERT IGNORE INTO salary_scales (id, grade_name, base_salary, max_salary, currency) VALUES (1, 'Senior Developer', 15000, 20000, 'ETB')`);
        await db.query(`UPDATE employees SET salary_scale_id = 1 WHERE id = 1`);
        console.log("Salary data seeded successfully.");
    } catch (e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
}
run();
