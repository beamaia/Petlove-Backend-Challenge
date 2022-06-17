const db = require('../database/db');

class Service {
    /**
     * Adds a new animal to database.
     * Animal must have the following attributes:
     * - Service type (service_type)
     * - Price (price)
     * @param {*} req 
     * @param {*} res 
     */
    create(req, res) {
        let data = req.body

        // Creates auxiliary list of fields to be updated
        // Checks constraints and if all fields are valid
        let fields_atr = []
        let fields_val = []        

        for (let key in data) {
            fields_atr.push(key)

            // Checks if the field is empty
            if (data[key]) {
                fields_val.push(`'${data[key]}'`)
            } else {
                fields_val.push(`${data[key]}`)
            }
        }

        const sql_insert = `INSERT INTO Service (${fields_atr.join(', ')}) VALUES (${fields_val.join(', ')})`
        db.query(sql_insert, (error, results) => {
            if(error) {
                res.status(400).json(error)
            } else {
                res.status(201).json(results)
            }
        })
    }

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