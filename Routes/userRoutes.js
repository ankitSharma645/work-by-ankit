/*const express = require('express');
const { 
  getUsers, 
  getUser, 
  createUser, 
  getDashboardStats, 
  getStoreOwners
} = require('../controllers/userController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/', getUsers);
router.get('/:id', getUser);
router.post('/', createUser);
router.get('/dashboard/stats', getDashboardStats);
// Simple route to get all store owners
router.get('/store-owners', protect, authorize('admin'), async (req, res) => {
  try {
    const owners = await User.find({ role: 'store_owner' }).select('_id name email');
    res.json({ owners });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});
// Add this route
// Get all store owners (admin only)

module.exports = router;*/

const express = require('express');
const {
  getUsers,
  getUser,
  createUser,
  getDashboardStats,
  getStoreOwners,
} = require('../controllers/userController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard/stats', getDashboardStats);

// ✅ Move this above /:id to prevent route conflict
router.get('/store-owners', getStoreOwners);

router.get('/', getUsers);
router.post('/', createUser);
router.get('/:id', getUser);
module.exports = router;
