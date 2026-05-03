const db = require('./DB_config/db');

async function createTable() {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS employee_history (
                id INT AUTO_INCREMENT PRIMARY KEY,
                employee_id INT NOT NULL,
                event_type VARCHAR(100),
                event_date DATE,
                details TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
            )
        `);
        console.log("Created employee_history table successfully.");
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

createTable();
