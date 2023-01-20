const mongoose = require('mongoose');

module.exports.isValidID = function(id) {
    return mongoose.Types.ObjectId.isValid(id);
}