const db = require('./DB_config/db');

async function run() {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS performance_goals (
                id INT AUTO_INCREMENT PRIMARY KEY,
                employee_id INT,
                title VARCHAR(255),
                description TEXT,
                target_date DATE,
                status ENUM('Not Started', 'In Progress', 'Completed', 'On Hold') DEFAULT 'Not Started',
                FOREIGN KEY (employee_id) REFERENCES employees(id)
            )
        `);
        
        await db.query(`
            CREATE TABLE IF NOT EXISTS appraisals (
                id INT AUTO_INCREMENT PRIMARY KEY,
                employee_id INT,
                reviewer_id INT,
                review_period VARCHAR(50),
                score DECIMAL(3,1),
                feedback TEXT,
                status ENUM('Draft', 'Submitted', 'Reviewed') DEFAULT 'Draft',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (employee_id) REFERENCES employees(id),
                FOREIGN KEY (reviewer_id) REFERENCES employees(id)
            )
        `);
        console.log('Performance tables created successfully');
    } catch (error) {
        console.error('Error creating tables:', error);
    } finally {
        process.exit();
    }
}

run();
