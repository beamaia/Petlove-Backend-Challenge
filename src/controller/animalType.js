const express = require('express')
const router = express.Router()

const AnimalType = require('../model/animalType')

// Adds a new animalType
router.post('/animalType', AnimalType.create)

// Returns a specific animalType from database
router.get('/animalType/:id', AnimalType.get)

// Updates a animalType by id
router.patch('/animalType/:id', AnimalType.update)

// Deletes a animalType
router.delete('/animalType/:id', AnimalType.delete)

// Returns all animalTypes from database
router.get('/animalType', AnimalType.getAll)

module.exports = router
