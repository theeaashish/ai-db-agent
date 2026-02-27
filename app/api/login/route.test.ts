// Mock dependencies first
const mockJwt = {
  sign: vi.fn(),
  verify: vi.fn(),
};
const mockBcrypt = {
  hash: vi.fn(),
  compare: vi.fn(),
};

vi.mock("jsonwebtoken", () => mockJwt);
vi.mock("bcrypt", () => mockBcrypt);

// Mock environment variable access if necessary, though the source uses process.env directly.
// We will rely on the fallback or explicitly set process.env if needed for specific tests.

// --- Start of Tests ---

import {
  hashPassword,
  verifyPassword,
  generateToken,
  verifyToken,
  loginUser,
} from "./app/api/login/route";

describe("Authentication Utilities", () => {
  const TEST_SECRET = "test-secret-key";

  // Setup environment for tests that rely on JWT_SECRET being set,
  // although the source file uses a fallback if process.env is undefined.
  beforeAll(() => {
    process.env.JWT_SECRET = TEST_SECRET;
  });

  afterAll(() => {
    delete process.env.JWT_SECRET;
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("hashPassword", () => {
    it("should call bcrypt.hash with correct parameters", async () => {
      const password = "plainPassword";
      const hashedPassword = "hashedValue";
      mockBcrypt.hash.mockResolvedValue(hashedPassword);

      const result = await hashPassword(password);

      expect(mockBcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(result).toBe(hashedPassword);
    });
  });

  describe("verifyPassword", () => {
    it("should call bcrypt.compare and return true if passwords match", async () => {
      const password = "plainPassword";
      const hash = "storedHash";
      mockBcrypt.compare.mockResolvedValue(true);

      const result = await verifyPassword(password, hash);

      expect(mockBcrypt.compare).toHaveBeenCalledWith(password, hash);
      expect(result).toBe(true);
    });

    it("should call bcrypt.compare and return false if passwords do not match", async () => {
      const password = "wrongPassword";
      const hash = "storedHash";
      mockBcrypt.compare.mockResolvedValue(false);

      const result = await verifyPassword(password, hash);

      expect(mockBcrypt.compare).toHaveBeenCalledWith(password, hash);
      expect(result).toBe(false);
    });
  });

  describe("generateToken", () => {
    it("should generate a JWT token using the configured secret and correct expiry", () => {
      const userId = "user-123";
      const token = "mocked.jwt.token";
      mockJwt.sign.mockReturnValue(token);

      const result = generateToken(userId);

      // Note: The source file hardcodes '24h' expiry, not the 7d from lib/auth.ts context.
      expect(mockJwt.sign).toHaveBeenCalledWith(
        { userId },
        TEST_SECRET,
        { expiresIn: "24h" }
      );
      expect(result).toBe(token);
    });
  });

  describe("verifyToken", () => {
    it("should verify a valid token and return the payload", () => {
      const token = "valid.jwt.token";
      const payload = { userId: "user-456" };
      mockJwt.verify.mockReturnValue(payload);

      const result = verifyToken(token);

      expect(mockJwt.verify).toHaveBeenCalledWith(token, TEST_SECRET);
      expect(result).toEqual(payload);
    });

    it("should throw an error if verification fails (delegated to jwt.verify)", () => {
      const token = "invalid.jwt.token";
      const error = new Error("JWT Malformed");
      mockJwt.verify.mockImplementation(() => {
        throw error;
      });

      expect(() => verifyToken(token)).toThrow(error);
      expect(mockJwt.verify).toHaveBeenCalledWith(token, TEST_SECRET);
    });
  });

  describe("loginUser", () => {
    const mockFindUser = vi.fn();
    const mockUser: User = {
      id: "u-789",
      email: "test@example.com",
      passwordHash: "storedHash123",
    };

    beforeEach(() => {
      mockFindUser.mockClear();
    });

    it("should return null if user is not found", async () => {
      mockFindUser.mockResolvedValue(null);

      const result = await loginUser("unknown@example.com", "password", mockFindUser);

      expect(mockFindUser).toHaveBeenCalledWith("unknown@example.com");
      expect(result).toBeNull();
    });

    it("should return null if password verification fails", async () => {
      mockFindUser.mockResolvedValue(mockUser);
      mockBcrypt.compare.mockResolvedValue(false);

      const result = await loginUser(
        mockUser.email,
        "wrongpassword",
        mockFindUser
      );

      expect(mockFindUser).toHaveBeenCalledTimes(1);
      expect(mockBcrypt.compare).toHaveBeenCalledWith(
        "wrongpassword",
        mockUser.passwordHash
      );
      expect(result).toBeNull();
    });

    it("should return token and user object upon successful login", async () => {
      mockFindUser.mockResolvedValue(mockUser);
      mockBcrypt.compare.mockResolvedValue(true);
      const generatedToken = "final.jwt.token";
      mockJwt.sign.mockReturnValue(generatedToken);

      const result = await loginUser(
        mockUser.email,
        "correctpassword",
        mockFindUser
      );

      expect(mockFindUser).toHaveBeenCalledWith(mockUser.email);
      expect(mockBcrypt.compare).toHaveBeenCalledWith(
        "correctpassword",
        mockUser.passwordHash
      );
      expect(mockJwt.sign).toHaveBeenCalledWith(
        { userId: mockUser.id },
        TEST_SECRET,
        { expiresIn: "24h" }
      );

      expect(result).toEqual({
        token: generatedToken,
        user: mockUser,
      });
    });
  });
});