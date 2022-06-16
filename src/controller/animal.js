const express = require('express')
const router = express.Router()

const Animal = require('../model/animal')

// Adds a new animal
router.post('/animal', Animal.create)

// Returns a specific animal from database
router.get('/animal/:id', Animal.get)

// Updates an animal by id
router.patch('/animal/:id', Animal.update)

// Returns all animals from database
router.get('/animal', Animal.getAll)

module.exports = router