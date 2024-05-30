const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const trackRoutes = require('./routes/trackRoutes');
const playlistRoutes = require('./routes/playlistRoutes');
const app = express();

// Use the CORS middleware
// const corsOptions = {
//     origin: 'http://localhost:8888', // Replace with your frontend URL if needed
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     allowedHeaders: ['Content-Type', 'Authorization']
// };

// Middleware
app.use(bodyParser.json());
app.use(cors())

// Routes
app.use('/', authRoutes);
app.use('/tracks', trackRoutes);
app.use('/playlists', playlistRoutes);

module.exports = app;
