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
router.post('/products', product.create)
router.put('/products/:id', product.update)
router.delete('/products/:id', product.delete)

/**
 * Category routes
 */
 router.get('/categories', category.getAll)
 router.get('/categories/:id', category.getById)
 router.post('/categories', category.create)
 router.put('/categories/:id', category.update)
 router.delete('/categories/:id', category.delete)

module.exports = router