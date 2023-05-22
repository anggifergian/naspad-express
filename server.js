const express = require('express');
const logger = require('./utils/logger');
const app = express();

require('./startup/logging')();
require('./startup/config')();
require('./startup/db')();
require('./startup/middleware')(app);
require('./startup/validation')();

const PORT = process.env.PORT || 9000;
const server = app.listen(PORT, () => logger.info(`Listening on port ${PORT}`));

module.exports = server;