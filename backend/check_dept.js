const db = require('./DB_config/db');

async function main() {
    // Check full view definition
    const [viewDef] = await db.query("SHOW CREATE VIEW view_employees_extended");
    console.log('Full view:');
    console.log(viewDef[0]['Create View']);

    // Check colleges table
    try {
        const [colleges] = await db.query('SELECT * FROM colleges');
        console.log('\nColleges:');
        console.log(JSON.stringify(colleges, null, 2));
    } catch(e) { console.log('colleges error:', e.message); }

    // Check the legacy 'department' column values vs departments table
    const [legacyDepts] = await db.query(`
        SELECT DISTINCT department, COUNT(*) as cnt 
        FROM employees 
        WHERE department IS NOT NULL 
        GROUP BY department
    `);
    console.log('\nLegacy department text values:');
    console.log(JSON.stringify(legacyDepts, null, 2));

    // Check non-academic depts (Administration, Campus Health, ICT)
    const [nonAcademic] = await db.query(`
        SELECT id, first_name, last_name, department, staff_category, role 
        FROM employees 
        WHERE department IN ('Administration', 'Campus Health Center', 'ICT Center')
        LIMIT 10
    `);
    console.log('\nNon-academic employees:');
    console.log(JSON.stringify(nonAcademic, null, 2));

    process.exit(0);
}

main().catch(e => { console.error(e.message); process.exit(1); });
