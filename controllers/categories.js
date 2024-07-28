const express = require('express');
const router = express.Router();

const { Category } = require('../models/category');
const { sendResponse } = require('../utils/response');
const NotFoundError = require('../errors/notFoundError');

const { validateID } = require('../middleware/validators/validateIDMiddleware');
const { validateCategoryBody } = require('../middleware/validators/validateCategoryMiddleware');

router.get('/', async (req, res, next) => {
    try {
        const categories = await Category
            .find()
            .sort('-createdAt')
            .limit(10)
            .select('name');

        sendResponse(res, { message: categories.length > 0 ? 'Data found' : 'Empty list', data: categories });
    } catch (error) {
        next(error);
    }
})

router.get('/:id', validateID, async (req, res, next) => {
    try {
        const { id } = req.params;

        const category = await Category.findById(id);
        if (!category) throw new NotFoundError('Data not found');

        sendResponse(res, { message: 'Data found', data: category });
    } catch (error) {
        next(error);
    }
})

router.post('/', validateCategoryBody, async (req, res, next) => {
    try {
        const category = new Category({ name: req['body']['name'] });
        const savedCategory = await category.save();

        sendResponse(res, { message: 'Data created', data: savedCategory });
    } catch (error) {
        next(error);
    }
})

router.put('/:id', validateID, validateCategoryBody, async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const category = await Category.findByIdAndUpdate(id,
            {
                $set: { name }
            },
            { new: true });

        if (!category) throw new NotFoundError('The category with the given ID was not found.');

        sendResponse(res, { message: 'Data updated', data: category });
    } catch (error) {
        next(error);
    }
})

router.delete('/:id', validateID, async (req, res, next) => {
    try {
        const { id } = req.params;

        const category = await Category.findByIdAndRemove(id);
        if (!category) throw new NotFoundError('The category with the given ID was not found.');

        sendResponse(res, { message: 'The category with the given ID has been deleted successfully.', data: category });
    } catch (error) {
        next(error);
    }
})

module.exports = router;