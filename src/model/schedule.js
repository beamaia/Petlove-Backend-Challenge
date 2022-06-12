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
                fields_val.push(`${data[key]}`)
            }
        }

        let sql = `INSERT INTO Schedule (${fields_atr.join(',')}) VALUES (${fields_val.join(', ')}) RETURNING *`

        console.log(sql)
        db.query(sql, (error, results) => {
            if(error) {
                res.status(400).json(error)
            } else {
                res.status(200).json(results.rows)
            }
        })
    }
}

module.exports = new Schedule