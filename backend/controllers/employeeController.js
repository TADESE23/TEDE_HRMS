const db = require('../DB_config/db');
const bcrypt = require('bcryptjs');
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

// Map HR Roles to System Roles
const mapToSystemRole = (hrRole) => {
    const role = hrRole.toLowerCase();
    if (role.includes('admin')) return 'admin';
    if (role.includes('hr') || role.includes('human resource')) return 'hr';
    if (role.includes('head') || role.includes('manager') || role.includes('dean')) return 'manager';
    return 'employee';
};

exports.createEmployee = async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const {
            firstName, middleName, lastName, email, emailPersonal,
            phone, dateOfBirth, gender, address,
            idNumber, department, role, status, academicRank,
            password // New field for onboarding
        } = req.body;

        // 1. Create User Account automatically
        const systemRole = mapToSystemRole(role);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password || 'Welcome123!', salt);

        const [userResult] = await connection.query(
            'INSERT INTO users (email, password_hash, role, status) VALUES (?, ?, ?, ?)',
            [email, hashedPassword, systemRole, 'Active']
        );
        const userId = userResult.insertId;

        // Lookup department_id
        const [deptResult] = await connection.query('SELECT id, name FROM departments WHERE name = ?', [department]);
        const department_id = deptResult.length > 0 ? deptResult[0].id : null;
        const department_name = deptResult.length > 0 ? deptResult[0].name : department;

        // 2. Insert into employees table linked to userId
        const [empResult] = await connection.query(
            `INSERT INTO employees 
            (user_id, first_name, middle_name, last_name, email, email_personal, phone, date_of_birth, gender, address, 
             employee_id_number, department, department_id, role, status, date_of_joining)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
            [
                userId, firstName, middleName, lastName, email, emailPersonal, 
                phone, dateOfBirth, gender, address,
                idNumber, department_name, department_id, role, status
            ]
        );

        const employeeId = empResult.insertId;

        // 3. If it's an academic role, insert into academic_profiles
        if (academicRank) {
            await connection.query(
                `INSERT INTO academic_profiles (employee_id, \`rank\`) VALUES (?, ?)`,
                [employeeId, academicRank]
            );
        }

        await connection.commit();

        res.status(201).json({
            message: 'Employee onboarding successful. User account created.',
            id: employeeId,
            userId: userId
        });

    } catch (error) {
        await connection.rollback();
        console.error("Error creating employee:", error);
        res.status(500).json({ message: error.message });
    } finally {
        connection.release();
    }
};

exports.updateEmployee = async (req, res) => {
    try {
        const id = req.params.id;
        const isAdmin = ['admin', 'hr', 'HR Officer'].includes(req.user.role);
        
        // 1. Verify existence and permissions
        const [emp] = await db.query('SELECT user_id, email, employee_id_number, department, role, status FROM employees WHERE id = ?', [id]);
        if (emp.length === 0) return res.status(404).json({ message: 'Employee not found' });

        const isOwner = emp[0].user_id === req.user.id;

        // If not admin and not owner, deny access
        if (!isAdmin && !isOwner) {
            return res.status(403).json({ message: 'Forbidden: You do not have permission to edit this profile.' });
        }

        let {
            firstName, middleName, lastName, email, emailPersonal,
            phone, dateOfBirth, gender, address,
            idNumber, department, role, status, academicRank
        } = req.body;

        // 2. If employee (non-admin), protect sensitive employment fields
        if (!isAdmin) {
            // Revert sensitive fields to current DB values to prevent unauthorized changes
            email = emp[0].email;
            idNumber = emp[0].employee_id_number;
            department = emp[0].department;
            role = emp[0].role;
            status = emp[0].status;
            // NOTE: Employees ARE allowed to edit personal info: 
            // firstName, middleName, lastName, phone, emailPersonal, dateOfBirth, gender, address
        }

        // Lookup department_id (if department changed or for consistency)
        const [deptResult] = await db.query('SELECT id, name FROM departments WHERE name = ?', [department]);
        const department_id = deptResult.length > 0 ? deptResult[0].id : null;
        const department_name = deptResult.length > 0 ? deptResult[0].name : department;

        // 3. Update core employee details
        await db.query(
            `UPDATE employees SET 
            first_name = ?, middle_name = ?, last_name = ?, email = ?, 
            email_personal = ?, phone = ?, date_of_birth = ?, gender = ?, address = ?,
            employee_id_number = ?, department = ?, department_id = ?, 
            role = ?, status = ?
            WHERE id = ?`,
            [
                firstName, middleName, lastName, email, 
                emailPersonal, phone, dateOfBirth, gender, address,
                idNumber, department_name, department_id, role, status, id
            ]
        );

        // 4. Update or Insert academic profile if rank is provided
        if (academicRank) {
            // Check if profile exists
            const [profiles] = await db.query('SELECT * FROM academic_profiles WHERE employee_id = ?', [id]);

            // If not admin, they can't change their rank if it's already set or at all? 
            // Usually rank is HR controlled. Let's protect it for non-admins.
            if (!isAdmin && profiles.length > 0 && profiles[0].rank !== academicRank) {
                // Ignore the change from employee
                academicRank = profiles[0].rank;
            }

            if (profiles.length > 0) {
                if (isAdmin) { // Only admin can update existing rank
                    await db.query(
                        `UPDATE academic_profiles SET \`rank\` = ? WHERE employee_id = ?`,
                        [academicRank, id]
                    );
                }
            } else {
                // If it doesn't exist, maybe allow initial set? 
                // Better to restrict to Admin only as per typical HR policy.
                if (isAdmin) {
                    await db.query(
                        `INSERT INTO academic_profiles (employee_id, \`rank\`) VALUES (?, ?)`,
                        [id, academicRank]
                    );
                }
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
