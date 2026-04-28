const db = require('./DB_config/db');

async function seed() {
    try {
        console.log("Creating AI training tables...");
        
        // HR Forecast Features Table
        await db.query(`
            CREATE TABLE IF NOT EXISTS hr_forecast_features (
                id INT AUTO_INCREMENT PRIMARY KEY,
                current_staff INT,
                avg_age FLOAT,
                contract_staff INT,
                low_performers INT,
                predicted_attrition INT,
                required_staff_next_year INT
            )
        `);

        await db.query('TRUNCATE TABLE hr_forecast_features');
        await db.query(`
            INSERT INTO hr_forecast_features (current_staff, avg_age, contract_staff, low_performers, predicted_attrition, required_staff_next_year) VALUES 
            (100, 35, 10, 5, 8, 110),
            (120, 34, 15, 6, 10, 130),
            (80, 40, 5, 2, 5, 85),
            (150, 30, 20, 10, 15, 160),
            (200, 36, 10, 12, 18, 205)
        `);

        // Candidate Matching Features Table
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

        await db.query('TRUNCATE TABLE candidate_matching_features');
        await db.query(`
            INSERT INTO candidate_matching_features (education_match, experience_gap, salary_fit, interview_score, skill_score, hired) VALUES 
            (1, 0, 0.9, 90, 0.85, 1),
            (0, 2, 0.7, 70, 0.60, 0),
            (1, 1, 0.95, 85, 0.90, 1),
            (1, 4, 0.6, 60, 0.40, 0),
            (0, 0, 0.8, 75, 0.75, 1)
        `);

        console.log("Data seeded successfully!");
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

seed();
