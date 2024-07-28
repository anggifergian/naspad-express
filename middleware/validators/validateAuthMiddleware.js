const BadRequestError = require("../../errors/badRequestError");
const { validateLogin } = require('../../models/user');
const { modify } = require("../../utils/response");

module.exports.validateLoginBody = (req, res, next) => {
  const { error } = validateLogin(req.body);

  if (error) {
    return next(new BadRequestError(modify(error['details'][0]['message'])))
  }

  next();
}