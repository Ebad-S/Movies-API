// app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { logRequest, logError } = require('./middlewares/loggingMiddleware');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const moviesRoutes = require('./routes/movies');
const postersRoutes = require('./routes/posters');

const app = express();

app.use(logRequest);
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.static('posters'));

app.use('/user', authRoutes);
app.use('/movies', moviesRoutes);
app.use('/posters', postersRoutes);

app.use(logError);
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: true,
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

// SSL Options with proper path resolution
const sslOptions = {
    key: fs.readFileSync(path.join(__dirname, 'ssl', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'ssl', 'cert.pem'))
};

const PORT = process.env.PORT || 3001;

// Create HTTPS server with error handling
https.createServer(sslOptions, app)
    .listen(PORT, () => {
        console.log(`Secure server running on https://localhost:${PORT}`);
    })
    .on('error', (err) => {
        console.error('Server error:', err);
        process.exit(1);
    });