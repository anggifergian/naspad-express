const { validateProduct } = require('../../models/product');
const BadRequestError = require('../errors/badRequestError');
const { modify } = require('../response');

const validateProductMiddleware = (req, res, next) => {
  const { error } = validateProduct(req['body']);

  if (error) {
    const errMessage = modify(error['details'][0]['message']);
    return next(new BadRequestError(errMessage));
  }

  next();
}

module.exports = validateProductMiddleware;