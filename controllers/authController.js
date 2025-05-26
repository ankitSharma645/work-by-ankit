const User = require('../models/User');
const generateToken = require('../config/jwt');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public

exports.register = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, address, password,role } = req.body;

  try {
    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    // Create user - password will be hashed by the pre-save hook
    const user = await User.create({
      name,
      email,
      address,
      password, // This will be hashed automatically
      role
    });

    // Return response without the password
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });

  } catch (err) {
    console.error('Registration error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
        token: generateToken(user._id, user.role),
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
exports.updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('+password');
    const { currentPassword, newPassword } = req.body;

    // 🔐 Compare passwords directly using bcrypt
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Password is incorrect' });
    }

    // 🧪 Validate new password
    if (newPassword.length < 8 || newPassword.length > 16) {
      return res.status(400).json({ success: false, message: 'Password must be between 8 and 16 characters' });
    }

    if (!/[A-Z]/.test(newPassword) || !/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password must contain at least one uppercase letter and one special character' 
      });
    }

    // 🔄 Save new password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
        token: generateToken(user._id, user.role),
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Logout user
// @route   GET /api/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};