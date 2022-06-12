const express = require('express')
const router = express.Router()

const Schedule = require('../model/schedule')

// Adds a new schedule
router.post('/schedule', Schedule.create)

// Returns all schedules before today from database
router.get('/scheduleHistory', function (req, res) {
    Schedule.get(req, res, 'history')
})

// Returns all future schedules from database
router.get('/schedule', function (req, res) {
    Schedule.get(req, res, 'today')
})

module.exports = router