const express = require('express');
const router = express.Router();

const { Customer, validateCustomer: validate } = require('../models/customer');
const { sendResponse } = require('../utils/response');
const { isValidID } = require('../utils/mongoose');

router.get('/', async (req, res) => {
    try {
        const customers = await Customer.find().select('name').limit(10).sort('createdAt');

        sendResponse(res, {
            message: customers.length > 0 ? 'Data found.' : 'Empty list.',
            data: customers,
        })
    } catch (error) {
        sendResponse(res, { statusCode: 500, message: error['message'] });
    }
})

router.post('/', async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error) {
            const errMessage = error.details[0].message.replace(/\"/g, '');
            return sendResponse(res, { statusCode: 400, message: errMessage });
        }

        let customer = new Customer({ 
            name: req.body.name,
            isGold: req.body.isGold,
            phone: req.body.phone,
        });
        customer = await customer.save();

        sendResponse(res, { message: 'Data created', data: customer });
    } catch (error) {
        sendResponse(res, { statusCode: 500, message: error['message'] });
    }
})

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidID(id)) {
            const errMessage = 'Please input valid ID.';
            return sendResponse(res, { statusCode: 400, message: errMessage });
        }

        const { error } = validate(req.body);
        if (error) {
            const errMessage = error.details[0].message.replace(/\"/g, '');
            return sendResponse(res, { statusCode: 400, message: errMessage });
        }

        const customer = await Customer.findByIdAndUpdate(id, {
            name: req.body.name,
        }, { new: true })

        if (!customer) {
            const errMessage = 'The customer with the given ID was not found.';
            return sendResponse(res, { statusCode: 404, message: errMessage });
        }

        sendResponse(res, { message: 'Data updated', data: customer, });
    } catch (error) {
        sendResponse(res, { statusCode: 500, message: error['message'] });
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidID(id)) {
            const errMessage = 'Please input valid ID.';
            return sendResponse(res, { statusCode: 400, message: errMessage });
        }

        const customer = await Customer.findByIdAndRemove(id);

        if (!customer) {
            const errMessage = 'The customer with the given ID was not found.';
            return sendResponse(res, { statusCode: 404, message: errMessage });
        }

        const successMessage = 'The customer with the given ID has been deleted successfully.';
        sendResponse(res, { message: successMessage, data: customer });
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

        const customer = await Customer.findById(id);

        if (!customer) {
            const errMessage = 'The customer with the given ID was not found.';
            return sendResponse(res, { statusCode: 404, message: errMessage });
        }

        sendResponse(res, { message: 'Data found', data: customer })
    } catch (error) {
        sendResponse(res, { statusCode: 500, message: error['message'] });
    }
})

module.exports = router;