const fs = require('fs');
const https = require('https');
const express = require('express');
const socketio = require('socket.io');
const cors = require('cors')
const app = express();


app.use(cors());
app.use(express.json());



const key = fs.readFileSync('./certs/create-cert-key.pem');
const cert = fs.readFileSync('./certs/create-cert.pem');

const expressServer = https.createServer({ key, cert }, app);

const io = socketio(expressServer, {
    cors: ['https://localhost:5173/']
});

expressServer.listen(8070, ()=> console.log("conntected to server"));

module.exports = { io, expressServer, app };
