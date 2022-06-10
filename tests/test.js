const db = require('../src/database/db.js');

db.query('SELECT * FROM service', function(err, rows) {
    if (err) {
        console.log('Error fetching services.')
        process.exit(1)
    }
    
    // console.log('Services: ', rows);

    for (let i of rows.rows) {
        console.log("row:", i.service_type)
    }
})
