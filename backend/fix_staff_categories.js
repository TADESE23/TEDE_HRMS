const db = require('./DB_config/db');

async function finalFix() {
    try {
        // ALTER the ENUM to include all 4 staff categories
        console.log('Altering staff_category ENUM...');
        await db.query(`
            ALTER TABLE employees 
            MODIFY COLUMN staff_category ENUM('Academic','Administrative','Technical','Health') NOT NULL DEFAULT 'Academic'
        `);
        console.log('✅ ENUM updated to include Health.');

        // Now apply the correct categories
        await db.query("UPDATE employees SET staff_category = 'Health' WHERE role IN ('Nurse','Health Officer','Pharmacist') OR department IN ('Campus Health Center','Doctor of Veterinary Medicine (DVM)','Veterinary Pharmacy','Veterinary Pathology & Parasitology')");
        await db.query("UPDATE employees SET staff_category = 'Administrative' WHERE role IN ('Clerk','HR Specialist') OR department = 'Administration'");
        await db.query("UPDATE employees SET staff_category = 'Technical' WHERE role IN ('Lab Technician','Lab Assistant','Research Assistant','Network Administrator','System Administrator') OR department = 'ICT Center'");
        await db.query("UPDATE employees SET staff_category = 'Academic' WHERE staff_category = '' OR staff_category IS NULL");

        // Final summary
        const [summary] = await db.query('SELECT staff_category, COUNT(*) as count FROM employees GROUP BY staff_category ORDER BY count DESC');
        console.log('\n📊 Final Staff Category Breakdown:');
        summary.forEach(r => console.log(`   ${r.staff_category}: ${r.count} employees`));

        const [total] = await db.query('SELECT COUNT(*) as total FROM employees');
        console.log(`\n   Total: ${total[0].total} employees`);

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
finalFix();
