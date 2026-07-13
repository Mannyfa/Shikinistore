const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { db } = require('./config/firebase'); 
const productRouter = require('./routes/productRoutes'); // 1. Import the product router

const app = express();

// --- Global Middleware ---
app.use(cors()); 
app.use(express.json()); 

// --- Mount API Routes ---
app.use('/api/products', productRouter); // 2. Mount product routes at /api/products

// Health Check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Shikini Luxury Archives Backend is active and synced with Firebase.',
    timestamp: new Date().toISOString()
  });
});

// --- Server Initialization ---
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n=========================================`);
  console.log(`🚀 Server initialized in ${process.env.NODE_ENV} mode.`);
  console.log(`📡 Listening on port ${PORT}`);
  console.log(`🩺 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🛍️  Products API: http://localhost:${PORT}/api/products`);
  console.log(`=========================================\n`);
});