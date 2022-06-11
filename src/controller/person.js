const express = require('express')
const router = express.Router()

const Person = require('../model/Person')

// Returns all persons from database
router.get('/person', Person.getAll)

module.exports = router