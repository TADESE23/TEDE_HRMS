const db = require('./DB_config/db');

async function updateStaffCategories() {
    try {
        // Academic Staff: Lecturers, Professors, Senior Lecturers, Assistant Professors, Demonstrators
        await db.query(`
            UPDATE employees SET staff_category = 'Academic' 
            WHERE role IN ('Lecturer', 'Senior Lecturer', 'Assistant Professor', 'Professor', 'Demonstrator')
        `);

        // Technical Staff: Lab Technicians, Lab Assistants, Research Assistants
        await db.query(`
            UPDATE employees SET staff_category = 'Technical' 
            WHERE role IN ('Lab Technician', 'Lab Assistant', 'Research Assistant')
        `);

        // Admin Staff: Clerks, HR Specialists
        await db.query(`
            UPDATE employees SET staff_category = 'Admin' 
            WHERE role IN ('Clerk', 'HR Specialist')
        `);

        // Health Staff: DVM and Veterinary-related roles assigned to Animal Science college
        await db.query(`
            UPDATE employees SET staff_category = 'Health' 
            WHERE department IN ('Doctor of Veterinary Medicine (DVM)', 'Veterinary Pharmacy', 'Veterinary Pathology & Parasitology')
        `);

        // Also add a few Admin and Health staff employees that are missing
        const extraEmployees = [
            { first_name: 'Yared', last_name: 'Getahun', department: 'Administration', role: 'HR Specialist', category: 'Admin', gender: 'Male' },
            { first_name: 'Meseret', last_name: 'Tadesse', department: 'Administration', role: 'Clerk', category: 'Admin', gender: 'Female' },
            { first_name: 'Wondimu', last_name: 'Assefa', department: 'Administration', role: 'Clerk', category: 'Admin', gender: 'Male' },
            { first_name: 'Aster', last_name: 'Belay', department: 'Campus Health Center', role: 'Nurse', category: 'Health', gender: 'Female' },
            { first_name: 'Daniel', last_name: 'Gebremariam', department: 'Campus Health Center', role: 'Health Officer', category: 'Health', gender: 'Male' },
            { first_name: 'Kidist', last_name: 'Solomon', department: 'Campus Health Center', role: 'Pharmacist', category: 'Health', gender: 'Female' },
            { first_name: 'Biniam', last_name: 'Mengistu', department: 'ICT Center', role: 'Network Administrator', category: 'Technical', gender: 'Male' },
            { first_name: 'Lidya', last_name: 'Abera', department: 'ICT Center', role: 'System Administrator', category: 'Technical', gender: 'Female' },
        ];

        let startId = 300;
        for (const emp of extraEmployees) {
            const d = new Date();
            d.setFullYear(d.getFullYear() - Math.floor(Math.random() * 2));
            d.setMonth(Math.floor(Math.random() * 12));
            d.setDate(Math.floor(Math.random() * 28) + 1);
            const dateJoined = d.toISOString().split('T')[0];
            const email = `${emp.first_name.toLowerCase()}.${emp.last_name.toLowerCase()}@uog.edu.et`;
            const empType = Math.random() > 0.85 ? 'Contract' : 'Full-Time';

            await db.query(`
                INSERT INTO employees 
                (first_name, last_name, email, department, role, staff_category, date_of_joining, employment_type, status, employee_id_number, gender) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Active', ?, ?)
            `, [emp.first_name, emp.last_name, email, emp.department, emp.role, emp.category, dateJoined, empType, `EMP-AI-${startId++}`, emp.gender]);
        }

        console.log(`✅ Updated staff categories and added ${extraEmployees.length} new staff members.\n`);

        // Summary
        const [summary] = await db.query(`
            SELECT staff_category, COUNT(*) as count 
            FROM employees 
            GROUP BY staff_category 
            ORDER BY staff_category
        `);
        console.log('📊 Staff Category Breakdown:');
        summary.forEach(r => console.log(`   ${r.staff_category}: ${r.count} employees`));

        const [total] = await db.query('SELECT COUNT(*) as total FROM employees');
        console.log(`\n   Total: ${total[0].total} employees`);

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
updateStaffCategories();
