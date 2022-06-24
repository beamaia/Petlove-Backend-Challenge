const db = require('../database/db');
const aux = require('../utils/utils');

class Animal {

    /**
     * Adds a new animal to database.
     * Animal must have the following attributes:
     * - Name (Name)
     * - Owner ID (id_person)
     * - Birthday (date_birth)
     * - Animal type (id_type)
     * @param {*} req request containing animals's attributes
     * @param {*} res 
     */
    create(req, res) {
        let data = req.body

        // Creates auxiliary list of fields to be updated
        // Checks constraints and if all fields are valid
        let fields_atr = []
        let fields_val = []        

        for (let key in data) {
            if (key == 'id_person') {
                if (!data.id_person || aux.getCountOfDigits(data.id_person) != 11) {
                    return res.status(400).json("Invalid CPF")
                }
            } 

            fields_atr.push(key)

            // Checks if the field is empty
            if (data[key]) {
                fields_val.push(`'${data[key]}'`)
            } else {
                fields_val.push(`${data[key]}`)
            }
        }

        const sql_insert = `INSERT INTO Animal (${fields_atr.join(', ')}) VALUES (${fields_val.join(', ')})`
        db.query(sql_insert, (error, results) => {
            if(error) {
                res.status(400).json(error)
            } else {
                res.status(201).json(results)
            }
        })
    }

    /**
     * Returns a specific animal from database
     * @param {*} req request containing animal's id
     * @param {*} res 
     */
    get(req, res) {
        let id = req.params.id

        if (isNaN(id)) {
            return res.status(400).json("Invalid Id");
        }

        const sql = `SELECT * FROM Animal WHERE id_animal='${id}'`

        db.query(sql, (error, results) => {
            if(error) {
                res.status(400).json(error);
            } else {
                res.status(200).json(results.rows)
            }
        })
    }

    /**
     * Updates an animal's data
     * Could alter the following attributes:
     * - Name (Name)
     * - Type (id_type)
     * - Birthday (date_birth)
     * Cannot alter owner
     * @param {*} req request containing animal's data
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
            if (key == 'id_person') {
                return res.status(400).json('Owner cannot be changed')
            } else {
                if (data[key]) {
                    fields.push(`${key}='${data[key]}'`)
                } else {
                    fields.push(`${key}=${data[key]}`)
                }
            }
        }

        const sql = `UPDATE Animal SET ${fields.join(', ')} WHERE id_animal='${id}' RETURNING *`

        db.query(sql, (error, results) => {
            if(error) {
                res.status(400).json(error)
            } else if (!results.rowCount) {
                res.status(204).json(`There are no animal with id as ${id}`)
            } else {
                res.status(200).json(results.rows)
            }
        })
    }

    /**
     * Deletes an animal from database
     * @param {*} req request containing animal's id
     * @param {*} res
     **/ 
     delete(req, res) {
        let id = req.params.id

        if (isNaN(id)) {
            return res.status(400).json("Invalid Id");
        }

        const sql = `DELETE FROM Animal WHERE id_animal='${id}'`

        db.query(sql, (error, results) => {
            if(error) {
                res.status(400).json(error)
            } else if (!results.rowCount) {
                res.status(204).json(`There is no animal with id as ${id}`)
            } else {
                res.status(200).json(results)
            }
        })
    }

    /**
     * Returns all animals from database
     * @param {*} req
     * @param {*} res
     */
    getAll(req, res) {
        const sql = `SELECT * FROM Animal;`

        db.query(sql, (error, results) => {
            if(error) {
                res.status(400).json(error)
            } else {
                res.status(200).json(results.rows)
            }
        })
    }

    /**
     * Returns a specific animals's pets from database
     * @param {*} req request containing animals's id
     * @param {*} res 
     */
    getSchedule(req, res, date) {
        let id = req.params.id
            
        if (isNaN(id)) {
            return res.status(400).json("Invalid Id");
        }

        let sql = ""

        if (date === 'future') {
            sql = `SELECT * FROM Schedule WHERE id_animal = '${id}' AND date_service >= (SELECT NOW())`
        }
        else if (date === 'history') {
            sql = `SELECT * FROM Schedule WHERE id_animal = '${id}'`
        } else {
            return res.status(400).json("Invalid date");
        }
        
        db.query(sql, (error, results) => {
            if(error) {
                res.status(400).json(error);
            // } else if (!results.rowCount) {
            //     res.status(204).json(`The animal with id as ${id} has no ${date} schedule`);
            } else {
                res.status(200).json(results.rows);
            }
        })                                
    }       
    
}

module.exports = new Animal