const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide store name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide store email'],
    unique: true,
    lowercase: true,
  },
  
  address: {
    type: String,
    required: [true, 'Please provide store address'],
    maxlength: [400, 'Address cannot exceed 400 characters'],
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Store must have an owner'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
storeSchema.virtual('ratings', {
  ref: 'Rating',
  localField: '_id',
  foreignField: 'store',
});

storeSchema.virtual('averageRating').get(function() {
  if (this.ratings && this.ratings.length > 0) {
    const sum = this.ratings.reduce((acc, rating) => acc + rating.value, 0);
    return (sum / this.ratings.length).toFixed(1);
  }
  return 0;
});

storeSchema.set('toJSON', { virtuals: true });
storeSchema.set('toObject', { virtuals: true });

const Store = mongoose.model('Store', storeSchema);
module.exports = Store;