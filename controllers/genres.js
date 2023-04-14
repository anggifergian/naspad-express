const express = require('express');
const router = express.Router();

const { Genre, validateGenre } = require('../models/genre');
const { sendResponse } = require('../utils/response');
const { isValidID } = require('../utils/mongoose');
const authMiddleware = require('../middleware/auth');

router.get('/', async (req, res) => {
    try {
        const genres = await Genre.find().select('name').limit(10).sort('createdAt');

        sendResponse(res, {
            message: genres.length > 0 ? 'Data found.' : 'Empty list.',
            data: genres,
        })
    } catch (error) {
        sendResponse(res, { statusCode: 500, message: error['message'] });
    }
})

router.post('/', authMiddleware, async (req, res) => {
    try {
        const { error } = validateGenre(req.body);
        if (error) {
            const errMessage = error.details[0].message.replace(/\"/g, '');
            return sendResponse(res, { statusCode: 400, message: errMessage });
        }

        const genre = new Genre({ name: req.body.name });
        await genre.save();

        sendResponse(res, { message: 'Data created', data: genre });
    } catch (error) {
        sendResponse(res, { statusCode: 500, message: error['message'] });
    }
})

router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidID(id)) {
            const errMessage = 'Please input valid ID.';
            return sendResponse(res, { statusCode: 400, message: errMessage });
        }

        const { error } = validateGenre(req.body);
        if (error) {
            const errMessage = error.details[0].message.replace(/\"/g, '');
            return sendResponse(res, { statusCode: 400, message: errMessage });
        }

        const genre = await Genre.findByIdAndUpdate(id, {
            name: req.body.name,
        }, { new: true })

        if (!genre) {
            const errMessage = 'The genre with the given ID was not found.';
            return sendResponse(res, { statusCode: 404, message: errMessage });
        }

        sendResponse(res, { message: 'Data updated', data: genre, });
    } catch (error) {
        sendResponse(res, { statusCode: 500, message: error['message'] });
    }
})

router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidID(id)) {
            const errMessage = 'Please input valid ID.';
            return sendResponse(res, { statusCode: 400, message: errMessage });
        }

        const genre = await Genre.findByIdAndRemove(id);

        if (!genre) {
            const errMessage = 'The genre with the given ID was not found.';
            return sendResponse(res, { statusCode: 404, message: errMessage });
        }

        const successMessage = 'The genre with the given ID has been deleted successfully.';
        sendResponse(res, { message: successMessage, data: genre });
    } catch (error) {
        sendResponse(res, { statusCode: 500, message: error['message'] });
    }
})

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidID(id)) {
            const errMessage = 'Please input valid ID.';
            return sendResponse(res, { statusCode: 400, message: errMessage });
        }

        const genre = await Genre.findById(id);

        if (!genre) {
            const errMessage = 'The genre with the given ID was not found.';
            return sendResponse(res, { statusCode: 404, message: errMessage });
        }

        sendResponse(res, { message: 'Data found', data: genre })
    } catch (error) {
        sendResponse(res, { statusCode: 500, message: error['message'] });
    }
})

module.exports = router;