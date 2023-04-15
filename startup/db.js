const mongoose = require('mongoose');
const logger = require('../utils/logger');

module.exports = function () {
    mongoose.set('strictQuery', false);
    mongoose.connect('mongodb://localhost/playground')
        .then(() => logger.info('Connected to MongoDB...'));
}