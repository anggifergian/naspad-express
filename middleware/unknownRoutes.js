module.exports = function (req, res, next) {
  const NotFoundError = require('../errors/notFoundError');
  next(new NotFoundError(`Can't find ${req.originalUrl} on this server!`));
}