const startupDebug = require('debug')('app:startup');
const socketDebug = require('debug')('app:socket');
const mongodDebug = require('debug')('app:mongod');

module.exports = {
    debug: startupDebug,
    socketDebug,
    mongodDebug,
}