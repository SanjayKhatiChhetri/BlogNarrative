const db = require("../config/db");

module.exports = {
  getByPostId: (postId) => {
    return db.query(
      "SELECT * FROM comments WHERE post_id = $1 ORDER BY created_at DESC",
      [postId]
    );
  },

  create: (content, postId, userId) => {
    return db.query(
      "INSERT INTO comments (content, post_id, user_id) VALUES ($1, $2, $3) RETURNING *",
      [content, postId, userId]
    );
  },
  update: (id, content) => {
    return db.query(
      "UPDATE comments SET content = $1 WHERE id = $2 RETURNING *",
      [content, id]
    );
  },
  delete: (id) => {
    console.log(`Deleting comment with id: ${id}`);
    return db.query("DELETE FROM comments WHERE id = $1", [id]);
  },
  getById: (id) => {
    return db.query("SELECT * FROM comments WHERE id = $1", [id]);
  },
};
