const express = require('express');
const router = express.Router();

const { validateCategory, Category } = require('../models/category');
const { sendResponse } = require('../utils/response');
const { checkValidUUID } = require('../utils/mongoose');

router.get('/', async (req, res) => {
    try {
        const categories = await Category.find().sort('-createdAt').limit(10).select('name');

        sendResponse(res, { message: categories.length > 0 ? 'Data found' : 'Empty list', data: categories });
    } catch (error) {
        sendResponse(res, { statusCode: 500, message: error['message'] });
    }
})

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!checkValidUUID(id)) {
            const errMessage = 'Please input valid ID.';
            return sendResponse(res, { statusCode: 400, message: errMessage });
        }

        const category = await Category.findById(id);

        if (!category) {
            return sendResponse(res, { statusCode: 404, message: 'Data not found' });
        }

        sendResponse(res, { message: 'Data found', data: category });
    } catch (error) {
        sendResponse(res, { statusCode: 500, message: error['message'] });
    }
})

router.post('/', async (req, res) => {
    try {
        const { error } = validateCategory(req.body);
        if (error) {
            const errMessage = error.details[0].message.replace(/\"/g, '');
            return sendResponse(res, { statusCode: 400, message: errMessage });
        }

        let category = new Category({ name: req['body']['name'] });
        category = await category.save();

        sendResponse(res, { message: 'Data created', data: category });
    } catch (error) {
        sendResponse(res, { statusCode: 500, message: error['message'] });
    }
})

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!checkValidUUID(id)) {
            const errMessage = 'Please input valid ID.';
            return sendResponse(res, { statusCode: 400, message: errMessage });
        }

        const { error } = validateCategory(req.body);
        if (error) {
            const errMessage = error.details[0].message.replace(/\"/g, '');
            return sendResponse(res, { statusCode: 400, message: errMessage });
        }

        const category = await Category.findByIdAndUpdate(id,
            { $set: { name: req['body']['name'] } },
            { new: true });

        if (!category) {
            const errMessage = 'The category with the given ID was not found.';
            return sendResponse(res, { statusCode: 404, message: errMessage });
        }

        sendResponse(res, { message: 'Data updated', data: category, });
    } catch (error) {
        sendResponse(res, { statusCode: 500, message: error['message'] });
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // NOTE
        // Need to check first about related Product that have selected category

        if (!checkValidUUID(id)) {
            const errMessage = 'Please input valid ID.';
            return sendResponse(res, { statusCode: 400, message: errMessage });
        }

        const category = await Category.findByIdAndRemove(id);

        if (!category) {
            const errMessage = 'The category with the given ID was not found.';
            return sendResponse(res, { statusCode: 404, message: errMessage });
        }

        const successMessage = 'The category with the given ID has been deleted successfully.';
        sendResponse(res, { message: successMessage, data: category });
    } catch (error) {
        sendResponse(res, { statusCode: 500, message: error['message'] });
    }
})

module.exports = router;