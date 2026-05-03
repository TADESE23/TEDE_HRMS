const db = require('../DB_config/db');

exports.getTrainings = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT t.*, e.first_name, e.last_name 
            FROM training_developments t 
            LEFT JOIN employees e ON t.employee_id = e.id
        `);
        res.json(rows);
    } catch (err) {
        console.error('Error fetching trainings:', err);
        res.status(500).json({ error: 'Failed to fetch trainings' });
    }
};

exports.addTraining = async (req, res) => {
    try {
        const { employee_id, training_title, institution, start_date, end_date, status, cost } = req.body;
        
        if (!employee_id) {
             return res.status(400).json({ error: 'employee_id is required' });
        }

        const [result] = await db.query(
            'INSERT INTO training_developments (employee_id, training_title, institution, start_date, end_date, status, cost) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [employee_id, training_title, institution, start_date, end_date, status || 'Proposed', cost || 0]
        );
        res.status(201).json({ id: result.insertId, message: 'Training added successfully' });
    } catch (err) {
        console.error('Error adding training:', err);
        res.status(500).json({ error: 'Failed to add training' });
    }
};
