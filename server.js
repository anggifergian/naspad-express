const { getEnvVar } = require('./utils/config');
const express = require('express');
const { createServer } = require('http');
const logger = require('./utils/logger');

const PORT = getEnvVar('PORT') || 9000;
const app = express();
const httpServer = createServer(app);

require('./startup/logging')(app);
require('./startup/config')();
require('./startup/db')(app);
require('./startup/middleware')(app);
require('./startup/validation')();

httpServer.listen(PORT, () => logger.info(`Listening on port ${PORT}`));

module.exports = httpServer;