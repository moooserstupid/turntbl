const express = require('express');
const router = express.Router();
const trackController = require('../controllers/trackController');
const authController = require('../middlewares/authMiddleware');

// Define track routes
router.post('/', authController.authenticateUser, trackController.addTrackToPlaylist);
router.delete('/', authController.authenticateUser, trackController.deleteTrackFromPlaylist);

module.exports = router;
