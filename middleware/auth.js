// auth.js (middleware)
const jwt = require('jsonwebtoken');
require('dotenv').config();  // Ensure the .env file is loaded correctly

const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Authorization token missing' });
  }

  try {
    // Ensure JWT_SECRET is correctly loaded from .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded user info to the request object
console.log("decoded user name loggedin",decoded);  // Log the decoded payload to verify it

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = auth;
