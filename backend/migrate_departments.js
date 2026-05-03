/**
 * Department Migration Script
 * 
 * This script:
 * 1. Adds missing departments to the `departments` table
 * 2. Maps all employees' legacy `department` text column → proper `department_id` FK
 * 3. Updates the view to also expose the legacy field as fallback
 */

const db = require('./DB_config/db');

// Full list of TEDE campus departments including non-academic ones
const EXTRA_DEPARTMENTS = [
    // Non-academic support departments (campus_id=1, college_id: use 0 or null for non-college)
    { name: 'Administration',                 college_id: null },
    { name: 'Campus Health Center',            college_id: null },
    { name: 'ICT Center',                      college_id: null },
    { name: 'Library',                         college_id: null },
    { name: 'Finance',                         college_id: null },
    { name: 'Human Resources',                 college_id: null },
    // Natural Science deps
    { name: 'Applied Mathematics',             college_id: 4 },
    { name: 'Environmental Science',           college_id: 3 },
];

async function main() {
    console.log('=== Department Migration Started ===\n');

    // --- Step 1: Load existing departments ---
    const [existingDepts] = await db.query('SELECT id, name FROM departments');
    const deptMap = {};
    existingDepts.forEach(d => { deptMap[d.name.toLowerCase()] = d.id; });
    console.log(`Found ${existingDepts.length} existing departments.`);

    // --- Step 2: Insert missing departments ---
    let inserted = 0;
    for (const dept of EXTRA_DEPARTMENTS) {
        const key = dept.name.toLowerCase();
        if (!deptMap[key]) {
            const [result] = await db.query(
                'INSERT INTO departments (name, college_id) VALUES (?, ?)',
                [dept.name, dept.college_id]
            );
            deptMap[key] = result.insertId;
            console.log(`  [+] Inserted department: "${dept.name}" (id=${result.insertId})`);
            inserted++;
        }
    }
    console.log(`Inserted ${inserted} new departments.\n`);

    // --- Step 3: Reload full dept map ---
    const [allDepts] = await db.query('SELECT id, name FROM departments');
    const fullMap = {};
    allDepts.forEach(d => { fullMap[d.name.toLowerCase()] = d.id; });

    // --- Step 4: Map all employees with legacy text department ---
    const [employees] = await db.query(`
        SELECT id, department 
        FROM employees 
        WHERE department IS NOT NULL AND department_id IS NULL
    `);
    console.log(`Found ${employees.length} employees with legacy department text but no department_id.\n`);

    let mapped = 0, skipped = 0;
    for (const emp of employees) {
        const deptName = (emp.department || '').trim().toLowerCase();
        const deptId = fullMap[deptName];
        if (deptId) {
            await db.query('UPDATE employees SET department_id = ? WHERE id = ?', [deptId, emp.id]);
            mapped++;
        } else {
            console.log(`  [!] Could not map dept "${emp.department}" for employee id=${emp.id}`);
            skipped++;
        }
    }
    console.log(`Mapped ${mapped} employees to department_id.`);
    console.log(`Skipped ${skipped} employees (department not found).\n`);

    // --- Step 5: Verify ---
    const [remaining] = await db.query(`
        SELECT department, COUNT(*) as cnt 
        FROM employees 
        WHERE department IS NOT NULL AND department_id IS NULL 
        GROUP BY department
    `);
    if (remaining.length > 0) {
        console.log('Employees still without department_id:');
        console.log(JSON.stringify(remaining, null, 2));
    } else {
        console.log('✅ All employees with legacy department text now have a department_id!');
    }

    // --- Step 6: Final verification ---
    const [final] = await db.query(`
        SELECT d.name as dept_name, COUNT(e.id) as emp_count 
        FROM employees e
        JOIN departments d ON e.department_id = d.id
        GROUP BY d.name
        ORDER BY emp_count DESC
    `);
    console.log('\nFinal department distribution (via FK):');
    final.forEach(r => console.log(`  ${r.dept_name}: ${r.emp_count}`));

    console.log('\n=== Migration Complete ===');
    process.exit(0);
}

main().catch(e => { console.error('Migration failed:', e.message); process.exit(1); });
