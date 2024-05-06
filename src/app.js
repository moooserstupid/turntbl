const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const trackRoutes = require('./routes/trackRoutes');
//const errorHandler = require('./utils/errorHandler');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors())

// Routes
app.use('/', authRoutes);
app.use('/tracks', trackRoutes);

// Error handler middleware
//app.use(errorHandler);

module.exports = app;
