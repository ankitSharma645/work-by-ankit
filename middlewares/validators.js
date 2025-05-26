const { body } = require('express-validator');

exports.validateRegister = [
  body('name')
    .isLength({ min: 1, max: 20 })
    .withMessage('Name must be between 1-20 characters'),
  body('email')
    .isEmail()
    .withMessage('Please include a valid email'),
  body('address')
    .isLength({ max: 400 })
    .withMessage('Address cannot exceed 400 characters'),
  body('password')
    .isLength({ min: 7 })
    .withMessage('Password must be at least 7 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage('Password must contain at least one special character')
    // No max length check here since hash will be longer
];