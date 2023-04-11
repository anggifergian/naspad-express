const mongoose = require('mongoose');
const { validate: uuidValidate } = require('uuid')

module.exports.isValidID = function(id) {
    return mongoose.Types.ObjectId.isValid(id);
}

module.exports.checkValidUUID = function(uuid) {
    return uuidValidate(uuid)
}