const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('config');
const mongoose = require('mongoose');
const { createServer } = require('http');

const { debug, mongodDebug } = require('./utils/debugger');
const error = require('./middleware/error');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 9000;
const app = express();
const httpServer = createServer(app);

if (!config.get('jwtPrivateKey')) {
    debug(`FATAL ERROR: jwtPrivateKey env is not defined.`);
    process.exit(1);
}

process.on('uncaughtException', (ex) => {
    logger.error(ex.message, ex);
})

process.on('unhandledRejection', (ex) => {
    logger.error(ex.message, ex);
})

debug(`App name: ${config.get('name')}`);
debug(`Mail service: ${config.get('mail.host')}`);
// debug(`Mail password: ${config.get('mail.password')}`);

if (app.get('env') === 'development') {
    app.use(morgan('common'));
    debug('Morgan enabled...');
}

/**=== Perform Uncaught Exception ===*/
// throw new Error('Test nodeJs uncaught exception.');

/**=== Perform Unhandle Promise Rejections ===*/
// const p = Promise.reject(new Error('Something failed miserably!'));
// p.then(() => console.log('Done!'));

mongoose.set('strictQuery', false);
mongoose.connect('mongodb://localhost/playground')
    .then(() => mongodDebug('Connected to MongoDB...'))
    .catch(err => mongodDebug('Could not connect to MongoDB', err));

/**=== Add Morgan ===*/
// app.use(require('./middleware/morgan'));

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
app.use('/api/v1', require('./router'));

/**=== Error Handler ===*/
app.use(error);

/**=== Listener ===*/
httpServer.listen(PORT, () => debug(`Listening on port ${PORT}`));

module.exports = httpServer;