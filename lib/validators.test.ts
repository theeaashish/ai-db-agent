import { describe, it, expect } from 'vitest';
import { validateSqlQuery, isValidTableName, validateChatMessage } from './validators';

describe('validateSqlQuery', () => {
  it('should reject empty or non-string queries', () => {
    expect(validateSqlQuery('').isValid).toBe(false);
    expect(validateSqlQuery('   ').isValid).toBe(false);
    // @ts-expect-error testing invalid input
    expect(validateSqlQuery(null).isValid).toBe(false);
  });

  it('should detect dangerous SQL keywords', () => {
    const result = validateSqlQuery('DROP TABLE users');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Dangerous SQL keyword detected: DROP');
  });

  it('should detect SQL injection patterns', () => {
    const patterns = [
      "SELECT * FROM users; DROP TABLE users",
      "' OR '1'='1",
      "SELECT * FROM data --",
      "UNION ALL SELECT * FROM secrets"
    ];

    for (const pattern of patterns) {
      const result = validateSqlQuery(pattern);
      expect(result.isValid, `Failed to detect pattern: ${pattern}`).toBe(false);
    }
  });

  it('should pass safe SELECT queries', () => {
    const result = validateSqlQuery('SELECT name, price FROM products WHERE category = "electronics"');
    expect(result.isValid).toBe(true);
    expect(result.sanitized).toBe('SELECT name, price FROM products WHERE category = "electronics"');
  });

  it('should reject queries exceeding length limits', () => {
    const longQuery = 'SELECT * FROM table '.repeat(1000);
    const result = validateSqlQuery(longQuery);
    expect(result.isValid).toBe(false);
    expect(result.errors[0]).toContain('exceeds maximum length');
  });
});

describe('isValidTableName', () => {
  it('should validate correct table names', () => {
    expect(isValidTableName('products')).toBe(true);
    expect(isValidTableName('user_data_2023')).toBe(true);
  });

  it('should reject invalid table names', () => {
    expect(isValidTableName('123invalid')).toBe(false);
    expect(isValidTableName('invalid-table')).toBe(false);
    expect(isValidTableName('')).toBe(false);
    expect(isValidTableName('a'.repeat(65))).toBe(false);
  });
});

describe('validateChatMessage', () => {
  it('should reject empty or non-string messages', () => {
    expect(validateChatMessage('').isValid).toBe(false);
    // @ts-expect-error testing invalid input
    expect(validateChatMessage(null).isValid).toBe(false);
  });

  it('should reject messages with null characters', () => {
    const result = validateChatMessage('Hello\x00World');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Message contains invalid null characters');
  });

  it('should accept valid messages', () => {
    const result = validateChatMessage('Hello, how are you?');
    expect(result.isValid).toBe(true);
    expect(result.sanitized).toBe('Hello, how are you?');
  });

  it('should reject messages exceeding length limits', () => {
    const longMessage = 'a'.repeat(5001);
    const result = validateChatMessage(longMessage);
    expect(result.isValid).toBe(false);
    expect(result.errors[0]).toContain('exceeds maximum length');
  });
});