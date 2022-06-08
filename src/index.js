const db = require('./db');
const { query } = require('express');

console.log(db.query('SHOW DATABASE'))