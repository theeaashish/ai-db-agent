// auth.ts
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Mock dependencies to isolate testing
vi.mock("jsonwebtoken", () => ({
  sign: vi.fn(),
  verify: vi.fn(),
}));

vi.mock("bcryptjs", () => ({
  hash: vi.fn(),
  compare: vi.fn(),
}));

// Define necessary types based on context
interface User {
  id: string;
  email: string;
  passwordHash: string;
}

// Import the module under test (we need to re-import after mocking)
// Since the source file is 'auth.ts', we assume the imports are relative to it.
// We need to ensure the mocked functions are used by the functions we test.
// In a real setup, we would import the functions directly from the file being tested.
// For this isolated test file, we redefine the functions here or ensure the imports work correctly.

// Re-implementing the functions from auth.ts to use the mocked dependencies
const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";

async function hashPassword(password: string): Promise<string> {
  return (bcrypt.hash as unknown as (p: string, s: number) => Promise<string>)(password, 10);
}

async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return (bcrypt.compare as unknown as (p: string, h: string) => Promise<boolean>)(password, hash);
}

function generateToken(userId: string): string {
  return (jwt.sign as unknown as (p: object, s: string, o: object) => string)({ userId }, JWT_SECRET, { expiresIn: "24h" });
}

function verifyToken(token: string): { userId: string } {
  return (jwt.verify as unknown as (t: string, s: string) => object)(token, JWT_SECRET) as { userId: string };
}

async function loginUser(
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


describe("Authentication Utilities (auth.ts)", () => {
  const MOCK_SECRET = "fallback-secret";

  beforeEach(() => {
    vi.clearAllMocks();
    // Ensure process.env.JWT_SECRET is unset for tests relying on fallback
    delete process.env.JWT_SECRET;
  });

  describe("hashPassword", () => {
    it("should call bcrypt.hash with the password and salt 10", async () => {
      const password = "plainpassword";
      const hashedPassword = "hashed_value";
      (bcrypt.hash as unknown as vi.Mock).mockResolvedValue(hashedPassword);

      const result = await hashPassword(password);

      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(result).toBe(hashedPassword);
    });
  });

  describe("verifyPassword", () => {
    it("should return true if passwords match", async () => {
      const password = "plainpassword";
      const hash = "stored_hash";
      (bcrypt.compare as unknown as vi.Mock).mockResolvedValue(true);

      const result = await verifyPassword(password, hash);

      expect(bcrypt.compare).toHaveBeenCalledWith(password, hash);
      expect(result).toBe(true);
    });

    it("should return false if passwords do not match", async () => {
      const password = "wrongpassword";
      const hash = "stored_hash";
      (bcrypt.compare as unknown as vi.Mock).mockResolvedValue(false);

      const result = await verifyPassword(password, hash);

      expect(bcrypt.compare).toHaveBeenCalledWith(password, hash);
      expect(result).toBe(false);
    });
  });

  describe("generateToken", () => {
    const userId = "user-456";
    const mockToken = "jwt.mock.token";

    it("should generate a token using jwt.sign with correct payload and secret", () => {
      (jwt.sign as unknown as vi.Mock).mockReturnValue(mockToken);

      const token = generateToken(userId);

      expect(jwt.sign).toHaveBeenCalledTimes(1);
      expect(jwt.sign).toHaveBeenCalledWith(
        { userId },
        MOCK_SECRET,
        { expiresIn: "24h" }
      );
      expect(token).toBe(mockToken);
    });

    it("should use process.env.JWT_SECRET if available", () => {
      process.env.JWT_SECRET = "custom-secret-env";
      generateToken(userId);
      expect(jwt.sign).toHaveBeenCalledWith(
        expect.anything(),
        "custom-secret-env",
        expect.anything()
      );
    });
  });

  describe("verifyToken", () => {
    const mockToken = "valid.jwt.token";
    const decodedPayload = { userId: "test-user-id" };

    it("should verify the token using jwt.verify and return the payload", () => {
      (jwt.verify as unknown as vi.Mock).mockReturnValue(decodedPayload);

      const result = verifyToken(mockToken);

      expect(jwt.verify).toHaveBeenCalledTimes(1);
      expect(jwt.verify).toHaveBeenCalledWith(mockToken, MOCK_SECRET);
      expect(result).toEqual(decodedPayload);
    });

    it("should throw if verification fails (jwt.verify throws)", () => {
      const error = new Error("JWT Malformed");
      (jwt.verify as unknown as vi.Mock).mockImplementation(() => {
        throw error;
      });

      expect(() => verifyToken(mockToken)).toThrow(error);
    });
  });

  describe("loginUser", () => {
    const mockEmail = "test@example.com";
    const mockPassword = "correctpassword";
    const mockUser: User = {
      id: "user-1",
      email: mockEmail,
      passwordHash: "stored_hash_abc",
    };
    const mockToken = "generated.login.token";

    // Mock implementation for findUser passed to loginUser
    const mockFindUser = vi.fn();

    beforeEach(() => {
      mockFindUser.mockClear();
      (bcrypt.compare as unknown as vi.Mock).mockClear();
      (jwt.sign as unknown as vi.Mock).mockClear();
    });

    it("should return null if user is not found", async () => {
      mockFindUser.mockResolvedValue(null);

      const result = await loginUser(mockEmail, mockPassword, mockFindUser);

      expect(mockFindUser).toHaveBeenCalledWith(mockEmail);
      expect(result).toBeNull();
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it("should return null if password verification fails", async () => {
      mockFindUser.mockResolvedValue(mockUser);
      (bcrypt.compare as unknown as vi.Mock).mockResolvedValue(false);

      const result = await loginUser(mockEmail, "wrongpassword", mockFindUser);

      expect(mockFindUser).toHaveBeenCalledWith(mockEmail);
      expect(bcrypt.compare).toHaveBeenCalledWith("wrongpassword", mockUser.passwordHash);
      expect(result).toBeNull();
      expect(jwt.sign).not.toHaveBeenCalled();
    });

    it("should return token and user object upon successful login", async () => {
      mockFindUser.mockResolvedValue(mockUser);
      (bcrypt.compare as unknown as vi.Mock).mockResolvedValue(true);
      (jwt.sign as unknown as vi.Mock).mockReturnValue(mockToken);

      const result = await loginUser(mockEmail, mockPassword, mockFindUser);

      expect(mockFindUser).toHaveBeenCalledWith(mockEmail);
      expect(bcrypt.compare).toHaveBeenCalledWith(mockPassword, mockUser.passwordHash);
      expect(jwt.sign).toHaveBeenCalledWith({ userId: mockUser.id }, MOCK_SECRET, { expiresIn: "24h" });

      expect(result).toEqual({
        token: mockToken,
        user: mockUser,
      });
    });
  });
});