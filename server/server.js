const app = require('./app');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const dotenv = require('dotenv');

dotenv.config();

connectDB();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

require('./socket/socketHandler')(io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`ResQNet server running on port ${PORT}`);
});
