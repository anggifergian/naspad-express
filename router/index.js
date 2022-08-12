"use strict"

/**
 * Module dependencies.
 */
const express = require('express')
const router = express.Router()

const product = require('../controllers/products')
const category = require('../controllers/categories')

/**
 * Product routes.
 */
router.get('/products', product.getAll)
router.get('/products/:id', product.getById)
router.put('/products/:id', product.update)
router.post('/products/:id', product.create)
router.delete('/products/:id', product.delete)

/**
 * Category routes
 */
 router.get('/categories', category.getAll)
 router.get('/categories/:id', category.getById)
 router.put('/categories/:id', category.update)
 router.post('/categories/:id', category.create)
 router.delete('/categories/:id', category.delete)

module.exports = router