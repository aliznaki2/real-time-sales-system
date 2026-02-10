const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


const register = async (req, res) => {
  try {
    console.log('📝 Register request:', req.body);
    
    const { name, email, password, role } = req.body;

    
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }

  
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

  
    const hashedPassword = await bcrypt.hash(password, 10);

   
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'customer'
    });

   
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    console.log('✅ User registered successfully:', user.email);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('❌ Register error:', error.message);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};


const login = async (req, res) => {
  try {
    const { email, password } = req.body;

 
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

   
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

   
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('❌ Login error:', error.message);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

module.exports = { register, login };