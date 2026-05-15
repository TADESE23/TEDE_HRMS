const db = require('./DB_config/db');

async function run() {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS housing (
                id INT AUTO_INCREMENT PRIMARY KEY,
                employee_id INT,
                building_name VARCHAR(100),
                unit_number VARCHAR(50),
                status ENUM('Waitlisted', 'Allocated', 'Vacated') DEFAULT 'Waitlisted',
                allocation_date DATE,
                notes TEXT,
                FOREIGN KEY (employee_id) REFERENCES employees(id)
            )
        `);
        
        await db.query(`
            CREATE TABLE IF NOT EXISTS separations (
                id INT AUTO_INCREMENT PRIMARY KEY,
                employee_id INT,
                separation_type ENUM('Resignation', 'Retirement', 'Termination', 'Other') DEFAULT 'Resignation',
                separation_date DATE,
                reason TEXT,
                clearance_status ENUM('Pending', 'In Progress', 'Cleared') DEFAULT 'Pending',
                FOREIGN KEY (employee_id) REFERENCES employees(id)
            )
        `);
        console.log('Phase 3 tables created successfully');
    } catch (error) {
        console.error('Error creating Phase 3 tables:', error);
    } finally {
        process.exit();
    }
}

run();
