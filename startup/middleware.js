const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const express = require('express');

module.exports = function (app) {
    /**=== Add Morgan ===*/
    app.use(require('../middleware/morgan'));

    /**=== Secure HTTP headers ===*/
    app.use(helmet());

    /**=== Enable CORS ===*/
    app.use(cors());

    /**=== Allow JSON request ===*/
    app.use(bodyParser.json());

    /**=== Allow x-www-form-urlencoded request ===*/
    app.use(bodyParser.urlencoded({ extended: true }));

    /**=== Static files ===*/
    app.use(express.static('public'));

    /**=== Main Route ===*/
    app.use('/api/v1', require('../startup/routes'));

    /**=== 404 handler for unknown routes ===*/
    app.all('*', require('../middleware/unknownRoutes'));

    /**=== Error Handler ===*/
    app.use(require('../middleware/errorHandler'));
}