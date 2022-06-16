const db = require('../database/db');
const aux = require('../utils/utils');

class Animal {

    /**
     * Adds a new animal to database.
     * Animal must have the following attributes:
     * - Name
     * - Owner ID
     * - Birthday
     * - Animal type
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
        console.log(sql_insert)
        db.query(sql_insert, (error, results) => {
            if(error) {
                res.status(400).json(error)
            } else {
                res.status(201).json(results)
            }
        })
    }

    /**
     * Returns all animals from database
     * @param {*} req
     * @param {*} res
     */
     getAll(req, res) {
        const sql = `SELECT * FROM Animal;`;

        db.query(sql, (error, results) => {
            if(error) {
                res.status(400).json(error)
            } else {
                res.status(200).json(results.rows)
            }
        })
    }
}

module.exports = new Animal