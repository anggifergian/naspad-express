const AppError = require('./appError');

class BadRequestError extends AppError {
  constructor(message = 'Bad Request', data = null) {
    super(message, 400);
    this.data = data;
  }
}

module.exports = BadRequestError;