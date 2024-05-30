const jwt = require('jsonwebtoken');

SECRET_KEY = '1234';
// Middleware for authentication
const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, error: 'Unauthorized - Invalid Credentials' });
    }
    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      req.user = { userId: decoded.userId };
      next();
    } catch (error) {
      return res.status(401).json({ success: false, error: 'Unauthorized - Invalid Credentials' });
    }
  };

  module.exports = {
    authenticateUser
  }