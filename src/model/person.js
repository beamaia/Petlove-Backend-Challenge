const db = require('../database/db');
const aux = require('../utils/utils');

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
     * Returns a specific person's pets from database
     * @param {*} req request containing person's id
     * @param {*} res 
     */
    getSchedule(req, res, date) {
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
                // Then search for pets
                const sql = `SELECT * FROM Animal WHERE id_person = '${id}'`
                
                db.query(sql, (error, results) => {
                    let sql_s;
                    if(error) {
                        res.status(400).json(error);
                    } else if (!results.rowCount) {
                        res.status(204).json(`The person with cpf as ${id} has no pet`);
                    } else {
                        // Finally, search for schedule
                        if (date == 'future') {
                            sql_s = `SELECT * FROM Schedule WHERE id_person = '${id}' AND date_service >= (SELECT NOW())`
                        }
                        else if (date == 'history') {
                            sql_s = `SELECT * FROM Schedule WHERE id_person = '${id}' AND date_service < (SELECT NOW())`
                        } else {
                            res.status(400).json("Invalid date");
                        }
                        
                        db.query(sql_s, (error, results) => {
                            if(error) {
                                res.status(400).json(error);
                            } else if (!results.rowCount) {
                                res.status(204).json(`The person with cpf as ${id} has no ${date} schedule`);
                            } else {
                                res.status(200).json(results.rows);
                            }
                        })                                
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


        // Creates auxiliary list of fields to be updated
        // Checks constraints and if all fields are valid
        let fields_atr = []
        let fields_val = []
        for (let key in data) {
            if (key == 'cpf') {
                if (!data.cpf || aux.getCountOfDigits(data.cpf) != 11) {
                    return res.status(400).json("Invalid CPF")
                }
            } 
            if (key == 'postal_code') {
                if (data.postal_code && aux.getCountOfDigits(data.postal_code) != 8) {
                    return res.status(400).json("Invalid postal code")
                }
            } 
            if (key == 'date_birth') {
                if (data.date_birth && (aux.getAge(data.date_birth) < 18 || aux.getAge(data.date_birth) > 140)) {
                    return res.status(400).json("Invalid birth date")
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

        const sql = `INSERT INTO Person (${fields_atr.join(', ')}) VALUES (${fields_val.join(', ')})`
        

        db.query(sql, (error, results) => {
            if(error) {
                res.status(400).json(error)
            } else {
                res.status(201).json(results)
            }
        })          
    }    

    /**
     * Updates a person's data
     * @param {*} req request containing person's data
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
            if (key == 'cpf') {
                return res.status(400).json('CPF cannot be changed')
            } else {
                if (data[key]) {
                    fields.push(`${key}='${data[key]}'`)
                } else {
                    fields.push(`${key}=${data[key]}`)
                }
            }
        }

        const sql = `UPDATE Person SET ${fields.join(', ')} WHERE cpf='${id}' RETURNING *`

        db.query(sql, (error, results) => {
            if(error) {
                res.status(400).json(error)
            } else if (!results.rowCount) {
                res.status(204).json(`There is no person with cpf as ${id}`)
            } else {
                res.status(200).json(results.rows)
            }
        })
    }

    /**
     * Deletes a person from database
     * @param {*} req request containing person's id
     * @param {*} res
     **/ 
    delete(req, res) {
        let id = req.params.id

        if (isNaN(id)) {
            return res.status(400).json("Invalid Id");
        }

        const sql = `DELETE FROM Person WHERE cpf='${id}'`

        db.query(sql, (error, results) => {
            if(error) {
                res.status(400).json(error)
            } else if (!results.rowCount) {
                res.status(204).json(`There is no person with cpf as ${id}`)
            } else {
                res.status(200).json(results)
            }
        })
    }
}

module.exports = new Person