const express = require('express');
const router = express.Router();
const entryController = require('../controllers/authController');
const authController = require('../middlewares/authMiddleware');

// Define track routes
router.post('/auth', authController.authenticateUser, entryController.authUser); 
router.post('/register', entryController.registerUser);
router.post('/login', entryController.loginUser);

module.exports = router;