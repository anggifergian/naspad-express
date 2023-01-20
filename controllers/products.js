const express = require('express');
const router = express.Router();

const { Product, validateProduct } = require('../models/product');
const { isValidID } = require('../utils/mongoose');
const { sendResponse, modify } = require('../utils/response');

router.get('/', async (req, res) => {
    try {
        const products = await Product.find().sort('-createdAt').limit(10).select('title price');

        sendResponse(res, { message: 'Data found', data: products });
    } catch (error) {
        sendResponse(res, { statusCode: 500, message: error['message'] });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req['params'];

        if (!isValidID(id)) {
            const errMessage = 'Please input valid ID.';
            return sendResponse(res, { statusCode: 400, message: errMessage });
        }

        const product = await Product.findById(id);

        if (!product) {
            return sendResponse(res, { statusCode: 404, message: 'Data not found.' });
        }

        sendResponse(res, { message: 'Data found.', data: product });
    } catch (error) {
        sendResponse(res, { statusCode: 500, message: error['message'] });
    }
});

router.post('/', async (req, res) => {
    try {
        const { error } = validateProduct(req['body']);
        if (error) {
            const errMessage = modify(error['details'][0]['message']);
            return sendResponse(res, { statusCode: 400, message: errMessage });
        }

        let product = new Product({
            title: req['body']['title'],
            price: req['body']['price'],
            imageUrl: req['body']['imageUrl'],
        });
        product = await product.save();

        sendResponse(res, { message: 'Data created', data: product });
    } catch (error) {
        sendResponse(res, { statusCode: 500, message: error['message'] });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req['params'];

        if (!isValidID(id)) {
            const errMessage = 'Please input valid ID.';
            return sendResponse(res, { statusCode: 400, message: errMessage });
        }

        const { error } = validateProduct(req['body']);
        if (error) {
            const errMessage = modify(error['details'][0]['message']);
            return sendResponse(res, { statusCode: 400, message: errMessage });
        }

        const product = await Product.findByIdAndUpdate(id,
            {
                $set: {
                    title: req['body']['title'],
                    price: req['body']['price'],
                    imageUrl: req['body']['imageUrl']
                }
            },
            { new: true });

        if (!product) {
            const errMessage = 'The product with the given ID was not found.';
            return sendResponse(res, { statusCode: 404, message: errMessage });
        }

        sendResponse(res, { message: 'Data updated', data: product, });
    } catch (error) {
        sendResponse(res, { statusCode: 500, message: error['message'] });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidID(id)) {
            const errMessage = 'Please input valid ID.';
            return sendResponse(res, { statusCode: 400, message: errMessage });
        }

        const product = await Product.findByIdAndRemove(id);

        if (!product) {
            const errMessage = 'The product with the given ID was not found.';
            return sendResponse(res, { statusCode: 404, message: errMessage });
        }

        const successMessage = 'The product with the given ID has been deleted successfully.';
        sendResponse(res, { message: successMessage, data: product });
    } catch (error) {
        sendResponse(res, { statusCode: 500, message: error['message'] });
    }
});

module.exports = router;