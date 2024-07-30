// server/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const passwordResetController = require("../controllers/passwordResetController");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.post(
  "/request-password-reset",
  passwordResetController.requestPasswordReset
);
router.post("/reset-password", passwordResetController.resetPassword);

module.exports = router;
