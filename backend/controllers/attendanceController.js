const db = require('../DB_config/db');

exports.getAttendance = async (req, res) => {
    try {
        const { date } = req.query;
        let query = `
            SELECT a.*, e.first_name, e.last_name, d.name as department
            FROM attendance_records a
            JOIN employees e ON a.employee_id = e.id
            LEFT JOIN departments d ON e.department_id = d.id
        `;
        const params = [];
        
        if (date) {
            query += ' WHERE a.date = ?';
            params.push(date);
        }
        
        query += ' ORDER BY a.date DESC, e.first_name ASC';
        
        const [records] = await db.query(query, params);
        res.status(200).json(records);
    } catch (error) {
        console.error("Attendance Error:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.logAttendance = async (req, res) => {
    try {
        const { employee_id, date, status, check_in_time, check_out_time } = req.body;
        
        // Check if record exists
        const [existing] = await db.query('SELECT id FROM attendance_records WHERE employee_id = ? AND date = ?', [employee_id, date]);
        
        if (existing.length > 0) {
            // Update
            await db.query(
                'UPDATE attendance_records SET status = ?, check_in_time = ?, check_out_time = ? WHERE id = ?',
                [status, check_in_time || null, check_out_time || null, existing[0].id]
            );
        } else {
            // Insert
            await db.query(
                'INSERT INTO attendance_records (employee_id, date, status, check_in_time, check_out_time) VALUES (?, ?, ?, ?, ?)',
                [employee_id, date, status, check_in_time || null, check_out_time || null]
            );
        }
        
        res.status(200).json({ success: true, message: 'Attendance logged successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getStats = async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        
        // Count employees present today
        const [present] = await db.query('SELECT COUNT(*) as count FROM attendance_records WHERE date = ? AND status = "Present"', [today]);
        
        // Get total employees
        const [total] = await db.query('SELECT COUNT(*) as count FROM employees WHERE status = "Active"');
        
        const totalCount = total[0].count;
        const presentCount = present[0].count;
        const attendanceRate = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;
        
        res.status(200).json({
            todayRate: `${attendanceRate}%`,
            present: presentCount,
            total: totalCount
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
