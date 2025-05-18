import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const protect = async (req, res, next) => {
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).json({ message: 'OK' });
  }

  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      try {
        token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        return next();
      } catch (error) {
        return res.status(401).json({ message: 'Not authorized, token failed' });
      }
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};

export { protect };