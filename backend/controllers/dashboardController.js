const db = require('../DB_config/db');

exports.getDashboardStats = async (req, res) => {
    try {
        const { role, id } = req.user;

        let stats = [];

        if (role === 'admin' || role === 'hr') {
            // 1. Total Employees
            const [totalEmployees] = await db.query('SELECT COUNT(*) as count FROM employees');

            // 2. New Hires (joined in last 30 days)
            const [newHires] = await db.query('SELECT COUNT(*) as count FROM employees WHERE date_of_joining >= DATE_SUB(NOW(), INTERVAL 30 DAY)');

            // 3. Employees On Leave (Active leaves)
            const [onLeave] = await db.query('SELECT COUNT(*) as count FROM leaves WHERE status = "Approved" AND NOW() BETWEEN start_date AND end_date');

            // 4. Attendance (Simplified: % of employees who don't have an unexcused absence today - mock for now or count check-ins)
            // For now, let's just return a placeholder or mock value as attendance tracking might be in another table
            const attendance = "95%";

            stats = [
                { title: "Total Employees", value: totalEmployees[0].count.toString(), icon: "Users", trend: { value: "12%", isPositive: true } },
                { title: "New Hires", value: newHires[0].count.toString(), icon: "UserPlus", trend: { value: "5%", isPositive: true } },
                { title: "On Leave", value: onLeave[0].count.toString(), icon: "Clock" },
                { title: "Attendance", value: attendance, icon: "CalendarCheck", trend: { value: "2%", isPositive: false } },
            ];
        } else if (role === 'manager') {
            // Team stats (placeholder for team_id logic)
            stats = [
                { title: "Team Members", value: "24", icon: "Users" },
                { title: "Pending Approvals", value: "5", icon: "AlertCircle", trend: { value: "2 pending", isPositive: false } },
                { title: "On Leave", value: "2", icon: "Clock" },
                { title: "Department Budget", value: "75%", icon: "FileText" },
            ];
        } else if (role === 'recruiter') {
            stats = [
                { title: "Active Job Posts", value: "8", icon: "Briefcase" },
                { title: "New Applicants", value: "145", icon: "Users", trend: { value: "15%", isPositive: true } },
                { title: "Interviews Today", value: "4", icon: "CalendarCheck" },
                { title: "Hired This Month", value: "12", icon: "UserPlus" },
            ];
        } else {
            // Employee stats
            // SECURITY: Use parameterized query (?) to prevent SQL Injection
            const [leaveBalance] = await db.query('SELECT COUNT(*) as count FROM leaves WHERE employee_id = ? AND status = "Approved"', [id]);
            // Mocking some employee values as they might require specific tables
            stats = [
                { title: "Approved Leaves", value: leaveBalance[0].count.toString(), icon: "Clock" },
                { title: "Attendance", value: "100%", icon: "CalendarCheck" },
                { title: "Tasks Pending", value: "3", icon: "FileText" },
                { title: "Training Due", value: "1", icon: "GraduationCap" },
            ];
        }

        res.status(200).json(stats);
    } catch (error) {
        console.error("Dashboard Stats Error:", error);
        res.status(500).json({ message: error.message });
    }
};

const { Parser } = require('json2csv');

exports.exportDashboardReport = async (req, res) => {
    try {
        console.log(`Exporting report for user ${req.user.email}`);

        // 1. Fetch Summary Stats
        const [totalEmployees] = await db.query('SELECT COUNT(*) as count FROM employees');
        const [newHires] = await db.query('SELECT COUNT(*) as count FROM employees WHERE date_of_joining >= DATE_SUB(NOW(), INTERVAL 30 DAY)');

        // 2. Fetch Department Stats
        const [deptStats] = await db.query(`
            SELECT department, COUNT(*) as count 
            FROM employees 
            WHERE department IS NOT NULL 
            GROUP BY department
        `);

        // 3. Prepare Data for CSV
        // We will create a flat structure or two sections. 
        // For simplicity, let's list Summary first, then Departments.
        const reportData = [];

        reportData.push({ Category: 'Summary', Metric: 'Total Employees', Value: totalEmployees[0].count });
        reportData.push({ Category: 'Summary', Metric: 'New Hires (30 days)', Value: newHires[0].count });
        reportData.push({ Category: 'Summary', Metric: 'Report Date', Value: new Date().toISOString().split('T')[0] });

        deptStats.forEach(dept => {
            reportData.push({ Category: 'Department Breakdown', Metric: dept.department, Value: dept.count });
        });

        // 4. Convert to CSV
        const fields = ['Category', 'Metric', 'Value'];
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(reportData);

        // 5. Send File
        res.header('Content-Type', 'text/csv');
        res.header('Content-Disposition', 'attachment; filename=hrms_report.csv');
        res.status(200).send(csv);

    } catch (error) {
        console.error("Export Error:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.getDashboardAnalytics = async (req, res) => {
    try {
        // Fetch department distribution
        // Group employees by department and count
        const [results] = await db.query(`
            SELECT department, COUNT(*) as count 
            FROM employees 
            WHERE department IS NOT NULL 
            GROUP BY department
        `);

        // Format for Recharts { name: 'Dept', value: 10 }
        const data = results.map(row => ({
            name: row.department,
            value: row.count
        }));

        res.status(200).json(data);
    } catch (error) {
        console.error("Analytics Error:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.getSystemActivity = async (req, res) => {
    try {
        const activities = [];

        // 1. Recent Hires (Last 60 days)
        const [hires] = await db.query(`
            SELECT first_name, last_name, department, date_of_joining 
            FROM employees 
            WHERE date_of_joining >= DATE_SUB(NOW(), INTERVAL 60 DAY)
            ORDER BY date_of_joining DESC
            LIMIT 5
        `);
        hires.forEach(h => {
            activities.push({
                type: 'hire',
                message: `New Staff: ${h.first_name} ${h.last_name} joined ${h.department}`,
                time: h.date_of_joining
            });
        });

        // 2. Recent Leave Requests (Last 7 days)
        const [leaves] = await db.query(`
             SELECT e.first_name, e.last_name, l.leave_type, l.created_at
             FROM leaves l
             JOIN employees e ON l.employee_id = e.id
             WHERE l.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
             ORDER BY l.created_at DESC
             LIMIT 5
        `);
        leaves.forEach(l => {
            activities.push({
                type: 'leave',
                message: `Leave Request: ${l.first_name} ${l.last_name} (${l.leave_type})`,
                time: l.created_at
            });
        });

        // 3. User Logins (Last 24 hours) - Mocked logic if users table lacks created_at for logins
        // But we saw users table has last_login.
        const [logins] = await db.query(`
             SELECT email, last_login, role
             FROM users
             WHERE last_login >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
             ORDER BY last_login DESC
             LIMIT 5
        `);
        logins.forEach(u => {
            activities.push({
                type: 'login',
                message: `User Login: ${u.email} (${u.role})`,
                time: u.last_login
            });
        });

        // 4. Upcoming Ethiopian Holidays (Hardcoded Logic)
        const today = new Date();
        const year = today.getFullYear();

        // Simple fixed dates for major holidays (approximations for demo)
        const holidays = [
            { name: 'Genna (Ethiopian Christmas)', month: 0, day: 7 }, // Jan 7
            { name: 'Timkat (Epiphany)', month: 0, day: 19 },          // Jan 19
            { name: 'Adwa Victory Day', month: 2, day: 2 },            // Mar 2
            { name: 'Good Friday (Siklet)', month: 3, day: 10 },       // Apr 10 (Var)
            { name: 'Easter (Fasika)', month: 3, day: 12 },            // Apr 12 (Var)
            { name: 'Patriots Day', month: 4, day: 5 },                // May 5
            { name: 'Downfall of Derg', month: 4, day: 28 },           // May 28
            { name: 'Enkutatash (New Year)', month: 8, day: 11 },      // Sep 11
            { name: 'Meskel', month: 8, day: 27 },                     // Sep 27
        ];

        holidays.forEach(h => {
            const hDate = new Date(year, h.month, h.day);
            // Check if holiday is in the future and within next 14 days
            const diffTime = hDate.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays >= 0 && diffDays <= 14) {
                activities.push({
                    type: 'holiday',
                    message: `Upcoming Holiday: ${h.name} is in ${diffDays} days.`,
                    time: new Date().toISOString() // Show as "Now"
                });
            }
        });

        // Sort by time descending
        activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

        // Return top 10
        res.status(200).json(activities.slice(0, 10));

    } catch (error) {
        console.error("Activity Error:", error);
        res.status(500).json({ message: error.message });
    }
};
