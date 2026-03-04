const db = require('./DB_config/db');

async function fixSchema() {
    try {
        console.log("Checking schema...");

        // 1. Check/Create academic_profiles table
        console.log("Checking academic_profiles table...");
        await db.query(`
            CREATE TABLE IF NOT EXISTS academic_profiles (
                id INT AUTO_INCREMENT PRIMARY KEY,
                employee_id INT NOT NULL,
                \`rank\` VARCHAR(100),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
            )
        `);
        console.log("academic_profiles table ensured.");

        // Check columns in academic_profiles
        try {
            const [cols] = await db.query("SHOW COLUMNS FROM academic_profiles");
            const colNames = cols.map(c => c.Field);
            if (!colNames.includes('rank')) {
                console.log("Adding column 'rank' to academic_profiles...");
                await db.query("ALTER TABLE academic_profiles ADD COLUMN `rank` VARCHAR(100)");
                console.log("Added 'rank'.");
            } else {
                console.log("'rank' column exists in academic_profiles.");
            }
        } catch (e) {
            console.log("Error checking academic_profiles columns:", e.message);
        }

        // 2. Check/Create leaves table
        console.log("Checking leaves table...");
        await db.query(`
            CREATE TABLE IF NOT EXISTS leaves (
                id INT AUTO_INCREMENT PRIMARY KEY,
                employee_id INT NOT NULL,
                leave_type VARCHAR(100) NOT NULL,
                start_date TIMESTAMP NOT NULL,
                end_date TIMESTAMP NOT NULL,
                reason TEXT,
                status VARCHAR(50) DEFAULT 'Pending',
                admin_comments TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
            )
        `);
        console.log("leaves table ensured.");

        // 3. Check/Create documents table
        console.log("Checking documents table...");
        await db.query(`
            CREATE TABLE IF NOT EXISTS documents (
                id INT AUTO_INCREMENT PRIMARY KEY,
                employee_id INT NOT NULL,
                document_name VARCHAR(255) NOT NULL,
                document_type VARCHAR(100),
                file_path VARCHAR(255) NOT NULL,
                file_size VARCHAR(50),
                uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
            )
        `);
        console.log("documents table ensured.");


        // 4. Fix employees columns (re-run to be safe)
        console.log("Checking employees table columns...");
        const [columns] = await db.query("SHOW COLUMNS FROM employees");
        const columnNames = columns.map(c => c.Field);

        const columnsToAdd = [
            { name: 'email', type: 'VARCHAR(255)' },
            { name: 'department', type: 'VARCHAR(100)' },
            { name: 'role', type: 'VARCHAR(100)' },
            { name: 'status', type: 'VARCHAR(50)' }
        ];

        for (const col of columnsToAdd) {
            if (!columnNames.includes(col.name)) {
                console.log(`Adding column ${col.name}...`);
                try {
                    await db.query(`ALTER TABLE employees ADD COLUMN ${col.name} ${col.type}`);
                    console.log(`Successfully added ${col.name}`);
                } catch (err) {
                    console.error(`Failed to add ${col.name}:`, err.message);
                }
            }
        }

        console.log("Schema update complete.");
        process.exit(0);
    } catch (error) {
        console.error("Error fixing schema:", error);
        process.exit(1);
    }
}

fixSchema();
