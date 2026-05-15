const db = require('./DB_config/db');

async function check() {
    try {
        const [ranks] = await db.query('SELECT `rank`, COUNT(*) as count FROM academic_profiles GROUP BY `rank`');
        console.log('Ranks:', JSON.stringify(ranks, null, 2));

        const [categories] = await db.query('SELECT staff_category, COUNT(*) as count FROM employees GROUP BY staff_category');
        console.log('Categories:', JSON.stringify(categories, null, 2));

        const [gender] = await db.query('SELECT gender, COUNT(*) as count FROM employees GROUP BY gender');
        console.log('Gender:', JSON.stringify(gender, null, 2));

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

check();
