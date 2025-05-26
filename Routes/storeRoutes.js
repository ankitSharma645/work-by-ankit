const express = require('express');
const { 
  getStores, 
  getStore, 
  createStore,
  getStoreRatings,
  submitRating,
  getMyRating,
  getOwnerStoreWithRatings,
  getUserRatings
} = require('../controllers/storeController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// -------------------
// Public Routes
// -------------------
router.get('/', getStores);

// -------------------
// Protected Routes
// -------------------
router.use(protect);

// -------------------
// Specific Routes (MUST come before dynamic /:id)
// -------------------

// User routes
router.get('/user/ratings', authorize('user'), getUserRatings);

// Store owner routes
router.get('/owner/with-ratings', authorize('store_owner'), getOwnerStoreWithRatings);

// Admin routes
router.post('/', authorize('admin'), createStore);

// -------------------
// Dynamic Routes (after all specific ones)
// -------------------

// Public dynamic route
router.get('/:id', getStore);

// User dynamic routes
router.post('/:id/ratings', authorize('user'), submitRating);
router.get('/:id/my-rating', authorize('user'), getMyRating);

// Store owner dynamic route
router.get('/:id/ratings', authorize('store_owner'), getStoreRatings);

module.exports = router;
