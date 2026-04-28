const db = require('../DB_config/db');

exports.getAllLeaves = async (req, res) => {
    try {
        const [leaves] = await db.query(`
            SELECT l.*, e.first_name, e.last_name 
            FROM leaves l 
            JOIN employees e ON l.employee_id = e.id 
            ORDER BY l.created_at DESC
        `);
        res.status(200).json(leaves);
    } catch (error) {
        console.error("Error fetching all leaves:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.getMyLeaves = async (req, res) => {
    try {
        const employeeId = req.user.id; // Assuming auth middleware sets req.user
        // Or if passed as param: const employeeId = req.params.employeeId;

        // Let's assume for now we use the ID from the token or param
        const queryId = req.params.employeeId || req.user?.id;

        if (!queryId) {
            return res.status(400).json({ message: "Employee ID required" });
        }

        const [leaves] = await db.query(
            'SELECT * FROM leaves WHERE employee_id = ? ORDER BY created_at DESC',
            [queryId]
        );
        res.status(200).json(leaves);
    } catch (error) {
        console.error("Error fetching employee leaves:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.requestLeave = async (req, res) => {
    try {
        const { employeeId, leaveType, startDate, endDate, reason } = req.body;

        // Basic validation
        if (!employeeId || !leaveType || !startDate || !endDate) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const [result] = await db.query(
            `INSERT INTO leaves (employee_id, leave_type, start_date, end_date, reason, status)
             VALUES (?, ?, ?, ?, ?, 'Pending_HoD')`,
            [employeeId, leaveType, startDate, endDate, reason]
        );

        res.status(201).json({ message: "Leave requested successfully", id: result.insertId });
    } catch (error) {
        console.error("Error requesting leave:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.updateLeaveStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const { status, comments } = req.body; // Pending_Dean, Approved, Rejected

        if (!['Pending_Dean', 'Approved', 'Rejected'].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        await db.query(
            'UPDATE leaves SET status = ?, admin_comments = ? WHERE id = ?',
            [status, comments, id]
        );

        res.status(200).json({ message: `Leave ${status.toLowerCase()} successfully` });
    } catch (error) {
        console.error("Error updating leave status:", error);
        res.status(500).json({ message: error.message });
    }
};
