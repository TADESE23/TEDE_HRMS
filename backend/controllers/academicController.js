const db = require('../DB_config/db');

exports.getAcademicProfiles = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT a.*, e.first_name, e.last_name 
            FROM academic_profiles a 
            LEFT JOIN employees e ON a.employee_id = e.id
        `);
        res.json(rows);
    } catch (err) {
        console.error('Error fetching academic profiles:', err);
        res.status(500).json({ error: 'Failed to fetch academic profiles' });
    }
};

exports.addAcademicProfile = async (req, res) => {
    try {
        const { employee_id, highest_degree, academic_rank, specialization, total_publications, community_service_hours, rank } = req.body;
        
        // Check if employee exists, if not use a generic one or return error. Let's assume it's provided.
        if (!employee_id) {
             return res.status(400).json({ error: 'employee_id is required' });
        }

        const [result] = await db.query(
            'INSERT INTO academic_profiles (employee_id, highest_degree, academic_rank, specialization, total_publications, community_service_hours, rank) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [employee_id, highest_degree, academic_rank, specialization, total_publications, community_service_hours, rank]
        );
        res.status(201).json({ id: result.insertId, message: 'Academic profile added successfully' });
    } catch (err) {
        console.error('Error adding academic profile:', err);
        res.status(500).json({ error: 'Failed to add academic profile' });
    }
};
