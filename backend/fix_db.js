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

        // 5. Check/Create vacancies table
        console.log("Checking vacancies table...");
        await db.query(`
            CREATE TABLE IF NOT EXISTS vacancies (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                department VARCHAR(255) NOT NULL,
                type VARCHAR(50) NOT NULL,
                status VARCHAR(50) DEFAULT 'Published',
                closing_date DATE NOT NULL,
                description TEXT,
                requirements TEXT,
                posted_by_id INT,
                responsible_role VARCHAR(100),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (posted_by_id) REFERENCES users(id) ON DELETE SET NULL
            )
        `);
        
        const [vCols] = await db.query("SHOW COLUMNS FROM vacancies");
        const vColNames = vCols.map(c => c.Field);
        if (!vColNames.includes('posted_by_id')) {
            console.log("Adding column 'posted_by_id' to vacancies...");
            await db.query("ALTER TABLE vacancies ADD COLUMN posted_by_id INT AFTER requirements");
            await db.query("ALTER TABLE vacancies ADD CONSTRAINT fk_user_posted FOREIGN KEY (posted_by_id) REFERENCES users(id) ON DELETE SET NULL");
        }
        if (!vColNames.includes('responsible_role')) {
            console.log("Adding column 'responsible_role' to vacancies...");
            await db.query("ALTER TABLE vacancies ADD COLUMN responsible_role VARCHAR(100) AFTER posted_by_id");
        }

        // 6. Check/Create candidates table
        console.log("Checking candidates table...");
        await db.query(`
            CREATE TABLE IF NOT EXISTS candidates (
                id INT AUTO_INCREMENT PRIMARY KEY,
                vacancy_id INT,
                first_name VARCHAR(100) NOT NULL,
                last_name VARCHAR(100) NOT NULL,
                email VARCHAR(255),
                phone VARCHAR(50),
                resume_text TEXT,
                cv_file_path VARCHAR(255),
                applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                status VARCHAR(50) DEFAULT 'New',
                ai_match_score FLOAT,
                prediction_label VARCHAR(50),
                FOREIGN KEY (vacancy_id) REFERENCES vacancies(id) ON DELETE SET NULL
            )
        `);

        const [cCols] = await db.query("SHOW COLUMNS FROM candidates");
        const cColNames = cCols.map(c => c.Field);
        if (!cColNames.includes('vacancy_id')) {
            console.log("Adding column 'vacancy_id' to candidates...");
            await db.query("ALTER TABLE candidates ADD COLUMN vacancy_id INT AFTER id");
            await db.query("ALTER TABLE candidates ADD CONSTRAINT fk_candidate_vacancy FOREIGN KEY (vacancy_id) REFERENCES vacancies(id) ON DELETE SET NULL");
        }
        if (!cColNames.includes('education_level')) {
            console.log("Adding AI ranking columns to candidates...");
            await db.query("ALTER TABLE candidates ADD COLUMN education_level VARCHAR(100) AFTER cv_file_path");
            await db.query("ALTER TABLE candidates ADD COLUMN years_of_experience INT AFTER education_level");
            await db.query("ALTER TABLE candidates ADD COLUMN skills TEXT AFTER years_of_experience");
            await db.query("ALTER TABLE candidates ADD COLUMN expected_salary DECIMAL(15,2) AFTER skills");
        }


        console.log("Schema update complete.");

        process.exit(0);
    } catch (error) {
        console.error("Error fixing schema:", error);
        process.exit(1);
    }
}

fixSchema();
