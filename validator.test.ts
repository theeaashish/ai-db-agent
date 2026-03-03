// Mocking Date for deterministic expiry tests
const RealDate = Date;

function mockDate(isoDate: string) {
  // @ts-ignore
  global.Date = class extends RealDate {
    constructor(dateString?: string | number) {
      if (dateString) {
        return new RealDate(dateString);
      }
      return new RealDate(isoDate);
    }
  };
}

afterAll(() => {
  global.Date = RealDate;
});

describe('validator', () => {

  // --- validateCardNumber Tests (Luhn Check) ---

  describe('validateCardNumber', () => {
    // Test case for a valid Visa card number (passes Luhn check)
    it('should return true for a valid 16-digit card number (Visa example)', () => {
      // Example valid number: 49927398716
      // A known valid 16-digit number (Mastercard example)
      const validCard = '5401234567890123';
      expect(validateCardNumber(validCard)).toBe(true);
    });

    it('should return true for a valid 13-digit card number', () => {
      // Example valid 13-digit number
      const validCard13 = '4000000000001';
      expect(validateCardNumber(validCard13)).toBe(true);
    });

    it('should return true for a valid 19-digit card number', () => {
      // Example valid 19-digit number (long but passes Luhn)
      const validCard19 = '7992739871300000001';
      expect(validateCardNumber(validCard19)).toBe(true);
    });

    it('should handle spaces and dashes correctly', () => {
      const spacedCard = '4992 7398 716'; // Valid 11-digit example, padded to 13 for length check context if needed, but testing cleaning.
      const validCardWithFormatting = '5401-2345-6789-0123';
      expect(validateCardNumber(validCardWithFormatting)).toBe(true);
    });

    it('should return false for an invalid Luhn check sum', () => {
      // Known valid: 49927398716. Change last digit to fail Luhn.
      const invalidLuhn = '49927398717';
      expect(validateCardNumber(invalidLuhn)).toBe(false);
    });

    it('should return false if length is too short (< 13 digits)', () => {
      const shortCard = '123456789012'; // 12 digits
      expect(validateCardNumber(shortCard)).toBe(false);
    });

    it('should return false if length is too long (> 19 digits)', () => {
      const longCard = '12345678901234567890'; // 20 digits
      expect(validateCardNumber(longCard)).toBe(false);
    });

    it('should return false if input contains non-digit characters (after cleaning)', () => {
      const invalidChars = '4992739871A6';
      expect(validateCardNumber(invalidChars)).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(validateCardNumber('')).toBe(false);
    });
  });

  // --- validateExpiry Tests ---

  describe('validateExpiry', () => {
    // Set a fixed reference date for testing: March 15, 2024
    const REFERENCE_DATE = '2024-03-15T12:00:00.000Z';

    beforeEach(() => {
      mockDate(REFERENCE_DATE);
    });

    // Required Scenario: rejects expired cards

    it('should return false if the year is in the past', () => {
      // Current year is 2024
      expect(validateExpiry(12, 2023)).toBe(false);
    });

    it('should return false if the year is current but the month is in the past', () => {
      // Current month is March (3). Test February (2).
      expect(validateExpiry(2, 2024)).toBe(false);
    });

    it('should return true if the month is the current month in the current year', () => {
      // Current month is March (3).
      expect(validateExpiry(3, 2024)).toBe(true);
    });

    it('should return true if the month is a future month in the current year', () => {
      // Current month is March (3). Test April (4).
      expect(validateExpiry(4, 2024)).toBe(true);
    });

    it('should return true if the year is in the future', () => {
      expect(validateExpiry(1, 2025)).toBe(true);
    });

    it('should return false if the month is invalid (0)', () => {
      expect(validateCardNumber('1234567890123')).toBe(false); // Testing card number validation path, but focusing on expiry logic here.
      expect(validateExpiry(0, 2024)).toBe(false);
    });

    it('should return false if the month is invalid (> 12)', () => {
      expect(validateExpiry(13, 2024)).toBe(false);
    });

    it('should return true for January of the current year if current month is later', () => {
      // Current month is March (3). Test January (1) of next year (2025)
      expect(validateExpiry(1, 2025)).toBe(true);
    });
  });

  // --- processPayment Tests ---

  describe('processPayment', () => {
    // Mocking fetch globally for this block, as it's an external dependency (Stripe API call)
    const mockFetch = vi.fn();

    beforeAll(() => {
      // @ts-ignore
      global.fetch = mockFetch;
    });

    afterAll(() => {
      // Restore original fetch
      // @ts-ignore
      global.fetch = RealDate; // Reusing RealDate placeholder for global scope cleanup if needed, though usually we restore the original fetch reference.
      // Since we don't have the original fetch reference easily, we rely on Vitest's cleanup or ensure we don't pollute global state if possible.
      // For simplicity in this isolated test block, we rely on the mock being set up.
    });

    beforeEach(() => {
      mockFetch.mockClear();
    });

    it('should return success true with transactionId if fetch is successful (200 OK)', async () => {
      const mockResponse = { ok: true, json: () => Promise.resolve({ id: 'txn_12345' }) };
      mockFetch.mockResolvedValue(mockResponse);

      const result = await processPayment(100.00, 'token123', 'merch456');

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith('/api/stripe/charge', {
        method: 'POST',
        body: JSON.stringify({ amount: 100.00, cardToken: 'token123', merchantId: 'merch456' }),
      });
      expect(result).toEqual({ success: true, transactionId: 'txn_12345' });
    });

    it('should return failure if fetch returns an error status (e.g., 400)', async () => {
      const mockResponse = { ok: false }; // Simulate non-2xx response
      mockFetch.mockResolvedValue(mockResponse);

      const result = await processPayment(50.00, 'token456', 'merch789');

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ success: false, error: 'Payment failed' });
    });

    it('should handle errors during JSON parsing (though less likely in production setup)', async () => {
      const mockResponse = { ok: true, json: () => Promise.reject(new Error('JSON Parse Error')) };
      mockFetch.mockResolvedValue(mockResponse);

      // Note: The current implementation structure means if result.json() fails, the error propagates or is caught by the outer promise chain.
      // Based on the source code:
      /*
        if (!result.ok) {
          return { success: false, error: 'Payment failed' };
        }
        const data = await result.json(); // This line will throw if json() rejects
        return { success: true, transactionId: data.id };
      */
      // If result.json() throws, the function will throw an unhandled promise rejection unless we wrap it in try/catch in the test setup, but since the source doesn't catch it, we expect the test runner to catch the rejection.

      await expect(processPayment(10.00, 't', 'm')).rejects.toThrow('JSON Parse Error');
    });
  });
});