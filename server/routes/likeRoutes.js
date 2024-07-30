// likeRoutes.js
const express = require("express");
const router = express.Router();
const likeController = require("../controllers/likeController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/:postId/like", authMiddleware, likeController.toggleLike);
router.get("/:postId/likes", likeController.getLikeCount);

module.exports = router;
