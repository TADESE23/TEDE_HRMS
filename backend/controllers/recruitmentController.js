const db = require('../DB_config/db');

// @desc    Create a new job vacancy
// @route   POST /api/recruitment/vacancies
// @access  Admin
exports.createVacancy = async (req, res) => {
    try {
        const { title, department, type, status, closing_date, description, requirements, responsible_role } = req.body;
        const posted_by_id = req.user ? req.user.id : null;

        if (!title || !department || !type || !status || !closing_date) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        const [result] = await db.query(
            'INSERT INTO vacancies (title, department, type, status, closing_date, description, requirements, posted_by_id, responsible_role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [title, department, type, status, closing_date, description || '', requirements || '', posted_by_id, responsible_role || 'HR Admin']
        );

        res.status(201).json({
            success: true,
            data: { id: result.insertId, title, department, type, status, closing_date, posted_by_id },
            message: 'Vacancy successfully created'
        });
    } catch (error) {
        console.error('Error creating vacancy:', error);
        res.status(500).json({ success: false, message: 'Server error creating vacancy' });
    }
};

// @desc    Get all active vacancies
// @route   GET /api/recruitment/vacancies
// @access  Private
exports.getVacancies = async (req, res) => {
    try {
        const [vacancies] = await db.query(
            `SELECT v.*, u.email as posted_by_email, u.role as posted_by_role 
             FROM vacancies v 
             LEFT JOIN users u ON v.posted_by_id = u.id 
             ORDER BY v.created_at DESC`
        );

        res.status(200).json({
            success: true,
            count: vacancies.length,
            data: vacancies
        });
    } catch (error) {
        console.error('Error fetching vacancies:', error);
        res.status(500).json({ success: false, message: 'Server error fetching vacancies' });
    }
};

// @desc    Upload applicant CV and create candidate
// @route   POST /api/recruitment/candidates
// @access  Private (HR/Admin)
exports.createCandidate = async (req, res) => {
    try {
        const { first_name, last_name, resume_text } = req.body;
        const cv_file_path = req.file ? req.file.filename : null;

        if (!first_name || !last_name) {
            return res.status(400).json({ success: false, message: 'First name and last name are required' });
        }

        const [result] = await db.query(
            'INSERT INTO candidates (first_name, last_name, resume_text, cv_file_path) VALUES (?, ?, ?, ?)',
            [first_name, last_name, resume_text || '', cv_file_path]
        );

        res.status(201).json({
            success: true,
            message: 'Candidate uploaded successfully',
            data: { id: result.insertId, first_name, last_name, cv_file_path }
        });
    } catch (error) {
        console.error('Error creating candidate:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Get all candidates
// @route   GET /api/recruitment/candidates
// @access  Private
exports.getCandidates = async (req, res) => {
    try {
        const [candidates] = await db.query(`
            SELECT c.*, v.title as vacancy_title, v.department as vacancy_department
            FROM candidates c
            LEFT JOIN vacancies v ON c.vacancy_id = v.id
            ORDER BY c.id DESC
        `);
        res.status(200).json({ success: true, data: candidates });

    } catch (error) {
        console.error('Error fetching candidates:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Get all public vacancies
// @route   GET /api/recruitment/public/vacancies
// @access  Public
exports.getPublicVacancies = async (req, res) => {
    try {
        const [vacancies] = await db.query(
            `SELECT v.id, v.title, v.department, v.type, v.status, v.closing_date, v.description, v.requirements, v.responsible_role, u.email as contact_email
             FROM vacancies v
             LEFT JOIN users u ON v.posted_by_id = u.id
             WHERE v.status = 'Published' AND v.closing_date >= CURDATE() 
             ORDER BY v.created_at DESC`
        );

        res.status(200).json({
            success: true,
            count: vacancies.length,
            data: vacancies
        });
    } catch (error) {
        console.error('Error fetching public vacancies:', error);
        res.status(500).json({ success: false, message: 'Server error fetching vacancies' });
    }
};

// @desc    Apply for a job (Public)
// @route   POST /api/recruitment/public/apply
// @access  Public
exports.applyForJob = async (req, res) => {
    try {
        const { 
            vacancy_id, first_name, last_name, email, phone, resume_text,
            education_level, years_of_experience, skills, expected_salary,
            cgpa, publications, teaching_experience
        } = req.body;
        const cv_file_path = req.file ? req.file.filename : null;


        if (!first_name || !last_name || !vacancy_id || !email) {
            return res.status(400).json({ success: false, message: 'Required fields are missing' });
        }

        const [result] = await db.query(
            `INSERT INTO candidates (
                vacancy_id, first_name, last_name, email, phone, resume_text, cv_file_path,
                education_level, years_of_experience, skills, expected_salary,
                cgpa, publications, teaching_experience
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                vacancy_id, first_name, last_name, email, phone || '', resume_text || '', cv_file_path,
                education_level || '', years_of_experience || 0, skills || '', expected_salary || 0,
                cgpa || 0, publications || 0, teaching_experience || 0
            ]
        );


        res.status(201).json({
            success: true,
            message: 'Application submitted successfully',
            data: { id: result.insertId }
        });
    } catch (error) {
        console.error('Error applying for job:', error);
        res.status(500).json({ success: false, message: 'Server error submitting application' });
    }
};
