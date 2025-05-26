const User = require('../models/User');
const Store = require('../models/Store');
const Rating = require('../models/Rating');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = async (req, res, next) => {
  try {
    // Extract filters from query parameters instead of body
    const { name, email, address, role, sort: sortParam } = req.query;

    const query = {
      ...(name && { name: { $regex: name, $options: 'i' } }),
      ...(email && { email: { $regex: email, $options: 'i' } }),
      ...(address && { address: { $regex: address, $options: 'i' } }),
      ...(role && { role }),
    };

    let sort = {};
    if (sortParam) {
      const [field, order] = sortParam.split(':');
      sort[field] = order === 'desc' ? -1 : 1;
    } else {
      sort = { createdAt: -1 };
    }

    const users = await User.find(query).sort(sort);

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (err) {
    next(err);
  }
};


// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    let responseData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      address: user.address,
      role: user.role,
    };

    // If user is a store owner, get their store rating
    if (user.role === 'store_owner') {
      const store = await Store.findOne({ owner: user._id });
      if (store) {
        responseData.store = {
          name: store.name,
          email: store.email,
          address: store.address,
          rating: store.averageRating,
        };
      }
    }

    res.status(200).json({
      success: true,
      data: responseData,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create user (admin only)
// @route   POST /api/users
// @access  Private/Admin
exports.createUser = async (req, res, next) => {
  try {
    const { name, email, address, password, role } = req.body;

    // Create user
    const user = await User.create({
      name,
      email,
      address,
      password,
      role: role || 'user',
    });

    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get dashboard stats
// @route   GET /api/users/dashboard
// @access  Private/Admin
exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStores = await Store.countDocuments();
    const totalRatings = await Rating.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalStores,
        totalRatings,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getStoreOwners = async (req, res, next) => {
  try {
    const owners = await User.find({ role: 'store_owner' }).select('_id name email');
    res.status(200).json({
      success: true,
      count: owners.length,
      data: owners
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};