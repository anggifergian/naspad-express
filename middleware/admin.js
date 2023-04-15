const { sendResponse } = require("../utils/response");

module.exports = function (req, res, next) {
    try {
        if (!req.user.isAdmin) {
            return sendResponse(res, { statusCode: 403, message: "Access denied." });
        }

        next();
    } catch (error) {
        sendResponse(res, { statusCode: 400, message: "Invalid token" });
    }
}