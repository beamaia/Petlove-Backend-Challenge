const { Pool } = require("pg");

const env = process.env.NODE_ENV === 'test' ? '../.env.test' : '../.env';

require('dotenv').config({ path: __dirname + env });

const pool = new Pool({
    user: process.env.DB_USER,
    host: 't1-beatriz-sophie-postgres-1',
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: 5432
})

module.exports = {
    query: (text, params) => pool.query(text, params)
}