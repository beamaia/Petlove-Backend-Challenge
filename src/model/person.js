const db = require('../database/db');


class Person {
    /**
     * Returns all persons from database
     * @param {*} req
     * @param {*} res
     */
    getAll(req, res) {
        const sql = `SELECT * FROM Person;`;

        db.query(sql, (erro, resultados) => {
            if(erro) {
                res.status(400).json(erro)
            } else {
                res.status(200).json(resultados.rows)
            }
        })
    }
}

module.exports = new Person