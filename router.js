const express = require('express');
const router = express.Router();

router.use('/categories', require('./controllers/categories'));
router.use('/products', require('./controllers/products'));
router.use('/courses', require('./controllers/courses'));

module.exports = router;