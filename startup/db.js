const mongoose = require('mongoose');
const config = require('config');
const logger = require('../utils/logger');

module.exports = function () {
    const db_string = config.get('db');
    mongoose.set('strictQuery', false);
    mongoose.connect(db_string)
        .then(() => logger.info(`Connected to ${db_string}...`));
}