const db = require('../database/db');


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
    getSchedule(req, res, data) {
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
                    if(error) {
                        res.status(400).json(error);
                    } else if (!results.rowCount) {
                        res.status(204).json(`The person with cpf as ${id} has no pet`);
                    } else {
                        // Finally, search for schedule
                        if (data == 'today') {
                            const sql = `SELECT * FROM Schedule WHERE id_person = '${id}' AND date_service > (SELECT NOW())`
                        }
                        else if (data == 'history') {
                            const sql = `SELECT * FROM Schedule WHERE id_person = '${id}'`
                        }
                        else {
                            res.status(400).json("Invalid data");
                        }
                        db.query(sql, (error, results) => {
                            if(error) {
                                res.status(400).json(error);
                            } else if (!results.rowCount) {
                                res.status(204).json(`The person with cpf as ${id} has no schedule`);
                            } else {
                                res.status(200).json(results.rows);
                            }
                        })                                
                    }
                })
            }
        })
    }    
}

module.exports = new Person