const db = require('../DB_config/db');

exports.getGoals = async (req, res) => {
    try {
        const { employee_id } = req.query;
        let query = 'SELECT pg.*, e.first_name, e.last_name FROM performance_goals pg JOIN employees e ON pg.employee_id = e.id';
        const params = [];
        
        if (employee_id) {
            query += ' WHERE pg.employee_id = ?';
            params.push(employee_id);
        }
        
        query += ' ORDER BY pg.target_date ASC';
        
        const [goals] = await db.query(query, params);
        res.status(200).json(goals);
    } catch (error) {
        console.error("Performance Error:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.addGoal = async (req, res) => {
    try {
        const { employee_id, title, description, target_date } = req.body;
        
        const [result] = await db.query(
            'INSERT INTO performance_goals (employee_id, title, description, target_date) VALUES (?, ?, ?, ?)',
            [employee_id, title, description, target_date]
        );
        
        const [newGoal] = await db.query('SELECT pg.*, e.first_name, e.last_name FROM performance_goals pg JOIN employees e ON pg.employee_id = e.id WHERE pg.id = ?', [result.insertId]);
        res.status(201).json(newGoal[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAppraisals = async (req, res) => {
    try {
        const { employee_id } = req.query;
        let query = `
            SELECT a.*, e.first_name as emp_fn, e.last_name as emp_ln, r.first_name as rev_fn, r.last_name as rev_ln 
            FROM appraisals a 
            JOIN employees e ON a.employee_id = e.id
            LEFT JOIN employees r ON a.reviewer_id = r.id
        `;
        const params = [];
        
        if (employee_id) {
            query += ' WHERE a.employee_id = ?';
            params.push(employee_id);
        }
        
        const [appraisals] = await db.query(query, params);
        res.status(200).json(appraisals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addAppraisal = async (req, res) => {
    try {
        const { employee_id, review_period, score, feedback } = req.body;
        const reviewer_id = req.user.id; // from auth middleware
        
        const [result] = await db.query(
            'INSERT INTO appraisals (employee_id, reviewer_id, review_period, score, feedback, status) VALUES (?, ?, ?, ?, ?, ?)',
            [employee_id, reviewer_id, review_period, score, feedback, 'Submitted']
        );
        
        res.status(201).json({ success: true, id: result.insertId });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
