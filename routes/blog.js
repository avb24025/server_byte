const express = require('express');
const router = express.Router();
const Blog = require('../models/blog');
const Comment = require('../models/comment');
const upload = require('../middleware/upload');
const auth = require('../middleware/auth'); // Import the authentication middleware
const { createBlog, getAllBlogs, getBlogById, updateBlog, deleteBlog } = require('../controllers/blog');
const mongoose = require('mongoose');


// Route to create a new blog post with image upload
router.post('/', auth, upload.single('image'), createBlog);

// Route to get all blog posts
router.get('/', getAllBlogs);

// Route to get blogs by username (createdBy)
router.get('/by-user/:username', async (req, res) => {
    try {
      const { username } = req.params; // Extract username from params
      const blogs = await Blog.find({ createdBy: username }).sort({ createdAt: -1 }); // Sort by creation date, newest first
      if (!blogs.length) {
        return res.status(404).json({ message: `No blogs found for user: ${username}` });
      }
      res.status(200).json(blogs);
    } catch (error) {
      console.error('Error fetching blogs by username:', error.message);
      res.status(500).json({ message: 'Server error occurred while fetching blogs' });
    }
  });


  router.post('/:id/comments', auth, async (req, res) => {
    const { content } = req.body;
    const { id } = req.params;
  
    if (!content) {
      console.error('Missing content in request body');
      return res.status(400).json({ error: 'Comment content is required.' });
    }
  
    try {
      console.log('Validating blog ID:', id);
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid blog ID.' });
      }
  
      console.log('Checking if blog exists...');
      const blog = await Blog.findById(id);
      if (!blog) {
        console.error('Blog not found for ID:', id);
        return res.status(404).json({ error: 'Blog not found.' });
      }
  
      console.log('Creating new comment...');
      const comment = new Comment({
        content,
        blogId: id,
        username: req.user.username,
      });
  
      console.log('Saving comment:', comment);
      await comment.save();
  
      console.log('Comment saved successfully:', comment);
      res.status(201).json(comment);
    } catch (error) {
      console.error('Error occurred:', error.message, error.stack);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  
  router.get('/:id/comments', async (req, res) => {
    try {
      const blogId = req.params.id;
      // Find all comments for the specific blogId and sort them by createdAt (newest first)
      const comments = await Comment.find({ blogId }).sort({ createdAt: -1 });
      res.json(comments);  // Send back the comments
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching comments' });
    }
  });
  
  
  router.get('/me', auth, (req, res) => {
    try {
      if (!req.user || !req.user.username) {
        return res.status(404).json({ error: 'User information not found' });
      }
  
      res.status(200).json({ username: req.user.username });
    } catch (error) {
      console.error('Error fetching user info:', error.message);
      res.status(500).json({ error: 'Server error occurred while fetching user info' });
    }
  });
  

// Route to get a single blog post by ID
router.get('/:id', getBlogById);

// Route to update a blog post by ID
router.put('/:id', auth, updateBlog);

// Route to delete a blog post by ID
router.delete('/:id', auth, deleteBlog);

module.exports = router;