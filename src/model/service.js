const db = require('../database/db');

class Service {

    /**
     * Returns services from database by id
     * @param {*} req
     * @param {*} res 
     */
    get(req, res) {
        let id = req.params.id

        if (isNaN(id)) {
            return res.status(400).json("Invalid Id");
        }

        const sql = `SELECT * FROM service WHERE id_service='${id}';`;

        db.query(sql, (error, results) => {
            if(error) {
                res.status(400).json(error)
            } else {
                res.status(200).json(results.rows)
            }
        })
    }

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