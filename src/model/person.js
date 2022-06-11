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
}

module.exports = new Person