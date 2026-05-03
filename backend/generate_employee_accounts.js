const db = require('./DB_config/db');
const bcrypt = require('bcryptjs');

async function generateAccounts() {
    const password = "password123";
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    try {
        const [employees] = await db.query('SELECT id, email, first_name FROM employees WHERE user_id IS NULL');
        console.log(`Generating accounts for ${employees.length} employees...`);

        for (const emp of employees) {
            if (!emp.email) {
                console.log(`Skipping ID ${emp.id} (no email)`);
                continue;
            }

            // 1. Create user record or find existing
            try {
                const [userResult] = await db.query(
                    'INSERT INTO users (email, password_hash, role, status) VALUES (?, ?, ?, ?)',
                    [emp.email, passwordHash, 'employee', 'Active']
                );
                const userId = userResult.insertId;

                // 2. Link employee record
                await db.query('UPDATE employees SET user_id = ? WHERE id = ?', [userId, emp.id]);
                console.log(`Created account for ${emp.first_name} (${emp.email})`);
            } catch (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    // Link to existing user if email matches
                    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [emp.email]);
                    if (existing.length > 0) {
                        await db.query('UPDATE employees SET user_id = ? WHERE id = ?', [existing[0].id, emp.id]);
                        console.log(`Linked existing account for ${emp.first_name} (${emp.email})`);
                    }
                } else {
                    console.error(`Error for ID ${emp.id}:`, err.message);
                }
            }
        }

        console.log("Process complete.");
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

generateAccounts();
