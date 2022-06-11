const express = require('express')
const router = express.Router()

const Person = require('../model/Person')

// Returns all persons from database
router.get('/person', Person.getAll)

// Returns a specific person from database
router.get('/person/:id', Person.get)

module.exports = router