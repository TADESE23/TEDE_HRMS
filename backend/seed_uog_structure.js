const db = require('./DB_config/db');

async function seedUoGStructure() {
    try {
        // ─── 1. Upsert Campus ───────────────────────────────────────────────
        console.log('Seeding campus...');
        await db.query(`
            CREATE TABLE IF NOT EXISTS campuses (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                location VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        const [existingCampus] = await db.query(`SELECT id FROM campuses WHERE name = 'Tewodros Campus'`);
        let campusId;
        if (existingCampus.length === 0) {
            const [r] = await db.query(`INSERT INTO campuses (name, location) VALUES ('Tewodros Campus', 'Gondar, Ethiopia')`);
            campusId = r.insertId;
        } else {
            campusId = existingCampus[0].id;
        }
        console.log(` Campus ID: ${campusId}`);

        // ─── 2. Upsert Colleges ─────────────────────────────────────────────
        console.log('Seeding colleges...');
        await db.query(`
            CREATE TABLE IF NOT EXISTS colleges (
                id INT AUTO_INCREMENT PRIMARY KEY,
                campus_id INT NOT NULL,
                name VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        const colleges = [
            'College of Informatics',
            'College of Animal Science',
            'College of Biotechnology',
            'College of Computational Science'
        ];

        const collegeIds = {};
        for (const college of colleges) {
            const [existing] = await db.query(`SELECT id FROM colleges WHERE name = ?`, [college]);
            if (existing.length === 0) {
                const [r] = await db.query(`INSERT INTO colleges (campus_id, name) VALUES (?, ?)`, [campusId, college]);
                collegeIds[college] = r.insertId;
            } else {
                collegeIds[college] = existing[0].id;
            }
        }
        console.log('✅ Colleges seeded:', Object.keys(collegeIds));

        // ─── 3. Upsert Departments ──────────────────────────────────────────
        console.log('Seeding departments...');
        await db.query(`
            CREATE TABLE IF NOT EXISTS departments (
                id INT AUTO_INCREMENT PRIMARY KEY,
                college_id INT,
                name VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        const departmentMap = {
            'College of Informatics': [
                'Computer Science',
                'Information Technology',
                'Information Systems',
                'Software Engineering'
            ],
            'College of Animal Science': [
                'Doctor of Veterinary Medicine (DVM)',
                'Veterinary Pharmacy',
                'Animal Production',
                'Veterinary Pathology & Parasitology'
            ],
            'College of Biotechnology': [
                'Biotechnology',
                'Microbiology',
                'Biochemistry',
                'Environmental Science'
            ],
            'College of Computational Science': [
                'Applied Mathematics',
                'Physics',
                'Statistics',
                'Chemistry'
            ]
        };

        let deptCount = 0;
        for (const [collegeName, depts] of Object.entries(departmentMap)) {
            const cId = collegeIds[collegeName];
            for (const dept of depts) {
                const [existing] = await db.query(`SELECT id FROM departments WHERE name = ? AND college_id = ?`, [dept, cId]);
                if (existing.length === 0) {
                    await db.query(`INSERT INTO departments (college_id, name) VALUES (?, ?)`, [cId, dept]);
                    deptCount++;
                }
            }
        }
        console.log(`✅ ${deptCount} departments seeded.`);

        // ─── 4. Update AI-seeded employees to match real departments ────────
        console.log('Updating AI employees to reflect real UoG departments...');
        const realDeptMap = [
            { depts: ['Computer Science', 'Information Technology', 'Information Systems', 'Software Engineering'], roles: ['Lecturer', 'Senior Lecturer', 'Assistant Professor', 'Professor', 'Lab Technician'] },
            { depts: ['Doctor of Veterinary Medicine (DVM)', 'Veterinary Pharmacy', 'Animal Production'], roles: ['Senior Lecturer', 'Lecturer', 'Assistant Professor', 'Lab Assistant'] },
            { depts: ['Applied Mathematics', 'Physics', 'Statistics', 'Chemistry'], roles: ['Lecturer', 'Senior Lecturer', 'Assistant Professor', 'Demonstrator'] },
            { depts: ['Biotechnology', 'Microbiology', 'Biochemistry'], roles: ['Lecturer', 'Lab Technician', 'Senior Lecturer', 'Research Assistant'] },
        ];

        const [aiEmployees] = await db.query(`SELECT id FROM employees WHERE employee_id_number LIKE 'EMP-AI-%'`);
        for (let i = 0; i < aiEmployees.length; i++) {
            const group = realDeptMap[i % realDeptMap.length];
            const dept = group.depts[i % group.depts.length];
            const role = group.roles[i % group.roles.length];
            await db.query(`UPDATE employees SET department = ?, role = ? WHERE id = ?`, [dept, role, aiEmployees[i].id]);
        }
        console.log(`✅ Updated ${aiEmployees.length} AI employees with real UoG department/role assignments.`);

        console.log('\n🎉 UoG Tewodros Campus structure seeded successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding UoG structure:', err);
        process.exit(1);
    }
}

seedUoGStructure();
