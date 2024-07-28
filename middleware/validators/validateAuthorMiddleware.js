
const BadRequestError = require("../../errors/badRequestError");
const { validateAuthor } = require("../../models/author");
const { modify } = require("../../utils/response");

module.exports.validateAuthorBody = (req, res, next) => {
  const { error } = validateAuthor(req.body);

  if (error) {
    return next(new BadRequestError(modify(error['details'][0]['message'])));
  }

  next();
}
