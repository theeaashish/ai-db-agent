import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Dummy user (replace with DB user later)
const user = {
  id: "123",
  email: "test@example.com",
  password: bcrypt.hashSync("password123", 10),
};

// LOGIN ROUTE
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Validate user
  if (email !== user.email) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Create JWT
  const token = jwt.sign(
    { userId: user.id, email: user.email }, // payload
    process.env.JWT_SECRET,                 // secret
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  return res.json({
    message: "Login successful",
    token,
  });
});

// PROTECTED ROUTE
router.get("/profile", authMiddleware, (req, res) => {
  return res.json({
    message: "Protected data",
    user: req.user, // decoded JWT payload
  });
});

export default router;
