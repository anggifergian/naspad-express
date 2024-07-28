const express = require('express');
const router = express.Router();

router.use('/categories', require('../controllers/categories'));
router.use('/products', require('../controllers/products'));
router.use('/courses', require('../controllers/courses'));
router.use('/genres', require('../controllers/genres'));
router.use('/customers', require('../controllers/customers'));
router.use('/movies', require('../controllers/movies'));
router.use('/rentals', require('../controllers/rentals'));
router.use('/users', require('../controllers/users'));
router.use('/auth', require('../controllers/auth'));
router.use('/authors', require('../controllers/authors'));

module.exports = router;