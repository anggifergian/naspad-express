const BadRequestError = require("../../errors/badRequestError");
const { validateCategory } = require("../../models/category");
const { modify } = require("../../utils/response");

module.exports.validateCategoryBody = (req, res, next) => {
  const { error } = validateCategory(req.body);

  if (error) {
    return next(new BadRequestError(modify(error['details'][0]['message'])));
  }

  next();
}