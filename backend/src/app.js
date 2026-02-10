const express = require('express');
const cors = require('cors');
require('dotenv').config();


const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const salesRoutes = require('./routes/salesRoutes');


require('./events/eventListeners');


const { errorHandler } = require('./middleware/errorHandler');

const app = express();


app.use(cors({
  origin: (origin, callback) => {
   
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      'http://localhost:3000',
      process.env.FRONTEND_URL,
    ];

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: false, 
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));



app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});
const io = new Server(server, {
  cors: { origin: '*' },
});

app.set('io', io); 

io.on('connection', (socket) => {
  console.log('✅ Client connected via socket.io');
});


app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/sales', salesRoutes);


app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});


app.use(errorHandler);

module.exports = app;
