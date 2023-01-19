const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('config');
const mongoose = require('mongoose');
const debug = require('debug')('app:startup');
const socketDebug = require('debug')('app:socket');
const mongodDebug = require('debug')('app:mongod');
const { createServer } = require('http');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 9000;
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    }
});

io.on('connection', (socket) => {
    socketDebug(`User connected ${socket.id}`);

    socket.on('join_room', (data) => {
        const { username } = data;
        socketDebug('AF: username...', username);
    });
});

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