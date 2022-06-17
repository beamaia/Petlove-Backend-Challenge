const db = require('../database/db');

    /**
     * Returns a specific service from database
     * @param {*} req request containing service's id
     * @param {*} res 
     */
    get(req, res) {
        const sql = `SELECT * FROM Service;`;

        db.query(sql, (error, results) => {
            if(error) {
                res.status(400).json(error)
            } else {
                res.status(200).json(results.rows)
            }
        })
    }