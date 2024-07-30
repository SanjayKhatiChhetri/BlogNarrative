// authMiddleware.js
const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("Decoded token:", decoded); // Add this log
    next();
  } catch (error) {
    res.status(401).json({ error: "Token is not valid" });
  }
}

module.exports = authenticateToken;
