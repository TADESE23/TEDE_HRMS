const db = require('../DB_config/db');
const path = require('path');
const multer = require('multer');

// Configure multer for profile photo uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/profiles');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
    }
});

exports.uploadPhoto = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) return cb(null, true);
        cb(new Error("Only images are allowed"));
    }
}).single('photo');

exports.updateProfilePhoto = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const employeeId = req.params.id;
        const photoUrl = `/uploads/profiles/${req.file.filename}`;

        // Verify ownership (same as updateEmployee)
        const [emp] = await db.query('SELECT user_id FROM employees WHERE id = ?', [employeeId]);
        if (emp.length === 0) return res.status(404).json({ message: 'Employee not found' });
        
        // Only owner can update their photo
        if (emp[0].user_id !== req.user.id) {
            return res.status(403).json({ message: 'Forbidden: You can only update your own photo.' });
        }

        await db.query('UPDATE employees SET photo_url = ? WHERE id = ?', [photoUrl, employeeId]);

        res.status(200).json({
            message: 'Photo updated successfully',
            photo_url: photoUrl
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllEmployees = async (req, res) => {
    try {
        // Use the VIEW created in schema for simpler querying
        const [employees] = await db.query('SELECT * FROM view_employees_extended ORDER BY date_of_joining DESC');
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMe = async (req, res) => {
    try {
        // Find employee by user_id from the authenticated token
        const [employee] = await db.query('SELECT * FROM view_employees_extended WHERE user_id = ?', [req.user.id]);
        
        if (employee.length === 0) {
            return res.status(404).json({ message: 'Employee profile not found' });
        }

        const id = employee[0].id;
        // Fetch related data concurrently
        const [academics] = await db.query('SELECT * FROM academic_profiles WHERE employee_id = ?', [id]);
        const [history] = await db.query('SELECT * FROM employee_history WHERE employee_id = ? ORDER BY event_date DESC', [id]);
        const [docCount] = await db.query('SELECT COUNT(*) AS cnt FROM documents WHERE employee_id = ?', [id]);

        res.status(200).json({
            ...employee[0],
            academic_profile: academics[0] || null,
            employment_history: history,
            document_count: docCount[0]?.cnt ?? 0
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getEmployeeById = async (req, res) => {
    try {
        const [employee] = await db.query('SELECT * FROM view_employees_extended WHERE id = ?', [req.params.id]);
        if (employee.length === 0) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // ACCESS CONTROL: If the user is an 'employee', they can ONLY see their own profile
        if (req.user.role === 'employee' && employee[0].user_id !== req.user.id) {
            return res.status(403).json({ message: 'Access denied: Employees can only view their own profile.' });
        }

        const id = employee[0].id;
        const [academics] = await db.query('SELECT * FROM academic_profiles WHERE employee_id = ?', [id]);
        const [history] = await db.query('SELECT * FROM employee_history WHERE employee_id = ? ORDER BY event_date DESC', [id]);

        res.status(200).json({
            ...employee[0],
            academic_profile: academics[0] || null,
            employment_history: history
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createEmployee = async (req, res) => {
    try {
        const {
            firstName, lastName, email, idNumber,
            department, role, status, academicRank
        } = req.body;

        // Start transaction (simplified as separate queries for now, ideal to use TRANSACTION)

        // Lookup department_id
        const [deptResult] = await db.query('SELECT id, name FROM departments WHERE name = ?', [department]);
        const department_id = deptResult.length > 0 ? deptResult[0].id : null;
        const department_name = deptResult.length > 0 ? deptResult[0].name : department;

        // 1. Insert into employees table
        // Mapping frontend fields to DB columns
        const [result] = await db.query(
            `INSERT INTO employees 
            (first_name, last_name, email, employee_id_number, department, department_id, role, status, date_of_joining)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
            [firstName, lastName, email, idNumber, department_name, department_id, role, status]
        );

        const employeeId = result.insertId;

        // 2. If it's an academic role, insert into academic_profiles
        if (academicRank) {
            await db.query(
                `INSERT INTO academic_profiles (employee_id, \`rank\`) VALUES (?, ?)`,
                [employeeId, academicRank]
            );
        }

        res.status(201).json({
            message: 'Employee created successfully',
            id: employeeId
        });

    } catch (error) {
        console.error("Error creating employee:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.updateEmployee = async (req, res) => {
    try {
        const id = req.params.id;
        const {
            firstName, lastName, email, idNumber,
            department, role, status, academicRank
        } = req.body;

        // Verify ownership: Only the employee themselves can edit their own profile
        const [emp] = await db.query('SELECT user_id FROM employees WHERE id = ?', [id]);
        if (emp.length === 0) return res.status(404).json({ message: 'Employee not found' });

        if (emp[0].user_id !== req.user.id) {
            return res.status(403).json({ message: 'Forbidden: You can only edit your own profile.' });
        }

        // Lookup department_id
        const [deptResult] = await db.query('SELECT id, name FROM departments WHERE name = ?', [department]);
        const department_id = deptResult.length > 0 ? deptResult[0].id : null;
        const department_name = deptResult.length > 0 ? deptResult[0].name : department;

        // Update core employee details
        await db.query(
            `UPDATE employees SET 
            first_name = ?, last_name = ?, email = ?, 
            employee_id_number = ?, department = ?, department_id = ?, 
            role = ?, status = ?
            WHERE id = ?`,
            [firstName, lastName, email, idNumber, department_name, department_id, role, status, id]
        );

        // Update or Insert academic profile if rank is provided
        if (academicRank) {
            // Check if profile exists
            const [profiles] = await db.query('SELECT * FROM academic_profiles WHERE employee_id = ?', [id]);

            if (profiles.length > 0) {
                await db.query(
                    `UPDATE academic_profiles SET \`rank\` = ? WHERE employee_id = ?`,
                    [academicRank, id]
                );
            } else {
                await db.query(
                    `INSERT INTO academic_profiles (employee_id, \`rank\`) VALUES (?, ?)`,
                    [id, academicRank]
                );
            }
        }

        res.status(200).json({ message: 'Employee updated successfully' });
    } catch (error) {
        console.error("Error updating employee:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.deleteEmployee = async (req, res) => {
    try {
        await db.query('DELETE FROM employees WHERE id = ?', [req.params.id]);
        res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
