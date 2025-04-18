const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

// @desc    Authenticate user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  // Find user by email or name (assuming username is email or name)
  const user = await User.findOne({
    $or: [{ email: username.toLowerCase() }, { name: username }]
  });

  if (user && (await user.matchPassword(password))) {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token,
    });
  } else {
    res.status(401);
    throw new Error('Invalid username or password');
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');

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
  const user = await User.findById(req.user.id);

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
      fitnessGoals: updatedUser.fitnessGoals,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user preferences
// @route   PUT /api/users/preferences
// @access  Private
const updateUserPreferences = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user) {
    // Assuming preferences fields are workoutType, intensity, duration, daysPerWeek, goals
    user.workoutType = req.body.workoutType || user.workoutType;
    user.intensity = req.body.intensity || user.intensity;
    user.duration = req.body.duration || user.duration;
    user.daysPerWeek = req.body.daysPerWeek || user.daysPerWeek;
    user.goals = req.body.goals || user.goals;

    const updatedUser = await user.save();

    res.json({
      workoutType: updatedUser.workoutType,
      intensity: updatedUser.intensity,
      duration: updatedUser.duration,
      daysPerWeek: updatedUser.daysPerWeek,
      goals: updatedUser.goals,
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
    caloriesBurned: 0,
  };

  res.json(stats);
});

module.exports = {
  loginUser,
  getUserProfile,
  updateUserProfile,
  updateUserPreferences,
  getUserStats,
};
