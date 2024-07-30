require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./config/db");
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files using index.html
app.use(express.static(path.join(__dirname, "../public")));

//auth
const authRoutes = require("./routes/authRoutes");
const errorHandler = require("./middleware/errorHandler");
const authenticateToken = require("./middleware/authMiddleware");

// post
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const postRoutes = require("./routes/postRoutes");

// Route for the root path >-->curl http://localhost:3000/
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Route for testing database connection >-->curl http://localhost:3000/test-db
app.get("/test-db", async (req, res) => {
  try {
    const result = await db.query("SELECT NOW()");
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Database connection error:", err);
    console.error("Error stack:", err.stack);
    res.status(500).json({
      error: "Database connection error",
      details: err.message,
      stack: err.stack,
    });
  }
});

// Auth routes for user registration and login
// register user >--> curl -X POST -H "Content-Type: application/json" -d '{"email":"user@example.com","password":"password123"}' http://localhost:3000/api/auth/register
// login user >--> curl -X POST -H "Content-Type: application/json" -d '{"email":"user@example.com","password":"password123"}' http://localhost:3000/api/auth/login
app.use("/api/auth", authRoutes);

// Protected route that requires authentication
// >--> curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTcyMTY4MTcwMCwiZXhwIjoxNzIxNjg1MzAwfQ.tPK5BU5hSHTlhLrGwpGos7Ko1lQ7MYJsIvfhsUz5uPY" http://localhost:3000/api/protected-route
app.get("/api/protected-route", authenticateToken, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});

try {
  const postRoutes = require("./routes/postRoutes");
  app.use("/api/posts", postRoutes);
} catch (error) {
  console.log("Post routes not implemented yet");
}

try {
  const commentRoutes = require("./routes/commentRoutes");
  app.use("/api/comments", commentRoutes);
} catch (error) {
  console.log("Comment routes not implemented yet");
}

try {
  const likeRoutes = require("./routes/likeRoutes");
  app.use("/api/posts", likeRoutes);
} catch (error) {
  console.log("Like routes not implemented yet");
}

app.get("/reset-password", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});

// Error handling middleware
app.use(errorHandler);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
