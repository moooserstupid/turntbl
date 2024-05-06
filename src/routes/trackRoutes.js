const express = require('express');
const router = express.Router();
const trackController = require('../controllers/trackController');
const authController = require('../middlewares/authMiddleware');

// Define track routes
router.get('/', authController.authenticateUser, trackController.getAllTracks);
router.get('/:id', authController.authenticateUser, trackController.getTrackById);
router.post('/', authController.authenticateUser, trackController.createTrack);
router.put('/:id', authController.authenticateUser, trackController.updateTrack);
router.delete('/:id', authController.authenticateUser, trackController.deleteTrack);

module.exports = router;
