const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getUserProfile,
  updateUserProfile,
  getUserStats,
  loginUser,
  updateUserPreferences
} = require('../controllers/userController');

router.post('/login', loginUser);

router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.put('/preferences', protect, updateUserPreferences);

router.get('/stats', protect, getUserStats);

module.exports = router;
