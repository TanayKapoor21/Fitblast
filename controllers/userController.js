const User = require('../models/User');
const asyncHandler = require('express-async-handler');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.age = req.body.age || user.age;
    user.gender = req.body.gender || user.gender;
    user.fitnessGoals = req.body.fitnessGoals || user.fitnessGoals;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      age: updatedUser.age,
      gender: updatedUser.gender,
      fitnessGoals: updatedUser.fitnessGoals
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get user workout stats
// @route   GET /api/users/stats
// @access  Private
const getUserStats = asyncHandler(async (req, res) => {
  // This would be enhanced with actual workout stats
  const stats = {
    totalWorkouts: 0,
    totalDuration: 0,
    favoriteWorkout: 'None',
    caloriesBurned: 0
  };

  res.json(stats);
});

module.exports = {
  getUserProfile,
  updateUserProfile,
  getUserStats
};
