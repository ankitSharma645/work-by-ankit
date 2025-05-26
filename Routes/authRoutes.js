const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/protect.js');
const { 
  register, 
  login, 
  getMe, 
  updatePassword, 
  logout 
} = require('../controllers/authController');
const { validateRegister } = require('../middlewares/validators.js');

router.post('/register', validateRegister, register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/updatepassword', protect, updatePassword);
router.get('/logout', protect, logout);

module.exports = router;