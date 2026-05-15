const db = require('./DB_config/db');
const bcrypt = require('bcryptjs');

const firstNames = ["Abebe", "Selam", "Dawit", "Meron", "Eskinder", "Helen", "Solomon", "Tigist", "Yonas", "Bruktawit", "Mulugeta", "Aster", "Kassa", "Zenebe", "Tewodros", "Girma", "Almaz", "Kebede", "Alemu", "Meseret"];
const lastNames = ["Bekele", "Tadesse", "Alemu", "Tesfaye", "Hailu", "Worku", "Getachew", "Gizaw", "Addis", "Legesse", "Belay", "Desta", "Mekonnen", "Assefa", "Mulu", "Habte", "Tsegaye", "Berhanu", "Fikru", "Ayelign"];

const academicDepts = ["Computer Science", "Information Technology", "Software Engineering", "Information Systems", "Electrical Engineering", "Mathematics", "Physics", "Biology"];
const academicRanks = ["Lecturer", "Senior Lecturer", "Assistant Professor", "Associate Professor", "Professor", "Graduate Assistant"];

const technicalDepts = ["ICT Infrastructure", "Laboratory Management", "Technical Support"];
const technicalRoles = ["System Administrator", "Network Engineer", "Lab Technician", "Technical Officer"];

const adminDepts = ["Human Resources", "Finance", "Procurement", "General Services"];
const adminRoles = ["HR Officer", "Accountant", "Procurement Specialist", "Administrator"];

const healthDepts = ["Campus Clinic", "Student Health Services"];
const healthRoles = ["Nurse", "Doctor", "Health Officer", "Pharmacist"];

function getRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function seedTEDEData() {
    try {
        console.log("--- Starting TEDE Realistic Data Seeding ---");

        // 1. Clear existing employees (keep users for login)
        console.log("Cleaning employees table...");
        await db.query('DELETE FROM employees');

        const passwordHash = await bcrypt.hash('password123', 8);

        const insertEmployee = async (category, count, depts, roles) => {
            console.log(`Seeding ${count} ${category} staff...`);
            for (let i = 0; i < count; i++) {
                const fName = getRandom(firstNames);
                const lName = getRandom(lastNames);
                const email = `${fName.toLowerCase()}.${lName.toLowerCase()}.${category.toLowerCase()}${i}@uog.edu.et`;
                const dept = getRandom(depts);
                const role = getRandom(roles);
                const joinDate = randomDate(new Date(2015, 0, 1), new Date()).toISOString().split('T')[0];
                const empType = Math.random() > 0.1 ? "Full-Time" : "Contract";
                const gender = Math.random() > 0.4 ? "Male" : "Female";
                const idNum = `TEDE-${category.substring(0, 3).toUpperCase()}-${1000 + i}`;

                await db.query(`
                    INSERT INTO employees 
                    (first_name, last_name, email, department, role, date_of_joining, employment_type, staff_category, status, employee_id_number, gender) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Active', ?, ?)
                `, [fName, lName, email, dept, role, joinDate, empType, category, idNum, gender]);
            }
        };

        // Seed requested numbers
        await insertEmployee("Academic", 416, academicDepts, academicRanks);
        await insertEmployee("Technical", 83, technicalDepts, technicalRoles);
        await insertEmployee("Administrative", 14, adminDepts, adminRoles);
        await insertEmployee("Health", 16, healthDepts, healthRoles);

        console.log("✅ All staff seeded successfully!");

        // 2. Seed realistic ML Training Data for Ranking (Logistic Regression)
        console.log("Seeding realistic candidate matching data for AI training...");
        await db.query('DELETE FROM candidate_matching_features');
        
        for (let i = 0; i < 500; i++) {
            // Logic: High CGPA, more publications, and more teaching exp lead to hiring for academic roles
            const cgpa = 2.5 + Math.random() * 1.5; // 2.5 - 4.0
            const publications = Math.floor(Math.random() * 15);
            const teaching_exp = Math.random() * 10;
            const interview = Math.floor(Math.random() * 101);
            const skill = 0.3 + Math.random() * 0.7;
            const edu_match = Math.random() > 0.3 ? 1 : 0;
            const exp_gap = Math.floor(Math.random() * 5);

            // Hiring criteria
            const score = (cgpa * 10) + (publications * 5) + (teaching_exp * 3) + (interview * 0.5);
            const hired = score > 75 && edu_match === 1 ? 1 : 0;

            await db.query(`
                INSERT INTO candidate_matching_features 
                (education_match, experience_gap, interview_score, skill_score, cgpa, publications, teaching_experience, hired)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `, [edu_match, exp_gap, interview, skill, cgpa, publications, teaching_exp, hired]);
        }
        console.log("✅ Candidate training data seeded!");

        // 3. Seed realistic HR Forecast Data (Linear Regression)
        console.log("Seeding realistic HR forecast data...");
        await db.query('DELETE FROM hr_forecast_features');

        for (let i = 0; i < 100; i++) {
            // Trend around the total current headcount (529)
            const baseCount = 529 + (Math.random() * 100 - 50); // 479 - 579
            const current_staff = Math.floor(baseCount);
            const avg_age = 35 + Math.random() * 15;
            const contract_staff = Math.floor(current_staff * 0.1);
            const low_performers = Math.floor(current_staff * 0.05);
            const attrition = 0.02 + Math.random() * 0.08;

            // Target next year: assume 5% growth on average
            const required_staff = Math.round(current_staff * (1.05 + (Math.random() * 0.04 - 0.02)));

            await db.query(`
                INSERT INTO hr_forecast_features 
                (current_staff, avg_age, contract_staff, low_performers, predicted_attrition, required_staff_next_year)
                VALUES (?, ?, ?, ?, ?, ?)
            `, [current_staff, avg_age, contract_staff, low_performers, attrition, required_staff]);
        }
        console.log("✅ HR forecast training data seeded!");

        console.log("--- TEDE Seeding Complete ---");
        process.exit(0);
    } catch (e) {
        console.error("Error seeding TEDE data:", e);
        process.exit(1);
    }
}

seedTEDEData();
