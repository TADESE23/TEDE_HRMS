const db = require('./DB_config/db');

async function check() {
    try {
        const [e] = await db.query('DESCRIBE employees');
        const [l] = await db.query('DESCRIBE leaves');
        const [u] = await db.query('DESCRIBE users');

        console.log('Employees:', e.map(x => x.Field).filter(f => f.includes('date') || f.includes('created') || f.includes('time')));
        console.log('Leaves:', l.map(x => x.Field).filter(f => f.includes('date') || f.includes('created') || f.includes('time')));
        console.log('Users:', u.map(x => x.Field).filter(f => f.includes('date') || f.includes('created') || f.includes('time') || f.includes('login')));

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
check();
