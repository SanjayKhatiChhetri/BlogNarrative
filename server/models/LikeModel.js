const db = require("../config/db");

module.exports = {
  create: (userId, postId) => {
    return db.query(
      "INSERT INTO likes (user_id, post_id) VALUES ($1, $2) ON CONFLICT (user_id, post_id) DO NOTHING RETURNING *",
      [userId, postId]
    );
  },
  delete: (userId, postId) => {
    return db.query("DELETE FROM likes WHERE user_id = $1 AND post_id = $2", [
      userId,
      postId,
    ]);
  },
  getCount: (postId) => {
    return db.query("SELECT COUNT(*) FROM likes WHERE post_id = $1", [postId]);
  },
  getUserLike: (userId, postId) => {
    return db.query("SELECT * FROM likes WHERE user_id = $1 AND post_id = $2", [
      userId,
      postId,
    ]);
  },
};
