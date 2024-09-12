const User = require('../models/users');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.register = async (req, res) => {
  const { username, password, email } = req.body;
  
  try {
    const user = new User({ username, password, email });
    await user.save();
    res.status(201).json({ msg: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ msg: 'Error registering user', error });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ msg: 'User not found' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(400).json({ msg: 'Error logging in', error });
  }
};
