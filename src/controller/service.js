const express = require('express')
const router = express.Router()

const Service = require('../model/service')

// Adds a new service
router.post('/service', Service.create)

// Returns a specific service from database
router.get('/service/:id', Service.get)

// Updates a service by id
router.patch('/service/:id', Service.update)

// Returns all services from database
router.get('/service', Service.getAll)

module.exports = router
