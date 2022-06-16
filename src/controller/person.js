const express = require('express')
const router = express.Router()

const Person = require('../model/Person')

// Adds a new person
router.post('/person', Person.create)

// Updates a person
router.patch('/person/:id', Person.update)

// Returns all persons from database
router.get('/person', Person.getAll)

// Returns a specific person from database
router.get('/person/:id', Person.get)

// Returns a specific person's pets from database
router.get('/person/:id/animal', Person.getPets)


// Returns a specific person's pets schedule from database
router.get('/person/:id/schedule', function (req, res) {
    Person.getSchedule(req, res, 'future')
})

// Returns a specific person's pets schedule history from database
router.get('/person/:id/scheduleHistory', function (req, res) {
    Person.getSchedule(req, res, 'history')
})

// Deletes a person
router.delete('/person/:id', Person.delete)


module.exports = router