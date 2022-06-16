const express = require('express')
const router = express.Router()

const Animal = require('../model/animal')

// Adds a new animal
router.post('/animal', Animal.create)

// Returns all animals from database
router.get('/animal', Animal.getAll)

module.exports = router