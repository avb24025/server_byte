const Blog = require('../models/blog');
const path = require('path');

// Create a new blog post
const createBlog = async (req, res) => {
  const { title, content, tags } = req.body;
  const createdBy = req.user.username; // Use the username from the authenticated user

  if (!title || !content || !tags || !createdBy) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  let imageUrl = '';
  if (req.file) {
    imageUrl = path.join('uploads', req.file.filename);
  }

  try {
    const newBlog = new Blog({ title, content, tags, createdBy, imageUrl });
    await newBlog.save();
    res.status(201).json({ message: 'Blog post created successfully', blog: newBlog });
  } catch (error) {
    console.error('Error creating blog post:', error);
    res.status(500).json({ message: 'Error creating blog post', error });
  }
};

// Get all blog posts
const getAllBlogs = async (req, res) => {
  try {
    console.log('Fetching all blogs'); // Add logging
    const blogs = await Blog.find();
    res.status(200).json(blogs);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({ message: 'Error fetching blog posts', error });
  }
};

// Get a single blog post by ID
const getBlogById = async (req, res) => {
  const { id } = req.params;

  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    res.status(200).json(blog);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    res.status(500).json({ message: 'Error fetching blog post', error });
  }
};

// Update a blog post by ID
const updateBlog = async (req, res) => {
  const { id } = req.params;
  const { title, content, tags } = req.body;

  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    // Check if the logged-in user is the blog creator
    if (blog.createdBy !== req.user.username) {
      return res.status(403).json({ message: 'You are not authorized to update this blog post.' });
    }

    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.tags = tags || blog.tags;

    const updatedBlog = await blog.save();
    res.status(200).json({ message: 'Blog post updated successfully', blog: updatedBlog });
  } catch (error) {
    console.error('Error updating blog post:', error);
    res.status(500).json({ message: 'Error updating blog post', error });
  }
};


// Delete a blog post by ID
const deleteBlog = async (req, res) => {
  const { id } = req.params;

  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    // Check if the logged-in user is the blog creator
    if (blog.createdBy !== req.user.username) {
      return res.status(403).json({ message: 'You are not authorized to delete this blog post.' });
    }

    // Use deleteOne to remove the blog post
    await Blog.deleteOne({ _id: id });

    res.status(200).json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    res.status(500).json({ message: 'Error deleting blog post', error: error.message });
  }
};



module.exports = {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
};