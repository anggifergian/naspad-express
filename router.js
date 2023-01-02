const express = require('express');
const router = express.Router();

router.use('/categories', require('./controllers/categories'));
router.use('/products', require('./controllers/products'));

module.exports = router;