const { sendResponse } = require('../utils/response');
const logger = require('../utils/logger');

module.exports = function(err, req, res, next) {
    logger.error(err['message'], err);

    sendResponse(res, { statusCode: 500, message: err['message'] });
}