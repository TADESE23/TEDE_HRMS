const db = require('../DB_config/db');

/**
 * GET /api/departments
 * Returns all departments with employee count and college info
 */
exports.getAllDepartments = async (req, res) => {
    try {
        const [departments] = await db.query(`
            SELECT 
                d.id,
                d.name,
                d.college_id,
                c.name AS college_name,
                d.head_of_department,
                COUNT(e.id) AS employee_count
            FROM departments d
            LEFT JOIN colleges c ON d.college_id = c.id
            LEFT JOIN employees e ON e.department_id = d.id AND e.status = 'Active'
            GROUP BY d.id, d.name, d.college_id, c.name, d.head_of_department
            ORDER BY c.name ASC, d.name ASC
        `);
        res.status(200).json(departments);
    } catch (error) {
        console.error('Error fetching departments:', error);
        res.status(500).json({ message: error.message });
    }
};

/**
 * GET /api/departments/:id
 * Returns a single department with its employees
 */
exports.getDepartmentById = async (req, res) => {
    try {
        const { id } = req.params;
        const [dept] = await db.query(`
            SELECT d.*, c.name AS college_name
            FROM departments d
            LEFT JOIN colleges c ON d.college_id = c.id
            WHERE d.id = ?
        `, [id]);

        if (dept.length === 0) {
            return res.status(404).json({ message: 'Department not found' });
        }

        const [employees] = await db.query(`
            SELECT id, first_name, last_name, employee_id_number, role, staff_category, status
            FROM employees
            WHERE department_id = ?
            ORDER BY last_name ASC
        `, [id]);

        res.status(200).json({ ...dept[0], employees });
    } catch (error) {
        console.error('Error fetching department:', error);
        res.status(500).json({ message: error.message });
    }
};

/**
 * POST /api/departments
 * Create a new department (Admin only)
 */
exports.createDepartment = async (req, res) => {
    try {
        const { name, college_id, head_of_department } = req.body;
        if (!name) return res.status(400).json({ message: 'Department name is required' });

        const [result] = await db.query(
            'INSERT INTO departments (name, college_id, head_of_department) VALUES (?, ?, ?)',
            [name, college_id || null, head_of_department || null]
        );
        res.status(201).json({ id: result.insertId, name, college_id, head_of_department });
    } catch (error) {
        console.error('Error creating department:', error);
        res.status(500).json({ message: error.message });
    }
};

/**
 * PATCH /api/departments/:id/assign-employee
 * Assign (or reassign) an employee to a department
 * Body: { employeeId, departmentId }
 */
exports.assignEmployeeToDepartment = async (req, res) => {
    try {
        const { employeeId, departmentId } = req.body;
        if (!employeeId || !departmentId) {
            return res.status(400).json({ message: 'employeeId and departmentId are required' });
        }

        // Verify department exists
        const [dept] = await db.query('SELECT id, name FROM departments WHERE id = ?', [departmentId]);
        if (dept.length === 0) {
            return res.status(404).json({ message: 'Department not found' });
        }

        // Update employee's department_id (and legacy department text for consistency)
        await db.query(
            'UPDATE employees SET department_id = ?, department = ? WHERE id = ?',
            [departmentId, dept[0].name, employeeId]
        );

        // Log in employee_history
        await db.query(
            `INSERT INTO employee_history (employee_id, event_type, event_date, details)
             VALUES (?, 'Department Assignment', NOW(), ?)`,
            [employeeId, `Assigned to department: ${dept[0].name}`]
        );

        res.status(200).json({ message: `Employee assigned to ${dept[0].name} successfully` });
    } catch (error) {
        console.error('Error assigning employee to department:', error);
        res.status(500).json({ message: error.message });
    }
};

/**
 * PATCH /api/departments/:id
 * Update department details
 */
exports.updateDepartment = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, college_id, head_of_department } = req.body;

        await db.query(
            'UPDATE departments SET name = COALESCE(?, name), college_id = ?, head_of_department = ? WHERE id = ?',
            [name, college_id || null, head_of_department || null, id]
        );

        res.status(200).json({ message: 'Department updated successfully' });
    } catch (error) {
        console.error('Error updating department:', error);
        res.status(500).json({ message: error.message });
    }
};
