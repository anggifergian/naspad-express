const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('config');
const mongoose = require('mongoose');
const { createServer } = require('http');
const { debug, mongodDebug } = require('./utils/debugger');

const PORT = process.env.PORT || 9000;
const app = express();
const httpServer = createServer(app);

if (!config.get('jwtPrivateKey')) {
    debug(`FATAL ERROR: jwtPrivateKey env is not defined.`);
    process.exit(1);
}

if (!config.get('mail.password')) {
    debug(`FATAL ERROR: mailPassword env is not defined.`);
    process.exit(1);
}

debug(`App name: ${config.get('name')}`);
debug(`Mail service: ${config.get('mail.host')}`);
debug(`Mail password: ${config.get('mail.password')}`);

if (app.get('env') === 'development') {
    app.use(morgan('common'));
    debug('Morgan enabled...');
}

mongoose.set('strictQuery', false);
mongoose.connect('mongodb://localhost/playground')
    .then(() => mongodDebug('Connected to MongoDB...'))
    .catch(err => mongodDebug('Could not connect to MongoDB', err));

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

/**=== Listener ===*/
httpServer.listen(PORT, () => debug(`Listening on port ${PORT}`));

module.exports = httpServer;