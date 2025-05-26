const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs'); 
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    minlength: [1, 'Name must be at least 1 characters'],
    maxlength: [20, 'Name cannot exceed 20 characters'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  address: {
    type: String,
    required: [true, 'Please provide your address'],
    maxlength: [400, 'Address cannot exceed 400 characters']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [7, 'Password must be at least 8 characters'],
    // REMOVE THE MAXLENGTH VALIDATION FOR PASSWORD
    select: false
  },
  role: {
    type: String,
    enum: ['admin', 'user', 'store_owner'],
    default: 'user'
  }
}, {
  timestamps: true
});

// Password hashing middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('User', userSchema);