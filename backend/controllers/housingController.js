const db = require('../DB_config/db');

exports.getHousing = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT h.*, e.first_name, e.last_name, e.department
            FROM housing h
            JOIN employees e ON h.employee_id = e.id
            ORDER BY h.allocation_date DESC
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addHousing = async (req, res) => {
    try {
        const { employee_id, building_name, unit_number, status, allocation_date, notes } = req.body;
        const [result] = await db.query(
            'INSERT INTO housing (employee_id, building_name, unit_number, status, allocation_date, notes) VALUES (?, ?, ?, ?, ?, ?)',
            [employee_id, building_name, unit_number, status, allocation_date, notes]
        );
        res.status(201).json({ id: result.insertId, message: 'Housing added successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
