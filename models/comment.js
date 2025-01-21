const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    blogId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Blog',
    },
    content: {  // Ensure this matches the request body field name
      type: String,
      required: true,
      trim: true,
    },
  });

module.exports = mongoose.model('Comment', commentSchema);


