const Post = require("../models/PostModel");
const fs = require("fs");
const path = require("path");

exports.createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.user.userId;
    const imageUrl = req.file ? `/images/${req.file.filename}` : null;
    const result = await Post.create(title, content, userId, imageUrl);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating post:", error);
    res
      .status(500)
      .json({ error: "Error creating post", details: error.message });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const result = await Post.getAll();
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Error fetching posts" });
  }
};

exports.getPost = async (req, res) => {
  try {
    const result = await Post.getById(req.params.id);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: "Post not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error fetching post" });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    console.log("Updating post. Received data:", req.body);
    console.log("Request file:", req.file);

    // Check if the post exists and belongs to the user
    const post = await Post.getById(id);
    if (!post.rows.length) {
      return res.status(404).json({ error: "Post not found" });
    }
    if (post.rows[0].user_id !== userId) {
      return res
        .status(403)
        .json({ error: "You can only edit your own posts" });
    }

    // Server-side validation
    const title = req.body.title ? req.body.title.trim() : null;
    const content = req.body.content ? req.body.content.trim() : null;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    if (!content) {
      return res.status(400).json({ error: "Content is required" });
    }

    // Check if any changes were made
    if (
      title === post.rows[0].title &&
      content === post.rows[0].content &&
      !req.file
    ) {
      return res.status(400).json({ error: "No changes detected" });
    }

    const imageUrl = req.file
      ? `/images/${req.file.filename}`
      : post.rows[0].image_url;

    const result = await Post.update(id, title, content, imageUrl);
    console.log("Update result:", result.rows[0]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating post:", error);
    res
      .status(500)
      .json({ error: "Error updating post", details: error.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Check if the post exists and belongs to the user
    const post = await Post.getById(id);

    if (post.rows[0].user_id !== userId) {
      return res
        .status(403)
        .json({ error: "You can only edit your own posts" });
    }

    if (post.rows.length === 0) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.rows[0].image_url) {
      const imagePath = path.join(
        __dirname,
        "..",
        "..",
        "public",
        post.rows[0].image_url
      );
      fs.unlink(imagePath, (err) => {
        if (err) console.error("Error deleting image:", err);
      });
    }

    const result = await Post.delete(id);
    console.log("Delete result:", result);
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Error deleting post" });
  }
};

exports.searchPosts = async (req, res) => {
  try {
    const { query } = req.query;
    console.log("Received search query:", query); // Add this log
    if (!query) {
      return res.status(400).json({ error: "Search query is required" });
    }
    const posts = await Post.search(query);
    console.log(`Found ${posts.rows.length} posts matching "${query}"`); // Add this log
    res.json(posts.rows);
  } catch (error) {
    console.error("Error searching posts:", error);
    res
      .status(500)
      .json({ error: "Error searching posts", details: error.message });
  }
};