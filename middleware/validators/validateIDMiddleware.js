const BadRequestError = require("../../errors/badRequestError");
const { isValidID } = require("../../utils/mongoose");
const { modify } = require("../../utils/response");

module.exports.validateID = (req, res, next) => {
  const { id } = req.params;

  if (!isValidID(id)) {
    return sendResponse(res, { statusCode: 400, message: 'Please input valid ID.' });
  }

  next();
}

module.exports.validateAuthorID = (req, res, next) => {
  const { authorId } = req.body;

  if (!isValidID(authorId)) {
    return next(new BadRequestError(modify(error['details'][0]['message'])));
  }

  next();
}
