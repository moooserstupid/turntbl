const express = require('express');
const router = express.Router();
const entryController = require('../controllers/authController');

// Define track routes
router.post('/register', entryController.registerUser);
router.post('/login', entryController.loginUser);

module.exports = router;