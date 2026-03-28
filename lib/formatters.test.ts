import { describe, it, expect } from 'vitest';
import { 
  formatCurrency, 
  formatNumber, 
  formatDate, 
  formatRelativeTime, 
  truncateText, 
  formatPercentage 
} from './formatters';

describe('formatters', () => {
  describe('formatCurrency', () => {
    it('formats positive amounts correctly', () => {
      const result = formatCurrency(1234.56, 'USD', 'en-US');
      expect(result).toBe('$1,234.56');
    });

    it('formats zero correctly', () => {
      const result = formatCurrency(0, 'USD', 'en-US');
      expect(result).toBe('$0.00');
    });

    it('throws error for non-finite numbers', () => {
      expect(() => formatCurrency(Infinity)).toThrow('Amount must be a finite number');
    });
  });

  describe('formatNumber', () => {
    it('handles large values with thousand separators', () => {
      const result = formatNumber(1000000, 'en-US');
      expect(result).toBe('1,000,000');
    });
  });

  describe('formatDate', () => {
    it('produces readable output for valid date strings', () => {
      const date = '2023-10-05T14:30:00Z';
      const result = formatDate(date, 'en-US');
      // Note: Intl output can vary slightly by environment, checking for expected components
      expect(result).toContain('Oct 5, 2023');
      expect(result).toMatch(/\d{2}:\d{2}/);
    });

    it('throws error for invalid date strings', () => {
      expect(() => formatDate('not-a-date')).toThrow('Invalid date string');
    });
  });

  describe('formatRelativeTime', () => {
    it('returns "just now" for recent timestamps', () => {
      const recent = new Date(Date.now() - 5000).toISOString();
      expect(formatRelativeTime(recent)).toBe('just now');
    });

    it('returns minute-based strings', () => {
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
      expect(formatRelativeTime(tenMinutesAgo)).toBe('10 minutes ago');
    });
  });

  describe('truncateText', () => {
    it('truncates text exceeding maxLength with ellipsis', () => {
      expect(truncateText('Hello World', 8)).toBe('Hello...');
    });

    it('returns original text if within maxLength', () => {
      expect(truncateText('Hi', 5)).toBe('Hi');
    });

    it('returns empty string for invalid inputs', () => {
      expect(truncateText('', 5)).toBe('');
      expect(truncateText('test', 0)).toBe('');
    });
  });

  describe('formatPercentage', () => {
    it('formats decimal to percentage string', () => {
      expect(formatPercentage(0.1234, 2)).toBe('12.34%');
    });

    it('defaults to 1 decimal place', () => {
      expect(formatPercentage(0.5)).toBe('50.0%');
    });
  });
});