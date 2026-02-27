import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface User {
  id: string;
  email: string;
  passwordHash: string;
}

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "24h" });
}

export function verifyToken(token: string): { userId: string } {
  return jwt.verify(token, JWT_SECRET) as { userId: string };
}

export async function loginUser(
  email: string,
  password: string,
  findUser: (email: string) => Promise<User | null>
): Promise<{ token: string; user: User } | null> {
  const user = await findUser(email);
  if (!user) return null;

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) return null;

  const token = generateToken(user.id);
  return { token, user };
}
