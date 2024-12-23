const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']; // Get the Authorization header
    const token = authHeader && authHeader.split(' ')[1]; // Extract the token

    if (!token) {
        return res.status(401).json({ message: 'Access token missing or invalid' });
    }

    try {
        const decoded = jwt.verify(token, 'yourSecretKey'); // Verify token
        req.user = decoded; // Add user data to request
        next(); // Pass control to the next middleware
    } catch (err) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};

module.exports = authenticateToken;
