const db = require('./DB_config/db');
const bcrypt = require('bcryptjs');

const users = [
    { email: 'admin@uog.edu.et', role: 'admin', name: 'Super Admin' },
    { email: 'hr@uog.edu.et', role: 'hr', name: 'HR Officer' },
    { email: 'manager@uog.edu.et', role: 'manager', name: 'Department Manager' },
    { email: 'manager@hrplus.com', role: 'manager', name: 'HRPlus Manager' },
    { email: 'employee@uog.edu.et', role: 'employee', name: 'John Doe' }
];

async function seedUsers() {
    try {
        console.log("Seeding users...");
        const passwordHash = await bcrypt.hash('password123', 8);

        for (const user of users) {
            // Check if user exists
            const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [user.email]);

            if (existing.length === 0) {
                console.log(`Creating user: ${user.email} (${user.role})`);
                await db.query(
                    'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)',
                    [user.email, passwordHash, user.role]
                );
            } else {
                console.log(`User already exists: ${user.email}. Updating role/password...`);
                await db.query(
                    'UPDATE users SET role = ?, password_hash = ? WHERE email = ?',
                    [user.role, passwordHash, user.email]
                );
            }
        }

        console.log("Seeding complete. Password is 'password123' for all accounts.");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding users:", error);
        process.exit(1);
    }
}

seedUsers();
