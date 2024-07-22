const { getEnvVar } = require('../utils/config');

require('dotenv').config();

module.exports = function () {
    if (!getEnvVar('jwtPrivateKey')) {
        throw new Error(`FATAL ERROR: jwtPrivateKey env is not defined.`);
    }
}