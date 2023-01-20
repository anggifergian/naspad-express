const { Server } = require('socket.io');
const httpServer = require('./server');
const { socketDebug } = require('./utils/debugger');

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