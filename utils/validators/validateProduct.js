const { validateProduct } = require('../../models/product');
const BadRequestError = require('../../errors/badRequestError');
const { modify } = require('../response');

const validateProductMiddleware = (req, res, next) => {
  const { error } = validateProduct(req['body']);

  if (error) {
    return next(new BadRequestError(modify(error['details'][0]['message'])));
  }

  next();
}

module.exports = validateProductMiddleware;