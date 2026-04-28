const db = require('./DB_config/db');

async function verify() {
    try {
        const [colleges] = await db.query('SELECT c.name college, d.name dept FROM colleges c JOIN departments d ON d.college_id = c.id ORDER BY c.name, d.name');
        console.log('\n📋 UoG Tewodros Campus Structure:');
        let prevCollege = '';
        colleges.forEach(r => {
            if (r.college !== prevCollege) {
                console.log(`\n🏛️  ${r.college}`);
                prevCollege = r.college;
            }
            console.log(`   └─ ${r.dept}`);
        });

        const [emps] = await db.query('SELECT department, role, first_name, last_name FROM employees WHERE employee_id_number LIKE "EMP-AI-%" LIMIT 10');
        console.log('\n👥 Sample Employees:');
        emps.forEach(e => console.log(`   ${e.first_name} ${e.last_name} — ${e.role} @ ${e.department}`));

        console.log('\n✅ Verification complete!');
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
verify();
