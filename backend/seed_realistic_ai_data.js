const db = require('./DB_config/db');

const rolesAndDepts = [
    { department: "Computer Science", role: "Lecturer" },
    { department: "Computer Science", role: "Professor" },
    { department: "Information Technology", role: "Lab Assistant" },
    { department: "Information Technology", role: "Senior Lecturer" },
    { department: "Software Engineering", role: "Assistant Professor" },
    { department: "Human Resources", role: "HR Specialist" },
    { department: "Administration", role: "Clerk" }
];

const firstNames = ["James", "Maria", "David", "Sarah", "John", "Ahmed", "Fatima", "Abebe", "Selam", "Robert", "Emily", "Michael", "Eskinder", "Helen", "Solomon", "Tigist", "Yonas", "Bruktawit", "Dawit", "Meron"];
const lastNames = ["Smith", "Wilson", "Tadesse", "Connor", "Bekele", "Alemu", "Kebede", "Johnson", "Brown", "Mekonnen", "Assefa", "Tesfaye", "Hailu", "Worku", "Getachew", "Gizaw", "Addis", "Legesse", "Belay", "Desta"];

function randomDatePast2Years() {
    const d = new Date();
    d.setFullYear(d.getFullYear() - Math.floor(Math.random() * 2));
    d.setMonth(Math.floor(Math.random() * 12));
    d.setDate(Math.floor(Math.random() * 28) + 1);
    return d.toISOString().split('T')[0];
}

async function seedData() {
    try {
        console.log("Emptying employees for fresh AI seed...");
        await db.query('DELETE FROM employees WHERE employee_id_number LIKE "EMP-AI-%"');
        
        for (let i = 0; i < 20; i++) {
            const fName = firstNames[i % firstNames.length];
            const lName = lastNames[i % lastNames.length];
            const deptRole = rolesAndDepts[Math.floor(Math.random() * rolesAndDepts.length)];
            const dateJoined = randomDatePast2Years();
            const email = `${fName.toLowerCase()}.${lName.toLowerCase()}@uog.edu.et`;
            const empType = Math.random() > 0.8 ? "Contract" : "Full-Time";
            const staffCategory = "Academic";
            
            await db.query(`
                INSERT INTO employees 
                (first_name, last_name, email, department, role, date_of_joining, employment_type, staff_category, status, employee_id_number, gender) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Active', ?, ?)
            `, [fName, lName, email, deptRole.department, deptRole.role, dateJoined, empType, staffCategory, `EMP-AI-${i+100}`, Math.random() > 0.5 ? 'Male' : 'Female']);
        }
        console.log("✅ 20 Realistic AI Employees Seeded!");
        
        console.log("Seeding realistic candidates...");
        await db.query('DELETE FROM candidates');
        const c_names = [["Alex", "Turner"], ["Sophia", "Chen"], ["Marcus", "Johnson"], ["Elena", "Rodriguez"], ["David", "Kim"]];
        
        for (let i = 0; i < c_names.length; i++) {
            const [c_f, c_l] = c_names[i];
            const score = Math.floor(Math.random() * 50) + 40;
            const pred = score > 80 ? 'High' : (score > 60 ? 'Medium' : 'Low');
            await db.query(`
                INSERT INTO candidates (first_name, last_name, resume_text, ai_match_score, prediction_label)
                VALUES (?, ?, ?, ?, ?)
            `, [c_f, c_l, `Experienced in Python, Node, matching job requirements well over ${i+3} years of experience.`, score, pred]);
        }
        console.log("✅ realistic candidates Seeded!");
        
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
seedData();
