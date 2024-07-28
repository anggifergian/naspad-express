const express = require('express');
const router = express.Router();
const _ = require('lodash');
const bcrypt = require('bcrypt');

const { sendResponse } = require('../utils/response');
const { User } = require('../models/user');
const authMiddleware = require('../middleware/auth');
const { validateUserBody } = require('../middleware/validators/validateUserMiddleware');
const BadRequestError = require('../errors/badRequestError');

router.get('/', async (req, res, next) => {
    try {
        const users = await User
            .find()
            .select('-__v')
            .sort('-updatedAt');

        sendResponse(res, {
            message: users.length > 0 ? 'Data found' : 'Empty list',
            data: users,
        });
    } catch (error) {
        next(error);
    }
});

router.post('/', validateUserBody, async (req, res, next) => {
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) throw new BadRequestError("User already exists.");

        user = new User(_.pick(req.body, ['name', 'email', 'password']));
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);

        const savedUser = await user.save();

        const token = user.generateAuthToken();

        res.header('x-auth-token', token);

        sendResponse(res, {
            message: 'Data created',
            data: _.pick(savedUser, ['_id', 'name', 'email'])
        });
    } catch (error) {
        next(error);
    }
})

router.get('/me', authMiddleware, async (req, res, next) => {
    try {
        const user = await User
            .findById(req.user._id)
            .select('-password -__v -createdAt');

        sendResponse(res, { message: 'Data found', data: user });
    } catch (error) {
        next(error);
    }
})

module.exports = router;