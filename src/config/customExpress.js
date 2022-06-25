const express = require('express')

const AnimalController = require('../controller/animal')
const AnimalTypeController = require('../controller/animalType')
const PersonController = require('../controller/person')
const ServiceController = require('../controller/service')
const ScheduleController = require('../controller/schedule')

const app = express()

// Middlewares
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Routes
app.use(AnimalController)
app.use(AnimalTypeController)
app.use(PersonController)
app.use(ServiceController)
app.use(ScheduleController)

module.exports = app