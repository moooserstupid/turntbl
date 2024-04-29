const express = require('express');
const router = express.Router();
const trackController = require('../controllers/trackController');

// Define track routes
router.get('/', trackController.getAllTracks);
router.get('/:id', trackController.getTrackById);
router.post('/', trackController.createTrack);
router.put('/:id', trackController.updateTrack);
router.delete('/:id', trackController.deleteTrack);

module.exports = router;
