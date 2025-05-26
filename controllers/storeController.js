const Store = require('../models/Store');
const User = require('../models/User');
const Rating = require('../models/Rating');

// @desc    Get all stores
// @route   GET /api/stores
// @access  Public
// @desc    Get all stores with average ratings
// @route   GET /api/stores
// @access  Public
exports.getStores = async (req, res, next) => {
  try {
    // Filtering
    let query = {};
    const { name, address } = req.query;

    if (name) query.name = { $regex: name, $options: 'i' };
    if (address) query.address = { $regex: address, $options: 'i' };

    // Sorting
    let sort = {};
    if (req.query.sort) {
      const sortBy = req.query.sort.split(':');
      sort[sortBy[0]] = sortBy[1] === 'desc' ? -1 : 1;
    } else {
      sort = { createdAt: -1 };
    }

    const stores = await Store.find(query)
      .sort(sort)
      .populate({
        path: 'owner',
        select: 'name email',
      })
      .populate({
        path: 'ratings',
        select: 'value',
      });

    res.status(200).json({
      success: true,
      count: stores.length,
      data: stores,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single store with average rating
// @route   GET /api/stores/:id
// @access  Public
exports.getStore = async (req, res, next) => {
  try {
    const store = await Store.findById(req.params.id)
      .populate({
        path: 'owner',
        select: 'name email',
      })
      .populate({
        path: 'ratings',
        select: 'value',
      });

    if (!store) {
      return res.status(404).json({ success: false, message: 'Store not found' });
    }

    res.status(200).json({
      success: true,
      data: store,
    });
  } catch (err) {
    next(err);
  }
};
// @desc    Create store
// @route   POST /api/stores
// @access  Private/Admin
exports.createStore = async (req, res, next) => {
  try {
    const { name, email, address, owner } = req.body;

    // Check if owner exists and is a store owner
    const ownerUser = await User.findById(owner);
    if (!ownerUser || ownerUser.role !== 'store_owner') {
      return res.status(400).json({ 
        success: false, 
        message: 'Owner must be an existing user with store_owner role' 
      });
    }

    const store = await Store.create({
      name,
      email,
      address,
      owner,
    });

    res.status(201).json({
      success: true,
      data: store,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get store ratings
// @route   GET /api/stores/:id/ratings
// @access  Private/StoreOwner
exports.getStoreRatings = async (req, res, next) => {
  try {
    // Check if user is the owner of the store
    const store = await Store.findOne({ 
      _id: req.params.id, 
      owner: req.user.id 
    });

    if (!store) {
      return res.status(404).json({ 
        success: false, 
        message: 'Store not found or you are not the owner' 
      });
    }

    const ratings = await Rating.find({ store: req.params.id })
      .populate({
        path: 'user',
        select: 'name email',
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        averageRating: store.averageRating,
        ratings,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Submit rating for store
// @route   POST /api/stores/:id/ratings
// @access  Private/User
exports.submitRating = async (req, res, next) => {
  try {
    const { value } = req.body;

    // Check if store exists
    const store = await Store.findById(req.params.id);
    if (!store) {
      return res.status(404).json({ success: false, message: 'Store not found' });
    }

    // Check if user already rated this store
    const existingRating = await Rating.findOne({
      store: req.params.id,
      user: req.user.id,
    });

    let rating;
    if (existingRating) {
      // Update existing rating
      existingRating.value = value;
      rating = await existingRating.save();
    } else {
      // Create new rating
      rating = await Rating.create({
        value,
        store: req.params.id,
        user: req.user.id,
      });
    }

    res.status(200).json({
      success: true,
      data: rating,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user's rating for a store
// @route   GET /api/stores/:id/my-rating
// @access  Private/User
exports.getMyRating = async (req, res, next) => {
  try {
    const rating = await Rating.findOne({
      store: req.params.id,
      user: req.user.id,
    });

    res.status(200).json({
      success: true,
      data: rating || null,
    });
  } catch (err) {
    next(err);
  }
};

exports.getOwnerStoreWithRatings = async (req, res) => {
  try {
    // 1. Find the store owned by this user
    const store = await Store.findOne({ owner: req.user._id });
    if (!store) {
      return res.status(404).json({ 
        success: false,
        error: 'No store found for this owner' 
      });
    }

    // 2. Get ratings using your schema's pre-find hook
    const ratings = await Rating.find({ store: store._id });

    // 3. Calculate average rating
    const averageRating = ratings.length > 0 
      ? ratings.reduce((sum, rating) => sum + rating.value, 0) / ratings.length
      : 0;

    res.json({
      success: true,
      data: {
        store: {
          ...store.toObject(),
          averageRating
        },
        ratings,
        averageRating,
        totalRatings: ratings.length
      }
    });

  } catch (err) {
    console.error('Error in getOwnerStoreWithRatings:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
};

exports.getUserRatings = async (req, res, next) => {
  try {
    // Find all ratings where the user field matches the logged-in user's ID
    const ratings = await Rating.find({ user: req.user.id })
      .populate({
        path: 'store',
        select: 'name address' // Include whatever store fields you want to return
      })
      .sort({ createdAt: -1 }); // Sort by newest first

    res.status(200).json({
      success: true,
      count: ratings.length,
      data: ratings
    });
  } catch (err) {
    next(err);
  }
};