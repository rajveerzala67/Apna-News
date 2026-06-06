import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { readMockDB } from '../config/db.js';

// Strict auth middleware - throws 401 if token missing or invalid
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (global.isMockDB) {
      const db = readMockDB();
      const mockUser = db.users.find(u => u._id === decoded.id);

      if (!mockUser) {
        return res.status(401).json({ success: false, message: 'User not found in mock database' });
      }

      const { password, ...userWithoutPassword } = mockUser;
      req.user = userWithoutPassword;
    } else {
      req.user = await User.findById(decoded.id);

      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User not found' });
      }
    }

    next();
  } catch (error) {
    console.error('Authentication verification failed:', error.message);
    return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
  }
};

// Permissive auth middleware - does not throw error if token is missing
export const permissiveAuth = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (global.isMockDB) {
      const db = readMockDB();
      const mockUser = db.users.find(u => u._id === decoded.id);
      if (mockUser) {
        const { password, ...userWithoutPassword } = mockUser;
        req.user = userWithoutPassword;
      }
    } else {
      const user = await User.findById(decoded.id);
      if (user) {
        req.user = user;
      }
    }
  } catch (error) {
    // Silently continue for guests on verification failure
    console.warn('Permissive JWT check failed (continuing as guest):', error.message);
  }

  next();
};
