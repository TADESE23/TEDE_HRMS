const db = require('../DB_config/db');

exports.getDisciplinaryActions = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT d.*, e.first_name, e.last_name 
            FROM disciplinary_actions d 
            LEFT JOIN employees e ON d.employee_id = e.id
        `);
        res.json(rows);
    } catch (err) {
        console.error('Error fetching disciplinary actions:', err);
        res.status(500).json({ error: 'Failed to fetch disciplinary actions' });
    }
};

exports.addDisciplinaryAction = async (req, res) => {
    try {
        const { employee_id, incident_date, violation_type, action_taken, file_path } = req.body;
        
        if (!employee_id) {
             return res.status(400).json({ error: 'employee_id is required' });
        }

        const [result] = await db.query(
            'INSERT INTO disciplinary_actions (employee_id, incident_date, violation_type, action_taken, file_path) VALUES (?, ?, ?, ?, ?)',
            [employee_id, incident_date || new Date(), violation_type, action_taken, file_path || '']
        );
        res.status(201).json({ id: result.insertId, message: 'Disciplinary action added successfully' });
    } catch (err) {
        console.error('Error adding disciplinary action:', err);
        res.status(500).json({ error: 'Failed to add disciplinary action' });
    }
};
