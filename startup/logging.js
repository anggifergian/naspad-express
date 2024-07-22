require('dotenv').config();
require('express-async-errors');

const { getEnvVar } = require('../utils/config');
const logger = require('../utils/logger');

module.exports = function (app) {
    // Middleware to log incoming requests
    app.use((req, res, next) => {
        logger.info(`${req.method} ${req.url}`);
        next();
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (ex) => {
        logger.error(ex.message, ex);
        process.exit(1);
    })

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (ex) => {
        logger.error(ex.message, ex);
        process.exit(1);
    })

    /**=== Perform Uncaught Exception ===*/
    // throw new Error('Test nodeJs uncaught exception.');

    /**=== Perform Unhandle Promise Rejections ===*/
    // const p = Promise.reject(new Error('Something failed miserably!'));
    // p.then(() => console.log('Done!'));

    // Additional startup debug information
    logger.info(`App name: ${getEnvVar('name')}`);
    logger.info(`Mail service: ${getEnvVar('mailHost')}`);
}