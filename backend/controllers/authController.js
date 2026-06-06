import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { readMockDB, writeMockDB } from '../config/db.js';

// Helper to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide all details' });
  }

  try {
    if (global.isMockDB) {
      const db = readMockDB();
      const userExists = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (userExists) {
        return res.status(400).json({ success: false, message: 'User already exists' });
      }

      // Hash password manually for mock database
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create first user as admin, rest as users
      const role = db.users.length === 0 ? 'admin' : 'user';

      const newUser = {
        _id: 'mock_user_' + Date.now(),
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role,
        favoriteCategories: [],
        bookmarks: [],
        createdAt: new Date().toISOString()
      };

      db.users.push(newUser);
      writeMockDB(db);

      return res.status(201).json({
        success: true,
        token: generateToken(newUser._id),
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          favoriteCategories: newUser.favoriteCategories,
          bookmarks: newUser.bookmarks
        }
      });
    } else {
      // Mongoose Flow
      const userExists = await User.findOne({ email });

      if (userExists) {
        return res.status(400).json({ success: false, message: 'User already exists' });
      }

      // First user is admin
      const isFirstUser = (await User.countDocuments({})) === 0;
      const role = isFirstUser ? 'admin' : 'user';

      const user = await User.create({
        name,
        email,
        password,
        role
      });

      return res.status(201).json({
        success: true,
        token: generateToken(user._id),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          favoriteCategories: user.favoriteCategories,
          bookmarks: user.bookmarks
        }
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Registration failed, server error' });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide email and password' });
  }

  try {
    if (global.isMockDB) {
      const db = readMockDB();
      const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (user && (await bcrypt.compare(password, user.password))) {
        return res.json({
          success: true,
          token: generateToken(user._id),
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            favoriteCategories: user.favoriteCategories,
            bookmarks: user.bookmarks
          }
        });
      } else {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }
    } else {
      // Mongoose Flow
      const user = await User.findOne({ email }).select('+password');

      if (user && (await user.matchPassword(password))) {
        return res.json({
          success: true,
          token: generateToken(user._id),
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            favoriteCategories: user.favoriteCategories,
            bookmarks: user.bookmarks
          }
        });
      } else {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Login failed, server error' });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  // req.user is already populated by auth middleware
  res.json({
    success: true,
    user: req.user
  });
};

// @desc    Update user profile / preferences
// @route   PUT /api/auth/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  const { name, favoriteCategories } = req.body;

  try {
    if (global.isMockDB) {
      const db = readMockDB();
      const userIdx = db.users.findIndex(u => u._id === req.user._id);

      if (userIdx === -1) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      if (name) db.users[userIdx].name = name;
      if (favoriteCategories) db.users[userIdx].favoriteCategories = favoriteCategories;

      writeMockDB(db);

      const { password, ...updatedUser } = db.users[userIdx];

      return res.json({
        success: true,
        user: updatedUser
      });
    } else {
      // Mongoose Flow
      const user = await User.findById(req.user._id);

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      if (name) user.name = name;
      if (favoriteCategories) user.favoriteCategories = favoriteCategories;

      const updatedUser = await user.save();

      return res.json({
        success: true,
        user: {
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          favoriteCategories: updatedUser.favoriteCategories,
          bookmarks: updatedUser.bookmarks
        }
      });
    }
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ success: false, message: 'Profile update failed, server error' });
  }
};

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Please provide an email' });
  }

  try {
    let userExists = false;
    let name = '';

    if (global.isMockDB) {
      const db = readMockDB();
      const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (user) {
        userExists = true;
        name = user.name;
      }
    } else {
      const user = await User.findOne({ email });
      if (user) {
        userExists = true;
        name = user.name;
      }
    }

    if (!userExists) {
      // For security, return success even if email is not found
      return res.json({ success: true, message: 'If email exists, a password reset link has been logged' });
    }

    // Generate simulated password reset token/link
    const resetToken = jwt.sign({ email: email.toLowerCase() }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const resetUrl = `http://localhost:5173/reset-password?token=${resetToken}`;

    console.log('\n=============================================');
    console.log(`📩 PASSWORD RESET REQUEST RECEIVED FOR: ${email}`);
    console.log(`Dear ${name},`);
    console.log(`To reset your password, click this link (expires in 15 mins):`);
    console.log(`${resetUrl}`);
    console.log('=============================================\n');

    return res.json({
      success: true,
      message: 'A simulated password reset link has been logged to the server console. Use the token to proceed.'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ success: false, message: 'Reset password initiation failed' });
  }
};

// @desc    Reset Password using token
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword || newPassword.length < 6) {
    return res.status(400).json({ success: false, message: 'Token and new password (min 6 chars) are required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    if (global.isMockDB) {
      const db = readMockDB();
      const userIdx = db.users.findIndex(u => u.email.toLowerCase() === email);

      if (userIdx === -1) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const salt = await bcrypt.genSalt(10);
      db.users[userIdx].password = await bcrypt.hash(newPassword, salt);
      writeMockDB(db);
    } else {
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      user.password = newPassword;
      await user.save();
    }

    return res.json({
      success: true,
      message: 'Password reset successful. You can now login.'
    });
  } catch (error) {
    console.error('Reset password error:', error.message);
    res.status(400).json({ success: false, message: 'Invalid or expired password reset token' });
  }
};
