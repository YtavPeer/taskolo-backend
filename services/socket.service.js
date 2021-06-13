const asyncLocalStorage = require('./als.service');
const logger = require('./logger.service');

var gIo = null
var gSocketBySessionIdMap = {}


function connectSockets(http, session) {

    gIo = require('socket.io')(http, {
        cors: {
            origin: ['http://127.0.0.1:8080', 'http://localhost:8080', 'http://127.0.0.1:3000', 'http://localhost:3000'],
            credentials: true,
            methods: ['GET', 'PUT', 'POST', 'DELETE']
        }
    });




    const sharedSession = require('express-socket.io-session');

    gIo.use(sharedSession(session, {
        autoSave: true
    }));
    
    gIo.on('connection', socket => {
        console.log('New socket - socket.handshake.sessionID', socket.handshake.sessionID)
        gSocketBySessionIdMap[socket.handshake.sessionID] = socket
        // console.log('gSocketBySessionIdMap', Object.keys(gSocketBySessionIdMap))
        // TODO: emitToUser feature - need to tested for CaJan21
        // if (socket.handshake?.session?.user) socket.join(socket.handshake.session.user._id)
        socket.on('disconnect', socket => {
            // console.log('Someone disconnected')
            if (socket.handshake) {
                gSocketBySessionIdMap[socket.handshake.sessionID] = null
            }
        })
        socket.on('board-watch', boardId => {
            // boardId = boardId.toString();
            console.log('connect to board socket...')
            if (socket.boardId === boardId) return;
            if (socket.boardId) {
                socket.leave(socket.boardId)
            }
            socket.join(boardId)
            logger.debug('Session ID is', socket.handshake.sessionID)
            socket.boardId = boardId
        })

        socket.on('task-watch', taskId => {
            // boardId = boardId.toString();
            console.log('connect to board socket...')
            if (socket.taskId === taskId) return;
            if (socket.taskId) {
                socket.leave(socket.taskId)
            }
            socket.join(boardtaskIdId)
            logger.debug('Session ID is', socket.handshake.sessionID)
            socket.boardtaskIdd = taskId
        })

        socket.on('user-watch', userId => {
            socket.join(userId)
        })
    })
}

function emitToAll({ type, data, room = null }) {
    if (room) gIo.to(room).emit(type, data)
    else gIo.emit(type, data)
}

// TODO: Need to test emitToUser feature
function emitToUser({ type, data, userId }) {
    gIo.to(userId).emit(type, data)
}

// Send to all sockets BUT not the current socket 
function broadcast({ type, data, room = null }) {
    const store = asyncLocalStorage.getStore()
    const { sessionId } = store
    console.log('session id in broadcast func', sessionId)
    if (!sessionId) return logger.debug('Shoudnt happen, no sessionId in asyncLocalStorage store')
    const excludedSocket = gSocketBySessionIdMap[sessionId]
    // console.log('excludedSocket', gSocketBySessionIdMap[sessionId])
    // console.log('Socket Map:', Object.keys(gSocketBySessionIdMap), 'sessionId:', sessionId)
    if (!excludedSocket) return logger.debug('Shouldnt happen, No socket in map')
    if (room) excludedSocket.broadcast.to(room).emit(type, data)
    else excludedSocket.broadcast.emit(type, data)
}


module.exports = {
    connectSockets,
    emitToAll,
    broadcast
}


