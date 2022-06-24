const express = require('express')
const router = express.Router()

const Animal = require('../model/animal')

// Adds a new animal
router.post('/animal', Animal.create)

// Updates an animal by id
router.patch('/animal/:id', Animal.update)

// Deletes an animal
router.delete('/animal/:id', Animal.delete)

// Returns all animals from database
router.get('/animal', Animal.getAll)

// Returns a specific animal from database
router.get('/animal/:id', Animal.get)

// Returns a specific animals' schedule from database
router.get('/animal/:id/schedule', function (req, res) {
    Animal.getSchedule(req, res, 'future')
})

// Returns a specific animal's schedule history from database
router.get('/animal/:id/scheduleHistory', function (req, res) {
    Animal.getSchedule(req, res, 'history')
})

module.exports = router