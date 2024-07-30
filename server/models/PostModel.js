const db = require("../config/db");

module.exports = {
  create: (title, content, userId, imageUrl) => {
    return db.query(
      "INSERT INTO posts (title, content, user_id, image_url) VALUES ($1, $2, $3, $4) RETURNING *",
      [title, content, userId, imageUrl]
    );
  },
  getAll: () => {
    return db.query(
      "SELECT posts.*, users.email as author FROM posts JOIN users ON posts.user_id = users.id ORDER BY created_at DESC"
    );
  },
  getById: (id) => {
    return db.query(
      "SELECT posts.*, users.email as author FROM posts JOIN users ON posts.user_id = users.id WHERE posts.id = $1",
      [id]
    );
  },
  update: (id, title, content, imageUrl) => {
    console.log("Updating post in database:", { id, title, content, imageUrl });
    return db.query(
      "UPDATE posts SET title = COALESCE($1, title), content = COALESCE($2, content), image_url = COALESCE($3, image_url) WHERE id = $4 RETURNING *",
      [title, content, imageUrl, id]
    );
  },
  delete: (id) => {
    return db.query("DELETE FROM posts WHERE id = $1", [id]);
  },

  search: (query) => {
    console.log("Executing database search query:", query); // Add this log
    return db.query(
      `SELECT posts.*, users.email as author 
     FROM posts 
     JOIN users ON posts.user_id = users.id 
     WHERE posts.title ILIKE $1 OR posts.content ILIKE $1
     ORDER BY posts.created_at DESC`,
      [`%${query}%`]
    );
  },
};
