const jwt = require('jsonwebtoken');
const User = require('../model/user-Schema');

const auth = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        
        if (!authHeader) {
            return res.status(401).json({ message: 'No authorization token provided' });
        }

        // Check if the header starts with 'Bearer '
        if (!authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Invalid token format' });
        }

        const token = authHeader.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: 'Token is required' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Find user in database
            const user = await User.findById(decoded.userId); // Changed from _id to userId
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            req.user = user;
            next();
        } catch (jwtError) {
            console.error('JWT verification error:', jwtError);
            return res.status(401).json({ message: 'Invalid or expired token' });
        }
    } catch (error) {
        console.error('Auth error:', error);
        res.status(500).json({ message: 'Server authentication error' });
    }
};

module.exports = auth;