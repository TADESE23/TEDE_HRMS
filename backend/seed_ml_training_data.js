const db = require('./DB_config/db');

async function seedTrainingData() {
    try {
        console.log('Seeding candidate_matching_features...');
        await db.query(`
            CREATE TABLE IF NOT EXISTS candidate_matching_features (
                id INT AUTO_INCREMENT PRIMARY KEY,
                education_match INT,
                experience_gap INT,
                salary_fit FLOAT,
                interview_score INT,
                skill_score FLOAT,
                hired INT
            )
        `);
        
        // Seed 100 rows of dummy data for candidate training
        for (let i = 0; i < 100; i++) {
            const edu = Math.random() > 0.5 ? 1 : 0;
            const exp = Math.floor(Math.random() * 5);
            const sal = Math.random();
            const intv = Math.floor(Math.random() * 100);
            const skill = Math.random();
            const hired = (edu && intv > 60 && skill > 0.6) ? 1 : 0;
            
            await db.query(`
                INSERT INTO candidate_matching_features (education_match, experience_gap, salary_fit, interview_score, skill_score, hired)
                VALUES (?, ?, ?, ?, ?, ?)
            `, [edu, exp, sal, intv, skill, hired]);
        }

        console.log('Seeding hr_forecast_features...');
        await db.query(`
            CREATE TABLE IF NOT EXISTS hr_forecast_features (
                id INT AUTO_INCREMENT PRIMARY KEY,
                current_staff INT,
                avg_age FLOAT,
                contract_staff INT,
                low_performers INT,
                predicted_attrition FLOAT,
                required_staff_next_year INT
            )
        `);

        // Seed 50 rows of dummy data for forecast training
        for (let i = 0; i < 50; i++) {
            const current = Math.floor(Math.random() * 200) + 50;
            const age = 25 + Math.random() * 30;
            const contract = Math.floor(Math.random() * 20);
            const low = Math.floor(Math.random() * 10);
            const attrition = Math.random() * 0.2;
            const required = Math.round(current * (1 + Math.random() * 0.1));
            
            await db.query(`
                INSERT INTO hr_forecast_features (current_staff, avg_age, contract_staff, low_performers, predicted_attrition, required_staff_next_year)
                VALUES (?, ?, ?, ?, ?, ?)
            `, [current, age, contract, low, attrition, required]);
        }

        console.log('✅ Training data seeded successfully!');
        process.exit(0);
    } catch (e) {
        console.error('Error seeding training data:', e);
        process.exit(1);
    }
}

seedTrainingData();
