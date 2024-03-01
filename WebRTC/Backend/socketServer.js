const { Socket } = require('socket.io')

const io = require('./server').io

io.on('connection', Socket => {
    console.log(Socket.id, "has connected");
})