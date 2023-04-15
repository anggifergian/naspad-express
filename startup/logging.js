const config = require('config');
require('express-async-errors');

const { startupDebug } = require("../utils/debugger");
const logger = require('../utils/logger');

module.exports = function () {
    process.on('uncaughtException', (ex) => {
        logger.error(ex.message, ex);
    })
    
    process.on('unhandledRejection', (ex) => {
        logger.error(ex.message, ex);
    })
    
    /**=== Perform Uncaught Exception ===*/
    // throw new Error('Test nodeJs uncaught exception.');
    
    /**=== Perform Unhandle Promise Rejections ===*/
    // const p = Promise.reject(new Error('Something failed miserably!'));
    // p.then(() => console.log('Done!'));
    
    startupDebug(`App name: ${config.get('name')}`);
    startupDebug(`Mail service: ${config.get('mail.host')}`);
}