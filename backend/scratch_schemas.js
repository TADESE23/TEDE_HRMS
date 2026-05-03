const db = require('./DB_config/db');

async function check() {
    try {
        const [a] = await db.query('DESCRIBE academic_profiles');
        const [d] = await db.query('DESCRIBE disciplinary_actions');
        const [t] = await db.query('DESCRIBE training_developments');

        console.log('\n--- Academic Profiles ---');
        console.table(a);

        console.log('\n--- Disciplinary Actions ---');
        console.table(d);

        console.log('\n--- Training Developments ---');
        console.table(t);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
check();
