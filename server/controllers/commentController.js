const Comment = require("../models/CommentModel");
const User = require("../models/UserModel");

exports.getCommentsByPost = async (req, res) => {
  try {
    const comments = await Comment.getByPostId(req.params.postId);
    console.log("Raw comments data:", comments);

    if (!comments || !comments.rows) {
      throw new Error("Invalid comment data structure");
    }

    const commentsWithAuthor = await Promise.all(
      comments.rows.map(async (comment) => {
        try {
          const user = await User.findById(comment.user_id);
          return {
            ...comment,
            author: user ? user.email : "Unknown",
          };
        } catch (userError) {
          console.error("Error fetching user for comment:", userError);
          return {
            ...comment,
            author: "Unknown",
          };
        }
      })
    );

    console.log("Processed comments with authors:", commentsWithAuthor);
    res.json(commentsWithAuthor);
  } catch (error) {
    console.error("Error in getCommentsByPost:", error);
    res
      .status(500)
      .json({ error: "Error fetching comments", details: error.message });
  }
};

exports.createComment = async (req, res) => {
  try {
    const { content, postId } = req.body;
    const userId = req.user.userId; // Get the user ID from the JWT token
    console.log("Creating comment with:", { content, postId, userId }); // Log the comment data
    const result = await Comment.create(content, postId, userId);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating comment:", error);
    res
      .status(500)
      .json({ error: "Error creating comment", details: error.message });
  }
};

exports.updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.userId; // Get the user ID from the JWT token

    console.log(`Attempting to update comment ${id} with content: ${content}`);

    // First, check if the comment belongs to the user
    const comment = await Comment.getById(id);
    if (!comment || comment.rows.length === 0) {
      return res.status(404).json({ error: "Comment not found" });
    }

    if (comment.rows[0].user_id !== userId) {
      return res
        .status(403)
        .json({ error: "You do not have permission to edit this comment" });
    }

    const result = await Comment.update(id, content);
    console.log("Update result:", result);
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({
      error: "An error occurred while updating the comment",
      details: error.message,
    });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    console.log(`Attempting to delete comment ${id} by user ${userId}`);

    // First, check if the comment exists
    const comment = await Comment.getById(id);
    if (!comment || comment.rows.length === 0) {
      console.log(`Comment ${id} not found`);
      return res.status(404).json({ error: "Comment not found" });
    }

    console.log(`Comment found:`, comment.rows[0]);

    // Check if the comment belongs to the user
    if (comment.rows[0].user_id !== userId) {
      console.log(
        `User ${userId} does not have permission to delete comment ${id}`
      );
      return res
        .status(403)
        .json({ error: "You do not have permission to delete this comment" });
    }

    await Comment.delete(id);
    console.log(`Comment ${id} deleted successfully`);
    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the comment" });
  }
};
