const express = require('express');
const router = express.Router();
const _ = require('lodash');
const bcrypt = require('bcrypt');

const { sendResponse } = require('../utils/response');
const { User } = require('../models/user');
const { validateLoginBody } = require('../middleware/validators/validateAuthMiddleware');
const BadRequestError = require('../errors/badRequestError');

router.post('/login', validateLoginBody, async (req, res, next) => {
    try {
        let user = await User.findOne({ email: req.body.email });
        if (!user) throw new BadRequestError("Invalid email or password.");

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) throw new BadRequestError("Invalid email or password.");

        const token = user.generateAuthToken();

        sendResponse(res, {
            message: 'Login successful',
            data: {
                token,
                ..._.pick(user, ['name', 'email']),
            }
        });
    } catch (error) {
        next(error);
    }
})

module.exports = router;