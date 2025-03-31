const jwt = require('jsonwebtoken');

// Middleware to check if user is logged in (using cookie-based authentication)
exports.verifyCookieToken = (req, res, next) => {
  const token = req.cookies.auth_token; // Retrieve token from cookies

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // Attach the decoded user info to the request object
    next(); // Continue to the next middleware or route handler
  } catch (error) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};
