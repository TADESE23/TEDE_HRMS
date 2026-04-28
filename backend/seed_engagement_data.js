const db = require('./DB_config/db');

async function seedEngagementData() {
    try {
        console.log('Seeding leaves and attendance data...');
        
        const [employees] = await db.query('SELECT id FROM employees');
        if (employees.length === 0) {
            console.log('No employees found. Seed employees first.');
            process.exit(1);
        }

        // 1. Seed Leaves
        await db.query('DELETE FROM leaves');
        const leaveTypes = ['Annual', 'Sick', 'Maternity', 'Paternity', 'Study', 'Personal'];
        for (let i = 0; i < 5; i++) {
            const empId = employees[Math.floor(Math.random() * employees.length)].id;
            const type = leaveTypes[Math.floor(Math.random() * leaveTypes.length)];
            const start = new Date();
            start.setDate(start.getDate() - Math.floor(Math.random() * 5)); // Recent or current
            const end = new Date(start);
            end.setDate(end.getDate() + 5 + Math.floor(Math.random() * 10));
            
            await db.query(`
                INSERT INTO leaves (employee_id, leave_type, start_date, end_date, reason, status)
                VALUES (?, ?, ?, ?, ?, 'Approved')
            `, [empId, type, start, end, 'Taking my scheduled leave for family reasons.']);
        }

        // 2. Seed Attendance Records for Today
        await db.query('DELETE FROM attendance_records');
        const todayStr = new Date().toISOString().split('T')[0];
        let presentCount = 0;
        for (const emp of employees) {
            if (Math.random() > 0.1) { // 90% attendance
                const checkIn = '08:' + String(Math.floor(Math.random() * 30)).padStart(2, '0') + ':00';
                await db.query(`
                    INSERT INTO attendance_records (employee_id, date, status, check_in)
                    VALUES (?, ?, 'Present', ?)
                `, [emp.id, todayStr, checkIn]);
                presentCount++;
            } else {
                await db.query(`
                    INSERT INTO attendance_records (employee_id, date, status)
                    VALUES (?, ?, 'Absent')
                `, [emp.id, todayStr]);
            }
        }

        console.log(`✅ Seeded 5 active leaves and attendance for ${employees.length} employees.`);
        console.log(`📈 Attendance Rate: ${((presentCount / employees.length) * 100).toFixed(1)}%`);
        process.exit(0);
    } catch (e) {
        console.error('Error seeding engagement data:', e);
        process.exit(1);
    }
}

seedEngagementData();
