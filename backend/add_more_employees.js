const db = require('./DB_config/db');

const newEmployees = [
    { first_name: 'Tadesse', last_name: 'Gebre', department: 'Information Systems', role: 'Lecturer', gender: 'Male' },
    { first_name: 'Hana', last_name: 'Mulugeta', department: 'Information Systems', role: 'Assistant Professor', gender: 'Female' },
    { first_name: 'Girma', last_name: 'Ayele', department: 'Information Science', role: 'Senior Lecturer', gender: 'Male' },
    { first_name: 'Bethlehem', last_name: 'Tekle', department: 'Information Science', role: 'Lecturer', gender: 'Female' },
    { first_name: 'Kebede', last_name: 'Haile', department: 'Software Engineering', role: 'Senior Lecturer', gender: 'Male' },
    { first_name: 'Rahel', last_name: 'Negash', department: 'Software Engineering', role: 'Lecturer', gender: 'Female' },
    { first_name: 'Teshome', last_name: 'Biruk', department: 'Chemistry', role: 'Assistant Professor', gender: 'Male' },
    { first_name: 'Alem', last_name: 'Worku', department: 'Chemistry', role: 'Lab Technician', gender: 'Female' },
    { first_name: 'Mulatu', last_name: 'Dessie', department: 'Biology', role: 'Senior Lecturer', gender: 'Male' },
    { first_name: 'Senait', last_name: 'Fikre', department: 'Biology', role: 'Lecturer', gender: 'Female' },
    { first_name: 'Dereje', last_name: 'Abate', department: 'Physics', role: 'Lecturer', gender: 'Male' },
    { first_name: 'Tsion', last_name: 'Mesfin', department: 'Physics', role: 'Assistant Professor', gender: 'Female' },
];

function randomDatePast2Years() {
    const d = new Date();
    d.setFullYear(d.getFullYear() - Math.floor(Math.random() * 2));
    d.setMonth(Math.floor(Math.random() * 12));
    d.setDate(Math.floor(Math.random() * 28) + 1);
    return d.toISOString().split('T')[0];
}

async function addMore() {
    try {
        // Also ensure Biology and Information Science exist in departments table
        const extraDepts = [
            { name: 'Information Science', college: 'College of Informatics' },
            { name: 'Biology', college: 'College of Computational Science' },
        ];
        for (const d of extraDepts) {
            const [col] = await db.query('SELECT id FROM colleges WHERE name = ?', [d.college]);
            if (col.length > 0) {
                const [existing] = await db.query('SELECT id FROM departments WHERE name = ? AND college_id = ?', [d.name, col[0].id]);
                if (existing.length === 0) {
                    await db.query('INSERT INTO departments (college_id, name) VALUES (?, ?)', [col[0].id, d.name]);
                    console.log(`Added department: ${d.name}`);
                }
            }
        }

        let startId = 200;
        for (const emp of newEmployees) {
            const dateJoined = randomDatePast2Years();
            const email = `${emp.first_name.toLowerCase()}.${emp.last_name.toLowerCase()}@uog.edu.et`;
            const empType = Math.random() > 0.85 ? 'Contract' : 'Full-Time';
            await db.query(`
                INSERT INTO employees 
                (first_name, last_name, email, department, role, date_of_joining, employment_type, staff_category, status, employee_id_number, gender) 
                VALUES (?, ?, ?, ?, ?, ?, ?, 'Academic', 'Active', ?, ?)
            `, [emp.first_name, emp.last_name, email, emp.department, emp.role, dateJoined, empType, `EMP-AI-${startId++}`, emp.gender]);
        }

        console.log(`✅ Added ${newEmployees.length} new employees across 6 departments.`);

        const [result] = await db.query('SELECT DISTINCT department FROM employees ORDER BY department');
        console.log('\nAll departments with employees:');
        result.forEach(r => console.log('  ✅', r.department));

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
addMore();
