const db = require('../database/db');

class Service {
    /**
     * Adds a new service to database.
     * Service must have the following attributes:
     * - Service type (service_type)
     * - Price (price)
     * @param {*} req 
     * @param {*} res 
     */
    create(req, res) {
        let data = req.body

        // Creates auxiliary list of fields to be updated
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

        const sql_insert = `INSERT INTO Service (${fields_atr.join(', ')}) VALUES (${fields_val.join(', ')}) RETURNING *`
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
     * Updates a service's data
     * Could alter the following attributes:
     * - Service type (service_type)
     * - Price (price)
     * Cannot alter id
     * @param {*} req request containing service's id
     * @param {*} res 
     */
    update(req, res) {  
        let data = req.body
        let id = req.params.id

        if (isNaN(id)) {
            return res.status(400).json("Invalid Id");
        }
        
        // Creates auxiliary list of fields to be updated
        let fields = []
        for (let key in data) {
            if (key == 'id_service') {
                return res.status(400).json("Cannot alter id")
            }            
            if (data[key]) {
                fields.push(`${key}='${data[key]}'`)
            } else {
                fields.push(`${key}=${data[key]}`)
            }
            
        }

        const sql = `UPDATE Service SET ${fields.join(', ')} WHERE id_service='${id}' RETURNING *`

        db.query(sql, (error, results) => {
            if(error) {
                res.status(400).json(error)
            } else if (!results.rowCount) {
                res.status(204).json(`There is no service with id as ${id}`)
            } else {
                res.status(200).json(results.rows)
            }
        })
    }
    
    /**
         * Deletes a service from database
         * @param {*} req request containing service's id
         * @param {*} res
         **/ 
    delete(req, res) {
        let id = req.params.id

        if (isNaN(id)) {
            return res.status(400).json("Invalid Id");
        }

        const sql = `DELETE FROM Service WHERE id_service='${id}' RETURNING *`

        db.query(sql, (error, results) => {
            if(error) {
                res.status(400).json(error)
            } else if (!results.rowCount) {
                res.status(204).json(`There is no service with id_service as ${id}`)
            } else {
                res.status(200).json(results)
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