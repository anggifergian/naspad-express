const express = require('express');
const router = express.Router();

const { validateCategory } = require('../models/category');

const categories = [
    { id: 1, name: 'Category 1' },
    { id: 2, name: 'Category 2' },
    { id: 3, name: 'Category 3' },
    { id: 4, name: 'Category 4' },
    { id: 5, name: 'Category 5' },
];

router.get('/', (req, res) => {
    res.send({
        success: true,
        message: 'Data found',
        data: categories
    });
})

router.get('/:id', (req, res) => {
    const { id } = req.params;
    const data = categories.find(item => item.id === parseInt(id));

    if (!data) {
        return res.status(404).send({ message: 'Data not found' });
    }

    res.send({
        success: true,
        message: 'Data found',
        data,
    });
})

router.post('/', (req, res) => {
    const { error } = validateCategory(req.body);
    if (error) {
        return res.status(400).send({ message: error.details[0].message  });
    }

    const { name } = req.body;
    categories.push({ id: categories.length + 1, name });

    res.send({
        success: true,
        message: 'Data created',
    });
})

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const data = categories.find(item => item.id === parseInt(id));
    if (!data) {
        return res.status(404).send({ message: 'The category with the given ID was not found.' });
    }

    const { error } = validateCategory(req.body);
    if (error) {
        return res.status(400).send({ message: error.details[0].message });
    }

    data.name = req.body.name;

    res.send({
        success: true,
        message: 'Data updated',
        data,
    });
})

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const data = categories.find(item => item.id === parseInt(id));
    if (!data) {
        return res.status(404).send({ message: 'The category with the given ID was not found.' });
    }

    const index = categories.indexOf(data);
    categories.splice(index);

    res.send({
        success: true,
        message: 'The category with the given ID has been deleted successfully.',
        data,
    });
})

module.exports = router;