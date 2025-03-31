const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Assuming you have a User model

// Verify token middleware
exports.verifyToken = async (req, res, next) => {
  // const token = req.header('Authorization')?.replace('Bearer ', '');

  const {auth_token} = req.cookies;

  try {
    let {_id} = jwt.verify(auth_token, "zdfsefoigwed73tr9qheqp'JR[04RYaZo Z[yzP 0u -UPXA9YA]]");

        let isUserExist = await User.findById(_id);

  if (!isUserExist) {
    return res.status(401).json({ message: 'Access denied, no token provided' });
  };

  req.user = isUserExist;

    next();
  } catch (error) {
    return res.status(400).json({ message: 'Invalid or expired token' });
  }
};

// Check if user is an Admin
exports.checkAdmin = async (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden, Admins only' });
  }
  next();
};
