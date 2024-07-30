// server/controllers/userController.js
const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const { hashPassword, comparePassword } = require("../utils/passwordUtils");
const bcrypt = require("bcrypt");
require("dotenv").config();

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await hashPassword(password);
    const result = await User.create(email, hashedPassword);
    res.status(201).json({
      message: "User registered successfully",
      userId: result.rows[0].id,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res
      .status(500)
      .json({ error: "Error registering user", details: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`Attempting login for email: ${email}`);

    const result = await User.findByEmail(email);
    console.log(`User lookup result:`, result.rows);

    if (result.rows.length > 0) {
      const user = result.rows[0];
      const isPasswordValid = await comparePassword(password, user.password);
      console.log(`Password validation result: ${isPasswordValid}`);

      if (isPasswordValid) {
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });
        res.json({ message: "Login successful", token });
      } else {
        res.status(400).json({ error: "Invalid credentials" });
      }
    } else {
      res.status(400).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Error logging in", details: error.message });
  }
};
