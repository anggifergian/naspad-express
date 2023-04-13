const express = require('express');
const router = express.Router();

const { sendResponse, modify } = require('../utils/response');
const { isValidID } = require('../utils/mongoose');
const { Movie, validateMovie } = require('../models/movie');
const { Genre } = require('../models/genre');

router.get('/', async (req, res) => {
    try {
        const movies = await Movie.find().sort('title').limit(10);

        sendResponse(res, { message: movies.length > 0 ? 'Data found' : 'Empty list', data: movies });
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

        const movie = await Movie.findById(id);
        if (!movie) {
            const errMessage = 'The movie with the given Id was not found.';
            return sendResponse(res, { statusCode: 404, message: errMessage });
        }

        sendResponse(res, { message: 'Data found', data: movie });
    } catch (error) {
        sendResponse(res, { statusCode: 500, message: error['message'] });
    }
})

router.post('/', async (req, res) => {
    try {
        const { error } = validateMovie(req.body);
        if (error) {
            const errMessage = modify(error['details'][0]['message']);
            return sendResponse(res, { statusCode: 400, message: errMessage });
        }

        const genre = await Genre.findById(req.body.genreId);
        if (!genre) {
            const errMessage = 'The genre with the given Id was not found.';
            return sendResponse(res, { statusCode: 404, message: errMessage });
        }

        let model = new Movie({
            title: req.body.title,
            genre: genre,
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate,
        });

        model = await model.save();

        sendResponse(res, { message: 'Data created', data: model });
    } catch (error) {
        sendResponse(res, { statusCode: 500, message: error['message'] });
    }
})

module.exports = router;