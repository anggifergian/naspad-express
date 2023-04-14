const jwt = require('jsonwebtoken');
const config = require('config');

const { sendResponse } = require('../utils/response');

module.exports = function (req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) {
        return sendResponse(res, { statusCode: 401, message: "Access denied. No token provided" });
    }

    try {
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        req.user = decoded;

        next();
    } catch (error) {
        sendResponse(res, { statusCode: 400, message: "Invalid token" });
    }
}