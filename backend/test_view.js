const db = require('./DB_config/db');

async function test() {
    try {
        const [rows] = await db.query('SELECT * FROM view_employees_extended');
        console.log(`Found ${rows.length} rows`);
        if (rows.length > 0) {
            console.log(rows[0]);
        }
        process.exit(0);
    } catch(e) {
        console.error(e);
        process.exit(1);
    }
}
test();
