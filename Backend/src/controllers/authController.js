
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const comparePassword = require('../utils/comparePassword');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, username, email, password } = req.body;

  if (!name || !username || !email || !password) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'User with that email already exists' });
  }

  const usernameExists = await User.findOne({ username });
  if (usernameExists) {
    return res.status(400).json({ message: 'User with that username already exists' });
  }

  const user = await User.create({
    name,
    username,
    email,
    password,
  });

  if (user) {
    const token = generateToken(user._id);
    res.cookie('access_token', token, {
      httpOnly: true,
      sameSite: 'none', // Use 'none' for cross-site cookies
      secure: true, // 'secure' must be true when sameSite is 'none'
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await comparePassword(password, user.password))) {
    const token = generateToken(user._id);
    res.cookie('access_token', token, {
      httpOnly: true,
      sameSite: 'none', // Use 'none' for cross-site cookies
      secure: true, // 'secure' must be true when sameSite is 'none'
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
    res.json({
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
};

module.exports = { registerUser, loginUser };
