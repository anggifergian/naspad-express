const express = require('express');
const router = express.Router();
const Joi = require('joi');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');

const { sendResponse, modify } = require('../utils/response');
const { User } = require('../models/user');

router.post('/login', async (req, res) => {
    try {
        const { error } = validateLogin(req.body);
        if (error) {
            const errMessage = modify(error['details'][0]['message']);
            return sendResponse(res, { statusCode: 400, message: errMessage });
        }

        let user = await User.findOne({ email: req.body.email });
        if (!user) {
            return sendResponse(res, { statusCode: 400, message: "Invalid email or password." });
        }

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return sendResponse(res, { statusCode: 400, message: "Invalid email or password." });
        }

        const token = jwt.sign({ _id: user._id }, config.get('jwtPrivateKey'));

        sendResponse(res, { 
            message: 'Login successful', 
            data: {
                ..._.pick(user, ['name', 'email']),
                token,
            } 
        });
    } catch (error) {
        sendResponse(res, { statusCode: 500, message: error['message'] });
    }
})

function validateLogin(item) {
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(1024).required()
    });

    return schema.validate(item);
}

module.exports = router;