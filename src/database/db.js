const { Pool } = require("pg");

require('dotenv').config({ path: '/usr/src/app/.env' });

const db = new Pool({
    user: process.env.DB_USER,
    host: 'postgres',
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: 5432,
    schema: 'public'
})


module.exports = db
