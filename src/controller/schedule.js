const express = require('express')
const router = express.Router()

const Schedule = require('../model/schedule')

// Adds a new schedule
router.post('/schedule', Schedule.create.bind(Schedule))

module.exports = router