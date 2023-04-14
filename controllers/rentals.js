const express = require('express');
const router = express.Router();

const { sendResponse, modify } = require('../utils/response');
const { isValidID } = require('../utils/mongoose');
const { Rental, validateRental } = require('../models/rental');
const { Customer } = require('../models/customer');
const { Movie } = require('../models/movie');
const authMiddleware = require('../middleware/auth');

router.get('/', async (req, res) => {
    try {
        const data = await Rental.find().sort('-dateOut').limit(10);
        
        sendResponse(res, { message: data.length > 0 ? 'Data found.' : 'Empty list.', data });
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

        const rental = await Rental.findById(id);
        if (!rental) {
            const errMessage = 'The rental with the given Id was not found.';
            return sendResponse(res, { statusCode: 404, message: errMessage });
        }

        sendResponse(res, { message: 'Data found', data: rental });
    } catch (error) {
        sendResponse(res, { statusCode: 500, message: error['message'] });
    }
})

router.post('/', authMiddleware, async (req, res) => {
    try {
        const { error } = validateRental(req.body);
        if (error) {
            const message = modify(error['details'][0]['message']);
            return sendResponse(res, { statusCode: 400, message });
        }

        if (!isValidID(req.body.customerId)) {
            const errMessage = 'Please input customer valid ID.';
            return sendResponse(res, { statusCode: 400, message: errMessage });
        }

        if (!isValidID(req.body.movieId)) {
            const errMessage = 'Please input movie valid ID.';
            return sendResponse(res, { statusCode: 400, message: errMessage });
        }

        const customer = await Customer.findById(req.body.customerId);
        if (!customer) {
            const message = 'The customer with the given Id was not found.';
            return sendResponse(res, { statusCode: 404, message });
        }

        const movie = await Movie.findById(req.body.movieId);
        if (!movie) {
            const message = 'The movie with the given Id was not found.';
            return sendResponse(res, { statusCode: 404, message });
        }

        if (movie.numberInStock === 0) {
            const message = 'Movie not in stock.';
            return sendResponse(res, { statusCode: 400, message });
        }

        let rental = new Rental({
            customer: {
                _id: customer._id,
                name: customer.name,
                phone: customer.phone,
            },
            movie: {
                _id: movie._id,
                title: movie.title,
                dailyRentalRate: movie.dailyRentalRate,
            },
        })

        rental = await rental.save();

        movie.numberInStock--;
        movie.save();

        sendResponse(res, { message: 'Data created', data: rental });
    } catch (error) {
        sendResponse(res, { statusCode: 500, message: error['message'] });
    }
})

module.exports = router;