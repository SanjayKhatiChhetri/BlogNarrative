const db = require("../config/db");
const crypto = require("crypto");

module.exports = {
  create: (email, password) => {
    return db.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email",
      [email, password]
    );
  },
  findByEmail: (email) => {
    return db.query("SELECT * FROM users WHERE email = $1", [email]);
  },
  findById: (id) => {
    return db
      .query("SELECT * FROM users WHERE id = $1", [id])
      .then((result) => result.rows[0]);
  },
  setResetToken: async (email) => {
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpires = Date.now() + 3600000; // 1 hour from now
    const result = await db.query(
      "UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE email = $3 RETURNING id",
      [resetToken, resetTokenExpires, email]
    );
    return result.rows[0] ? resetToken : null;
  },

  findByResetToken: async (token) => {
    const result = await db.query(
      "SELECT * FROM users WHERE reset_token = $1 AND reset_token_expires > $2",
      [token, Date.now()]
    );
    return result.rows[0];
  },

  resetPassword: async (userId, newPassword) => {
    if (!userId) {
      throw new Error("User ID is required to reset password");
    }
    const result = await db.query(
      "UPDATE users SET password = $1, reset_token = NULL, reset_token_expires = NULL WHERE id = $2 RETURNING *",
      [newPassword, userId]
    );
    return result.rows[0];
  },
};
