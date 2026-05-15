const db = require('../DB_config/db');

exports.getSeparations = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT s.*, e.first_name, e.last_name, e.department
            FROM separations s
            JOIN employees e ON s.employee_id = e.id
            ORDER BY s.separation_date DESC
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addSeparation = async (req, res) => {
    try {
        const { employee_id, separation_type, separation_date, reason } = req.body;
        const [result] = await db.query(
            'INSERT INTO separations (employee_id, separation_type, separation_date, reason) VALUES (?, ?, ?, ?)',
            [employee_id, separation_type, separation_date, reason]
        );
        res.status(201).json({ id: result.insertId, message: 'Separation added successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
