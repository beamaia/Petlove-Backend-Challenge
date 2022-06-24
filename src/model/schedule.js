const db = require('../database/db')

class Schedule {
    /**
     * Creates a new schedule
     * @param {*} req request containing schedule's data
     * @param {*} res
    **/ 
    create(req, res) {
        let data = req.body

        let fields_atr = []
        let fields_val = []
        for (let key in data) {
            fields_atr.push(key)

            // Checks if the field is empty
            if (data[key]) {
                fields_val.push(`'${data[key]}'`)
            } else {
                return res.status(400).json(`${key} cannot be empty`)
            }
        }

        const sql = `SELECT column_name FROM information_schema.columns WHERE table_name = 'schedule';`

        // First checks if the table has all the fields being inserted (if not, they  would be null)
        db.query(sql, (error, results) => {
            if(error) {
                res.status(400).json(error)
            } else {
                let atributes = results.rows.map(function (obj) {
                                return obj.column_name
                            }).filter(function (elem, index, self) {
                                return elem != 'id_schedule'
                            })

                const multipleExist = atributes.every(value => {
                    return fields_atr.includes(value);
                });
                
                if (!multipleExist) {
                    return res.status(400).json('Fields cannot be empty, please insert all following attributes: ' + atributes.join(', '))
                }

                const sql = `SELECT * FROM Animal WHERE id_person='${data.id_person}' AND id_animal='${data.id_animal}'`
        
                // Then checks if the pet is registered in the database to the person
                db.query(sql, (error, results) => {
                    if(error) {
                        res.status(400).json(error)
                    } else if (!results.rowCount) {
                        return res.status(400).json('Pet or person does not exist, or doesnt match')
                    } else {
                        const sql = `INSERT INTO Schedule (${fields_atr.join(',')}) VALUES (${fields_val.join(', ')}) RETURNING *`
                        
                        // And finally insert schedule
                        db.query(sql, (error, results) => {
                            if(error) {
                                res.status(400).json(error)
                            } else {
                                res.status(200).json(results.rows)
                            }
                        })
                    }
                })
            }
        })

    }

    /**
     * Returns the schedule based on the date
     * @param {*} req 
     * @param {*} res 
     * @param {*} date can be 'history' or 'today' 
     */
     get(req, res, date) {
        // Find period of schedule
        let sql;

        if (date == 'today') {
            sql = `SELECT * FROM Schedule WHERE date_service >= (SELECT NOW())`
        }
        else if (date == 'history') {
            sql = `SELECT * FROM Schedule`
        }
        else {
            res.status(400).json("Invalid date");
        }
        
        db.query(sql, (error, results) => {
            if(error) {
                res.status(400).json(error);
            } else if (!results.rowCount) {
                res.status(204).json(`There is no schedule :(`);
            } else {
                res.status(200).json(results.rows);
            }
        })                                
    }    

    /**
     * Updates a schedule
     * @param {*} req request containing schedule's id
     * @param {*} res
     **/
    update(req, res) {
        let data = req.body
        let id = req.params.id

        if (isNaN(id)) {
            return res.status(400).json("Invalid Id");
        }

        // Creates auxiliary list of fields to be updated
        let fields = []
        for (let key in data) {
            if (key == 'id_schedule') {
                return res.status(400).json('Id cannot be changed')
            } else if (key == 'id_animal') {
                return res.status(400).json('Pet cannot be changed, create a new schedule!')
            } else if (key == 'id_service') {
                return res.status(400).json('Service cannot be changed, create a new schedule!')
            } else if (key == 'id_person') {
                return res.status(400).json('Person cannot be changed, create a new schedule!')
            }
            
            if (data[key]) {
                fields.push(`${key}='${data[key]}'`)
            } else {
                return res.status(400).json(`${key} cannot be empty`)
            }
        }

        const sql = `UPDATE Schedule SET ${fields.join(', ')} WHERE id_schedule='${id}' RETURNING *`

        db.query(sql, (error, results) => {
            if(error) {
                res.status(400).json(error)
            } else if (!results.rowCount) {
                res.status(204).json(`There is no schedule with id as ${id}`)
            } else {
                res.status(200).json(results.rows)
            }
        })
    }

    /**
     * Deletes a schedule from database
     * @param {*} req request containing schedule's id
     * @param {*} res
    **/ 
    delete(req, res) {
        let id = req.params.id

        if (isNaN(id)) {
            return res.status(400).json("Invalid Id");
        }

        const sql = `DELETE FROM Schedule WHERE id_schedule='${id}' RETURNING *`

        db.query(sql, (error, results) => {
            if(error) {
                res.status(400).json(error)
            } else if (!results.rowCount) {
                res.status(204).json(`There is no schedule with id as ${id}`)
            }
            else {
                res.status(200).json(results.rows)
            }
        })
    }
}

module.exports = new Schedule