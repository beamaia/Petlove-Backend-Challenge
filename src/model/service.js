const db = require('../database/db');

    /**
     * Returns a specific service from database
     * @param {*} req request containing service's id
     * @param {*} res 
     */
    get(req, res) {
        let id = req.params.id

        if (isNaN(id)) {
            return res.status(400).json("Invalid Id");
        }

        const sql = `SELECT * FROM Service WHERE id_service ='${id}'`

        db.query(sql, (error, results) => {
            if(error) {
                res.status(400).json(error);
            } else if (!results.rowCount) {
                res.status(204).json(`There is no service with id as ${id}`);
            } else {
                res.status(200).json(results.rows);
            }
        })
    }