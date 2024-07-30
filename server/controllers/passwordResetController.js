const User = require("../models/UserModel");
const { sendPasswordResetEmail } = require("../utils/emailService");
const { hashPassword } = require("../utils/passwordUtils");

exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const resetToken = await User.setResetToken(email);
    if (resetToken) {
      await sendPasswordResetEmail(email, resetToken);
      res.json({ message: "Password reset email sent" });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error in requestPasswordReset:", error);
    res.status(500).json({ error: "Error processing your request" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    console.log("Resetting password for token:", token);
    const user = await User.findByResetToken(token);

    if (!user) {
      console.log("No user found for token:", token);
      return res.status(400).json({ error: "Invalid or expired reset token" });
    }

    console.log("User found:", user.id);
    const hashedPassword = await hashPassword(newPassword);
    console.log("Password hashed");
    const updatedUser = await User.resetPassword(user.id, hashedPassword);

    if (!updatedUser) {
      console.log("Failed to update user password");
      return res.status(500).json({ error: "Failed to update password" });
    }

    console.log("Password updated successfully");
    res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    res.status(500).json({ error: "Error resetting password" });
  }
};
