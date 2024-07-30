// likeController.js
const db = require("../config/db");

exports.toggleLike = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.userId;

  try {
    // Check if the user has already liked the post
    const existingLike = await db.query(
      "SELECT * FROM likes WHERE post_id = $1 AND user_id = $2",
      [postId, userId]
    );

    if (existingLike.rows.length > 0) {
      // If like exists, remove it
      await db.query("DELETE FROM likes WHERE post_id = $1 AND user_id = $2", [
        postId,
        userId,
      ]);
      res.json({ liked: false });
    } else {
      // If like doesn't exist, add it
      await db.query("INSERT INTO likes (post_id, user_id) VALUES ($1, $2)", [
        postId,
        userId,
      ]);
      res.json({ liked: true });
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getLikeCount = async (req, res) => {
  const { postId } = req.params;

  try {
    const result = await db.query(
      "SELECT COUNT(*) FROM likes WHERE post_id = $1",
      [postId]
    );
    const count = parseInt(result.rows[0].count);
    res.json({ count });
  } catch (error) {
    console.error("Error getting like count:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
