const db = require('./DB_config/db');

async function standardizeEmails() {
    try {
        const [employees] = await db.query('SELECT id, first_name, last_name, email FROM employees');
        console.log(`Checking ${employees.length} employees...`);

        for (const emp of employees) {
            const firstName = emp.first_name.toLowerCase().replace(/[^a-z0-9]/g, '');
            const lastName = emp.last_name.toLowerCase().replace(/[^a-z0-9]/g, '');
            const targetEmail = `${firstName}.${lastName}@uog.edu.et`;

            if (emp.email && emp.email.endsWith('@uog.edu.et') && !emp.email.startsWith('test_') && !emp.email.startsWith('emp_')) {
                // Already valid university email
                continue;
            }

            // Generate and check for uniqueness
            let finalEmail = targetEmail;
            let counter = 1;
            
            while (true) {
                const [exists] = await db.query('SELECT id FROM employees WHERE email = ? AND id != ?', [finalEmail, emp.id]);
                if (exists.length === 0) break;
                counter++;
                finalEmail = `${firstName}.${lastName}${counter}@uog.edu.et`;
            }

            console.log(`Updating ID ${emp.id}: ${emp.email} -> ${finalEmail}`);
            await db.query('UPDATE employees SET email = ? WHERE id = ?', [finalEmail, emp.id]);
        }

        console.log("Standardization complete.");
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

standardizeEmails();
