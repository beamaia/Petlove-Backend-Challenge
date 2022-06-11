const express = require('express')
const router = express.Router()

const Person = require('../model/Person')

// Returns all persons from database
router.get('/person', Person.getAll)

// Returns a specific person from database
router.get('/person/:id', Person.get)

// Returns a specific person's pets from database
router.get('/person/:id/animal', Person.getPets)

// Returns a specific person's pets schedule from database
router.get('/person/:id/schedule', function (req, res) {
    Person.getSchedule(req, res, 'today')
})

router.get('/person/:id/scheduleHistory', function (req, res) {
    Person.getSchedule(req, res, 'history')
})

module.exports = router