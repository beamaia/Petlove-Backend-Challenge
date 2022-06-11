const db = require('../database/db');
const aux = require('../aux/aux');

class Person {
    /**
     * Returns all persons from database
     * @param {*} req
     * @param {*} res
     */
    getAll(req, res) {
        const sql = `SELECT * FROM Person;`;

        db.query(sql, (error, results) => {
            if(error) {
                res.status(400).json(error)
            } else {
                res.status(200).json(results.rows)
            }
        })
    }

    /**
     * Returns a specific person from database
     * @param {*} req request containing person's id
     * @param {*} res 
     */
    get(req, res) {
        let id = req.params.id

        if (isNaN(id)) {
            return res.status(400).json("Invalid Id");
        }

        const sql = `SELECT * FROM Person WHERE cpf='${id}'`

        db.query(sql, (error, results) => {
            if(error) {
                res.status(400).json(error);
            } else if (!results.rowCount) {
                res.status(204).json(`There is no person with cpf as ${id}`);
            } else {
                res.status(200).json(results.rows);
            }
        })
    }
    
    
    /**
     * Returns a specific person's pets from database
     * @param {*} req request containing person's id
     * @param {*} res 
     */
    getPets(req, res) {
            let id = req.params.id
            if (isNaN(id)) {
                res.status(400).json("Invalid Id");
            }

            // First see if person exists
            const sql = `SELECT * FROM Person WHERE cpf='${id}'`

            db.query(sql, (error, results) => {
                if(error) {
                    res.status(400).json(error);
                } else if (!results.rowCount) {
                    res.status(204).json(`There is no person with cpf as ${id}`);
                } else {
                    // If it does, the search for pets
                    const sql = `SELECT * FROM Animal WHERE id_person = '${id}'`
                    
                    db.query(sql, (error, results) => {
                        if(error) {
                            res.status(400).json(error);
                        } else if (!results.rowCount) {
                            res.status(204).json(`The person with cpf as ${id} has no pet`);
                        } else {
                            res.status(200).json(results.rows);
                        }
                    })
                }
            })
        }

    /**
     * Adds a new person to database
     * @param {*} req request containing person's data
     * @param {*} res 
     */
    create(req, res) {
        let data = req.body

        console.log(data)

        // Checking constraints
        if (aux.getCountOfDigits(data.cpf) != 11) {
            return res.status(400).json("Invalid CPF")
        } else if (data.postal_code && aux.getCountOfDigits(data.postal_code) != 8) {
            return res.status(400).json("Invalid postal code")
        } else if (data.data_birth && (aux.getAge(data.data_birth) < 18 || aux.getAge(data.data_birth) > 140)) {
            return res.status(400).json("Invalid birth date")
        }

        const sql = `INSERT INTO Person VALUES ('${data.cpf}', '${data.full_name}', '${data.data_birth}', '${data.number}', '${data.road}', '${data.city}', '${data.postal_code}', '${data.phone}')`

        db.query(sql, (error, results) => {
            if(error) {
                res.status(400).json(error)
            } else {
                res.status(201).json(data)
            }
        })          
    }    
}

module.exports = new Person