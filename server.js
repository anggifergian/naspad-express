const express = require('express');
const { createServer } = require('http');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 9000;
const app = express();
const httpServer = createServer(app);

require('./startup/logging')();
require('./startup/config')();
require('./startup/db')();
require('./startup/middleware')(app);
require('./startup/validation')();

httpServer.listen(PORT, () => logger.info(`Listening on port ${PORT}`));

module.exports = httpServer;