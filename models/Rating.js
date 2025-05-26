const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  value: {
    type: Number,
    required: [true, 'Please provide a rating value'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5'],
  },
  store: {
    type: mongoose.Schema.ObjectId,
    ref: 'Store',
    required: [true, 'Rating must belong to a store'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Rating must belong to a user'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

ratingSchema.index({ store: 1, user: 1 }, { unique: true });

ratingSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name email',
  });
  next();
});

const Rating = mongoose.model('Rating', ratingSchema);
module.exports = Rating;