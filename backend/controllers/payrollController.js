const db = require('../DB_config/db');

exports.getPayrollRecords = async (req, res) => {
    try {
        const { month_year } = req.query;
        let query = `
            SELECT pr.*, e.first_name, e.last_name, e.employee_id_number, d.name as department 
            FROM payroll_records pr 
            JOIN employees e ON pr.employee_id = e.id
            LEFT JOIN departments d ON e.department_id = d.id
        `;
        const params = [];
        
        if (month_year) {
            // Assume month_year format is 'YYYY-MM-01' or similar
            query += ' WHERE DATE_FORMAT(pr.month_year, "%Y-%m") = ?';
            params.push(month_year);
        }
        
        query += ' ORDER BY pr.id DESC';
        
        const [records] = await db.query(query, params);
        res.status(200).json(records);
    } catch (error) {
        console.error("Payroll Error:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.generatePayroll = async (req, res) => {
    try {
        const { month_year } = req.body;
        
        // Very basic simulation of payroll generation
        // 1. Get all active employees with their salary scales
        const [employees] = await db.query(`
            SELECT e.id, ss.base_salary 
            FROM employees e 
            JOIN salary_scales ss ON e.salary_scale_id = ss.id 
            WHERE e.status = 'Active'
        `);
        
        for (let emp of employees) {
            // Simplified Ethiopian tax calculation placeholder
            const basic = parseFloat(emp.base_salary);
            const house_all = 0.0; // Placeholders
            const transport_all = 600.0;
            const gross = basic + house_all + transport_all;
            
            // Simplified tax brackets (NOT accurate for real ETB tax law, just simulation)
            let tax = 0;
            if (gross > 10900) tax = gross * 0.35 - 1500;
            else if (gross > 7800) tax = gross * 0.30 - 1000;
            else tax = gross * 0.20;
            
            const pension = basic * 0.07;
            const net_pay = gross - tax - pension;
            
            // Check if record exists
            const [existing] = await db.query('SELECT id FROM payroll_records WHERE employee_id = ? AND DATE_FORMAT(month_year, "%Y-%m") = ?', [emp.id, month_year]);
            
            if (existing.length === 0) {
                await db.query(`
                    INSERT INTO payroll_records 
                    (employee_id, month_year, basic_salary, house_allowance, transport_allowance, taxable_income, income_tax, pension_7_percent, net_pay, status) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `, [emp.id, `${month_year}-01`, basic, house_all, transport_all, gross, tax, pension, net_pay, 'Draft']);
            }
        }
        
        res.status(200).json({ success: true, message: 'Payroll generation completed.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.approvePayroll = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('UPDATE payroll_records SET status = "Processed" WHERE id = ?', [id]);
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
