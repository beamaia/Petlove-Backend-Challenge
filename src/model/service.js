const db = require('../database/db');

class Service {
    /**
     * Returns all services from database
     * @param {*} req
     * @param {*} res 
     */
    getAll(req, res) {
        const sql = `SELECT * FROM service;`;

        db.query(sql, (error, results) => {
            if(error) {
                res.status(400).json(error)
            } else {
                res.status(200).json(results.rows)
            }
        })
    }
}

module.exports = new Service