const mongoose = require('mongoose');

// Define the schema for the Profile model
const profileSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function (v) {
        // Simple email validation regex
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email!`,
    },
  },
  uploadedBlogs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog', // Reference to the Blog model
  }],
  savedBlogs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog', // Reference to the Blog model
  }],
}, { timestamps: true }); // Automatically includes createdAt and updatedAt fields

// Create and export the Profile model
const Profile = mongoose.model('Profile', profileSchema);
module.exports = Profile;
