const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();
exports.protect = async (req, res, next) => {
  let token;

  console.log("Authorization Header:", req.headers.authorization); // 👈 log token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    console.log("No token found");
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded:", decoded); // 👈 log decoded token

    req.user = await User.findById(decoded.id).select('-password');
    console.log("User found:", req.user); // 👈 log user

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
      });
    }

    next();
  } catch (err) {
    console.error("Token verification failed:", err.message); // 👈 log error
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route',
    });
  }
};
