const express = require('express');
const router = express.Router();

const { Product, mapCategories, compareCategories } = require('../models/product');
const { Category } = require('../models/category');
const { sendResponse } = require('../utils/response');
const BadRequestError = require('../errors/badRequestError');
const validateProductMiddleware = require('../utils/validators/validateProduct');
const validateID = require('../utils/validateID');
const NotFoundError = require('../errors/notFoundError');

router.get('/', async (req, res, next) => {
    try {
        const products = await Product
            .find()
            .populate('categories', '-createdAt')
            .sort('-createdAt')
            .select('title price categories')
            .limit(10);

        sendResponse(res, { message: products.length > 0 ? 'Data found' : 'Empty list', data: products });
    } catch (error) {
        next(error);
    }
});

router.get('/:id', validateID, async (req, res, next) => {
    try {
        const { id } = req['params'];

        const product = await Product.findById(id).populate('categories', '-createdAt');

        if (!product) {
            throw new NotFoundError('Data not found.');
        }

        sendResponse(res, { message: 'Data found.', data: product });
    } catch (error) {
        next(error);
    }
});

router.post('/', validateProductMiddleware, async (req, res, next) => {
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

router.put('/:id', validateID, validateProductMiddleware, async (req, res, next) => {
    try {
        const { id } = req['params'];
        const { title, price, imageUrl, categories: categoryIds } = req.body;

        const mappedCategories = mapCategories(categoryIds);

        const product = await Product.findByIdAndUpdate(id,
            {
                $set: {
                    title,
                    price,
                    imageUrl,
                    categories: [...mappedCategories],
                }
            },
            { new: true });

        if (!product) {
            throw new NotFoundError('The product with the given ID was not found.');
        }

        sendResponse(res, { message: 'Data updated', data: product });
    } catch (error) {
        next(error);
    }
});

router.delete('/', async (req, res, next) => {
    try {
        const product = await Product.deleteMany();

        sendResponse(res, { message: 'Successfully deleted ' + product.deletedCount + ' data(s).' });
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', validateID, async (req, res, next) => {
    try {
        const { id } = req.params;

        const product = await Product.findByIdAndRemove(id);

        if (!product) {
            throw new NotFoundError('The product with the given ID was not found.');
        }

        sendResponse(res, { message: 'The product with the given ID has been deleted successfully.', data: product });
    } catch (error) {
        next(error);
    }
});

module.exports = router;