const express = require('express');
const router = express.Router();

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

        user = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
        });

        await user.save();

        sendResponse(res, { message: 'Data created', data: user });
    } catch (error) {
        sendResponse(res, { statusCode: 500, message: error['message'] });
    }
})

module.exports = router;