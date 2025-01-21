const express = require('express');
const { signupUser, loginUser, logoutUser } = require('../controllers/user');

const router = express.Router();
const { getUserByUsername } = require('../controllers/user');

// Route to get user details by username
router.get('/:username', getUserByUsername);

// Signup route
router.post('/signup', signupUser);

// Login route
router.post('/login', loginUser);

// Logout route
router.post('/logout', logoutUser);



module.exports = router;