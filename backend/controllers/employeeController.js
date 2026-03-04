const db = require('../DB_config/db');

exports.getAllEmployees = async (req, res) => {
    try {
        // Use the VIEW created in schema for simpler querying
        const [employees] = await db.query('SELECT * FROM view_employees_extended ORDER BY date_of_joining DESC');
        res.status(200).json(employees);
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

        // Fetch related data concurrently
        const [academics] = await db.query('SELECT * FROM academic_profiles WHERE employee_id = ?', [req.params.id]);
        const [history] = await db.query('SELECT * FROM employee_history WHERE employee_id = ? ORDER BY event_date DESC', [req.params.id]);

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

        // 1. Insert into employees table
        // Mapping frontend fields to DB columns
        const [result] = await db.query(
            `INSERT INTO employees 
            (first_name, last_name, email, employee_id_number, department, role, status, date_of_joining)
            VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
            [firstName, lastName, email, idNumber, department, role, status]
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

        // Update core employee details
        await db.query(
            `UPDATE employees SET 
            first_name = ?, last_name = ?, email = ?, 
            employee_id_number = ?, department = ?, 
            role = ?, status = ?
            WHERE id = ?`,
            [firstName, lastName, email, idNumber, department, role, status, id]
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
