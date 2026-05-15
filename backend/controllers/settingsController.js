const db = require('../DB_config/db');

// --- Colleges & Departments (Structure) ---

exports.getStructure = async (req, res) => {
    try {
        const [colleges] = await db.query('SELECT * FROM colleges');
        const [departments] = await db.query('SELECT * FROM departments');
        
        // Group departments by college
        const structure = colleges.map(college => {
            return {
                ...college,
                departments: departments.filter(d => d.college_id === college.id)
            };
        });
        
        res.status(200).json(structure);
    } catch (error) {
        console.error("Settings Error:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.addCollege = async (req, res) => {
    try {
        const { name, dean_name, campus_id = 1 } = req.body;
        const [result] = await db.query('INSERT INTO colleges (name, dean_name, campus_id) VALUES (?, ?, ?)', [name, dean_name, campus_id]);
        
        const [newCollege] = await db.query('SELECT * FROM colleges WHERE id = ?', [result.insertId]);
        res.status(201).json(newCollege[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addDepartment = async (req, res) => {
    try {
        const { name, head_of_department, college_id } = req.body;
        const [result] = await db.query('INSERT INTO departments (name, head_of_department, college_id) VALUES (?, ?, ?)', [name, head_of_department, college_id]);
        
        const [newDept] = await db.query('SELECT * FROM departments WHERE id = ?', [result.insertId]);
        res.status(201).json(newDept[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- Salary Scales (Jobs) ---

exports.getJobs = async (req, res) => {
    try {
        const [scales] = await db.query('SELECT * FROM salary_scales');
        res.status(200).json(scales);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addJob = async (req, res) => {
    try {
        const { grade_name, base_salary, max_salary, currency = 'ETB' } = req.body;
        const [result] = await db.query('INSERT INTO salary_scales (grade_name, base_salary, max_salary, currency) VALUES (?, ?, ?, ?)', [grade_name, base_salary, max_salary, currency]);
        
        const [newJob] = await db.query('SELECT * FROM salary_scales WHERE id = ?', [result.insertId]);
        res.status(201).json(newJob[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- Campuses (Organization) ---
exports.getCampuses = async (req, res) => {
    try {
        const [campuses] = await db.query('SELECT * FROM campuses');
        res.status(200).json(campuses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
