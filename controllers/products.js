const express = require('express');
const router = express.Router();

const products = [
    { id: 1, name: 'Iphone 14' },
    { id: 2, name: 'Iphone 14 Pro' },
    { id: 3, name: 'Iphone 14 Pro Max' },
    { id: 4, name: 'Iphone 13' },
    { id: 5, name: 'Iphone 13 Mini' },
    { id: 6, name: 'Iphone 13 Pro' },
];

router.get('/', (req, res) => {
    res.send({
        success: true,
        message: 'Data found',
        data: products
    })
})

module.exports = router;