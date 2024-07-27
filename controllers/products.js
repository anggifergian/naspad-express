const express = require('express');
const router = express.Router();

const { Product, validateProduct, mapCategories, compareCategories } = require('../models/product');
const { Category } = require('../models/category');
const { isValidID } = require('../utils/mongoose');
const { sendResponse, modify } = require('../utils/response');
const BadRequestError = require('../errors/badRequestError');

router.get('/', async (req, res) => {
    try {
        const products = await Product
            .find()
            .populate('categories', '-createdAt')
            .sort('-createdAt')
            .select('title price categories')
            .limit(10);

        sendResponse(res, { message: products.length > 0 ? 'Data found' : 'Empty list', data: products });
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

        const product = await Product.findById(id).populate('categories', '-createdAt');

        if (!product) {
            return sendResponse(res, { statusCode: 404, message: 'Data not found.' });
        }

        sendResponse(res, { message: 'Data found.', data: product });
    } catch (error) {
        sendResponse(res, { statusCode: 500, message: error['message'] });
    }
});

const validateProductMiddleware = (req, res, next) => {
    const { error } = validateProduct(req['body']);
    if (error) {
        const errMessage = modify(error['details'][0]['message']);
        return next(new BadRequestError(errMessage));
    }

    next();
}

router.post('/', validateProductMiddleware, async (req, res) => {
    try {
        const { title, price, imageUrl, categories: categoryIds } = req.body;

        const mappedCategories = mapCategories(categoryIds);
        const categories = await Category.find({ _id: { $in: mappedCategories } });

        if (!categories.length) {
            throw new BadRequestError('Invalid categories.');
        }

        if (categories.length !== mappedCategories.length) {
            const invalidIDs = compareCategories(mappedCategories, categories);
            throw new BadRequestError('Invalid categories.', invalidIDs);
        }

        let product = new Product({
            title,
            price,
            imageUrl,
            categories: [...mappedCategories],
        });

        const savedProduct = await product.save();

        sendResponse(res, { message: 'Data created', data: savedProduct });
    } catch (error) {
        next(error);
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

        const mappedCategories = mapCategories(req['body']['categories']);

        const product = await Product.findByIdAndUpdate(id,
            {
                $set: {
                    title: req['body']['title'],
                    price: req['body']['price'],
                    imageUrl: req['body']['imageUrl'],
                    categories: [...mappedCategories],
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

router.delete('/', async (req, res) => {
    try {
        const product = await Product.deleteMany();

        sendResponse(res, { message: 'Successfully deleted ' + product.deletedCount + ' data(s).' });
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