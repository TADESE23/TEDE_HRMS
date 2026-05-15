const db = require('./DB_config/db');

async function testForecast() {
    const [categoryCounts] = await db.query(`
        SELECT
            staff_category AS category,
            COUNT(*) AS current_staff,
            AVG(TIMESTAMPDIFF(YEAR, date_of_joining, CURDATE())) AS avg_tenure,
            SUM(employment_type = 'Contract') AS contract_staff
        FROM employees
        WHERE status = 'Active'
        GROUP BY staff_category
    `);

    const attritionByCategory = {
        Academic: 0.06, Technical: 0.05, Administrative: 0.04, Health: 0.07
    };

    const payload = categoryCounts.map(row => ({
        category:           row.category,
        current_staff:      parseInt(row.current_staff),
        avg_age:            38 + (parseFloat(row.avg_tenure) || 0),
        contract_staff:     parseInt(row.contract_staff) || 0,
        low_performers:     Math.floor(parseInt(row.current_staff) * 0.04),
        predicted_attrition: attritionByCategory[row.category] || 0.05
    }));

    console.log('--- Staff Input Payload ---');
    payload.forEach(p => console.log(`${p.category}: current=${p.current_staff}, contract=${p.contract_staff}, attrition=${p.predicted_attrition}`));

    const resp = await fetch('http://127.0.0.1:5001/forecast_by_category', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload)
    });

    if (!resp.ok) {
        console.error('AI Server error:', resp.status, await resp.text());
        process.exit(1);
    }

    const result = await resp.json();
    console.log('\n--- AI Forecast Results ---');
    result.forEach(r => {
        console.log(`${r.category}: current=${r.current_staff} → predicted=${r.predicted_staff} (gap=${r.gap}, conf=${r.confidence}%)`);
    });

    process.exit(0);
}

testForecast().catch(e => { console.error(e); process.exit(1); });
