import jwt from "jsonwebtoken";
import { env } from "./env";

// Generate JWT token for user.

export function generateToken(userId: string) {
  return jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: "7d" });
}

// Verify JWT token.

export function verifyToken(token: string) {
  return jwt.verify(token, env.JWT_SECRET) as { userId: string };
}
