const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('config');
const debug = require('debug')('app:startup');

const PORT = process.env.PORT || 9000;
const app = express();

debug(`App name: ${config.get('name')}`);
debug(`Mail service: ${config.get('mail.host')}`);
debug(`Mail password: ${config.get('mail.password')}`);

if (app.get('env') === 'development') {
    app.use(morgan('common'));
    debug('Morgan enabled...');
}

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
app.listen(PORT, () => debug(`Listening on port ${PORT}`));