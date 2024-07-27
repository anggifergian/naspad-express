const { sendResponse } = require("../utils/response");

const errorHandler = (err, req, res, next) => {
  // Operational errors are those created using AppError
  if (err.isOperational) {
    return sendResponse(res, {
      statusCode: err.statusCode,
      status: err.status,
      message: err.message,
      data: err.data || null
    })
  }

  // For programming or other unknown errors, don't leak error details
  console.log('ERROR 💥', err);

  sendResponse(res, {
    statusCode: 500,
    status: 'error',
    message: 'Something went wrong!',
  });
};

module.exports = errorHandler;