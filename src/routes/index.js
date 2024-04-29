const express = require('express');
const router = express.Router();

const trackRoutes = require('./trackRoutes');

// Mount the track routes
router.use('/tracks', trackRoutes);

module.exports = router;