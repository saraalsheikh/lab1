import express from 'express';
import DatabaseService from './src/service/DatabaseService.js';
import logger from 'morgan';
import cors from 'cors';
import dishesRouter from './src/route/dishesRoute.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();

// Database connection
DatabaseService.connect();

// Middleware
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/dishes', dishesRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'API is running'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});