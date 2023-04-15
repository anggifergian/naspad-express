const { sendResponse } = require('../utils/response');

module.exports = function(err, req, res, next) {
    sendResponse(res, { statusCode: 500, message: err['message'] });
}