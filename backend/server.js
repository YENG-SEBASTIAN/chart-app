const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./swagger/swaggerConfig');
const connectDB = require('./DbConfig/db'); // MongoDB connection
const chatRoutes = require('./routes/chatRoutes'); // Chat-related routes
const chatController = require('./controllers/chatController'); // Chat Socket.IO handling
require('dotenv').config(); // Load environment variables

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173', // Frontend URL
    methods: ['GET', 'POST'],
  },
});

// Connect to MongoDB
connectDB();

// Setup middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173', // Allow frontend origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow necessary headers
}));
app.use(express.json()); // Parse incoming JSON data

// Serve static files (for media)
app.use('/uploads', express.static('uploads'));

// API routes
app.use('/api/chat', chatRoutes); // Chat-related API routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs)); // Swagger documentation

// Socket.IO real-time messaging
io.on('connection', (socket) => {
    console.log('A user connected via Socket.IO');

    // Send messages using Socket.IO
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg); // Broadcast message to all users
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Pass io to be used in the controllers for broadcasting messages in HTTP API
app.set('io', io);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
