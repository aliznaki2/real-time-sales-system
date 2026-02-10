const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { createServer } = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/database');
const { startDailySalesJob } = require('./jobs/dailySalesJob');
const setupSocketHandlers = require('./sockets/socketHandler'); // ✅ FIX: Import

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});


connectDB();


app.use(cors());
app.use(express.json());


app.set('io', io);


app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/sales', require('./routes/salesRoutes'));


setupSocketHandlers(io);


startDailySalesJob(io);

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log('📡 WebSocket server ready');
});
