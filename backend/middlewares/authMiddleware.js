const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware function to authenticate a user
const authenticateToken = (req, res, next) => {
    // Get the token from the Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer token

    // If there's no token, return a 401 Unauthorized response
    if (!token) {
        return res.status(401).json({ msg: 'Access denied. No token provided.' });
    }

    // Verify the token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ msg: 'Invalid token.' });
    }
};

module.exports = authenticateToken;
