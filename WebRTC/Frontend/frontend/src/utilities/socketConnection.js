import { io } from 'socket.io-client'; // Importing named export 'io'

io.connect('https://localhost:8070');

export {io};