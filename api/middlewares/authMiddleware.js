import jwt from 'jsonwebtoken';
import { User } from '../models/userShema.js';


export const protect = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1]; // Get token from cookie or authorization header
        if (!token) {
            return res.status(401).json({ message: 'Not authorized, no token' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch the user associated with the token
        req.user = await User.findById(decoded.id).select('-password'); // Exclude password
        if (!req.user) {
            return res.status(404).json({ message: 'User not found' });
        }

        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        res.status(401).json({ message: 'Not authorized, token failed', error: error.message });
    }
};
