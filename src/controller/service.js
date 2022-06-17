const express = require('express')
const router = express.Router()

const Service = require('../model/service')

// Returns all services from database
router.get('/service', Service.getAll)

module.exports = router
