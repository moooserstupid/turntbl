const express = require('express');
const router = express.Router();
const playlistController = require('../controllers/playlistController');
const authController = require('../middlewares/authMiddleware');

// Define track routes
router.get('/', authController.authenticateUser, playlistController.getAllPlaylistsAndTracks);
router.post('/', authController.authenticateUser, playlistController.createNewPlaylist);
router.delete('/', authController.authenticateUser, playlistController.deletePlaylist);

module.exports = router;
