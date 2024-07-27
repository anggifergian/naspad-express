const { isValidID } = require("./mongoose");
const { sendResponse } = require("./response");

const validateID = (req, res, next) => {
  const { id } = req['params'];

  if (!isValidID(id)) {
    return sendResponse(res, { statusCode: 400, message: 'Please input valid ID.' });
  }

  next();
}

module.exports = validateID;