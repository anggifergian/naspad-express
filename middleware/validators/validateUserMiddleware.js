const BadRequestError = require("../../errors/badRequestError");
const { validateUser } = require("../../models/user");
const { modify } = require("../../utils/response");

module.exports.validateUserBody = (req, res, next) => {
  const { error } = validateUser(req.body);

  if (error) {
    return next(new BadRequestError(modify(error['details'][0]['message'])))
  }

  next();
}