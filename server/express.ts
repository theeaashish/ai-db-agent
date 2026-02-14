import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import jwt from "jsonwebtoken";

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";

/* ----------------------------- Types ----------------------------- */

type Role = "admin" | "user";

interface AuthRequest extends Request {
  user?: {
    id: string;
    role: Role;
  };
}

interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: Date;
}

/* ------------------------- In-memory DB -------------------------- */

const users = new Map<string, User>();

/* --------------------------- Middleware -------------------------- */

// Parse JSON bodies.
app.use(express.json());

// Security headers.
app.use(helmet());

// Enable CORS.
app.use(cors());

// HTTP logging.
app.use(morgan("dev"));

// Global request timer.
app.use((req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `[${req.method}] ${req.originalUrl} - ${res.statusCode} - ${duration}ms`
    );
  });

  next();
});

/* -------------------------- Auth Middleware ---------------------- */

// Verify JWT token and attach user to request.
function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Missing authorization header" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      role: Role;
    };

    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

// Restrict route to specific roles.
function authorize(roles: Role[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };
}

/* ---------------------------- Utilities -------------------------- */

// Async handler wrapper to catch errors.
function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
}

/* ----------------------------- Routes ---------------------------- */

// Health check route.
app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date(),
  });
});

// Register user.
app.post(
  "/auth/register",
  asyncHandler(async (req, res) => {
    const { name, email, role } = req.body;

    if (!name || !email || !role) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existing = [...users.values()].find((u) => u.email === email);
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const user: User = {
      id: crypto.randomUUID(),
      name,
      email,
      role,
      createdAt: new Date(),
    };

    users.set(user.id, user);

    res.status(201).json({ user });
  })
);

// Login user.
app.post(
  "/auth/login",
  asyncHandler(async (req, res) => {
    const { email } = req.body;

    const user = [...users.values()].find((u) => u.email === email);

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  })
);

// Get current user.
app.get(
  "/me",
  authenticate,
  asyncHandler(async (req: AuthRequest, res) => {
    const user = users.get(req.user!.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  })
);

// Admin-only route.
app.get(
  "/admin/users",
  authenticate,
  authorize(["admin"]),
  asyncHandler(async (_req, res) => {
    res.json({ users: [...users.values()] });
  })
);

// Delete user (admin only).
app.delete(
  "/admin/users/:id",
  authenticate,
  authorize(["admin"]),
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!users.has(id)) {
      return res.status(404).json({ message: "User not found" });
    }

    users.delete(id);

    res.json({ message: "User deleted" });
  })
);

/* -------------------------- Global Error ------------------------- */

app.use(
  (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    console.error("Unhandled error:", err);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
);

/* ----------------------------- Start ----------------------------- */

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
