const express = require('express');
const router = express.Router();

router.use('/categories', require('./controllers/categories'));
router.use('/products', require('./controllers/products'));
router.use('/courses', require('./controllers/courses'));
router.use('/genres', require('./controllers/genres'));

module.exports = router;