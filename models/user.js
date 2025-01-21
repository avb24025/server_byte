const mongoose = require('mongoose');

// Check if the model is already compiled
const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    }
}));

module.exports = User;
