const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const likeController = require("../controllers/likeController");

router.get("/search", postController.searchPosts);
router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  postController.createPost
);
router.get("/", postController.getAllPosts);
router.get("/:id", postController.getPost);
router.put(
  "/:id",
  authMiddleware,
  upload.single("image"),
  postController.updatePost
);
router.delete("/:id", authMiddleware, postController.deletePost);

module.exports = router;
