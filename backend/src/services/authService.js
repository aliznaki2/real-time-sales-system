const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

exports.registerUser = async (userData) => {
  const { name, email, password, role } = userData;

 
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists');
  }

 
  const user = await User.create({
    name,
    email,
    password,
    role: role || 'user'
  });

  const token = generateToken(user._id);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    token
  };
};

exports.loginUser = async (email, password) => {
  
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new Error('Invalid credentials');
  }

  
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  const token = generateToken(user._id);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    token
  };
};