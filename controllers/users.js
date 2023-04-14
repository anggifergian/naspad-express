const express = require('express');
const router = express.Router();
const _ = require('lodash');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');

const { sendResponse, modify } = require('../utils/response');
const { User, validateUser } = require('../models/user');

router.post('/', async (req, res) => {
    try {
        const { error } = validateUser(req.body);
        if (error) {
            const errMessage = modify(error['details'][0]['message']);
            return sendResponse(res, { statusCode: 400, message: errMessage });
        }

        let user = await User.findOne({ email: req.body.email });
        if (user) {
            const errMessage = "User already exist.";
            return sendResponse(res, { statusCode: 400, message: errMessage });
        }

        user = new User(_.pick(req.body, ['name', 'email','password']));
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);

        await user.save();

        const token = jwt.sign({ _id: user._id }, config.get('jwtPrivateKey'));

        res.header('x-auth-token', token).send({
            status: true,
            message: 'Data created',
            data: _.pick(user, ['_id', 'name', 'email'])
        });
    } catch (error) {
        sendResponse(res, { statusCode: 500, message: error['message'] });
    }
})

module.exports = router;