"use strict"

/**
 * Module dependencies.
 */
const express = require('express')
const router = express.Router()

const product = require('../app/controllers/products')

/**
 * Product routes.
 */
router.get('/products', product.getAll)
router.get('/products/:id', product.getById)
router.put('/products/:id', product.update)
router.post('/products/:id', product.create)
router.delete('/products/:id', product.delete)

module.exports = router