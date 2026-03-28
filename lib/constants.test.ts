import { describe, it, expect } from 'vitest';
import * as constants from './constants';

describe('Constants Configuration', () => {
  it('should have all required application metadata defined', () => {
    expect(constants.APP_NAME).toBeDefined();
    expect(typeof constants.APP_NAME).toBe('string');
    expect(constants.APP_VERSION).toMatch(/^\d+\.\d+\.\d+$/);
  });

  describe('QUERY_LIMITS', () => {
    it('should define reasonable query limits', () => {
      expect(constants.QUERY_LIMITS.MAX_ROWS).toBeGreaterThan(0);
      expect(constants.QUERY_LIMITS.MAX_ROWS).toBeLessThanOrEqual(10000);
      
      expect(constants.QUERY_LIMITS.MAX_QUERY_LENGTH).toBe(10000);
      expect(constants.QUERY_LIMITS.MAX_MESSAGE_LENGTH).toBeLessThan(constants.QUERY_LIMITS.MAX_QUERY_LENGTH);
      
      expect(constants.QUERY_LIMITS.MAX_TABLE_NAME_LENGTH).toBe(64);
    });
  });

  describe('UI_CONSTANTS', () => {
    it('should have positive timing values', () => {
      expect(constants.UI_CONSTANTS.CHAT_POLL_INTERVAL_MS).toBeGreaterThan(0);
      expect(constants.UI_CONSTANTS.DEBOUNCE_DELAY_MS).toBeGreaterThan(0);
      expect(constants.UI_CONSTANTS.TOAST_DURATION_MS).toBeGreaterThan(0);
    });

    it('should limit visible messages to a reasonable number', () => {
      expect(constants.UI_CONSTANTS.MAX_VISIBLE_MESSAGES).toBeGreaterThan(0);
      expect(constants.UI_CONSTANTS.MAX_VISIBLE_MESSAGES).toBeLessThanOrEqual(1000);
    });
  });

  describe('Database Schema Constants', () => {
    it('should define valid table names', () => {
      expect(Object.values(constants.DB_TABLES)).toContain('products');
      expect(Object.values(constants.DB_TABLES)).toContain('sales');
    });

    it('should map tables to non-empty column arrays', () => {
      expect(constants.DB_COLUMNS.products.length).toBeGreaterThan(0);
      expect(constants.DB_COLUMNS.sales.length).toBeGreaterThan(0);
      expect(constants.DB_COLUMNS.products).toContain('id');
    });
  });

  describe('Enums and Types', () => {
    it('should contain expected regions', () => {
      expect(constants.REGIONS).toContain('North');
      expect(constants.REGIONS).toContain('West');
      expect(constants.REGIONS.length).toBe(5);
    });

    it('should contain expected categories', () => {
      expect(constants.CATEGORIES).toContain('Electronics');
      expect(constants.CATEGORIES).toContain('Books');
      expect(constants.CATEGORIES.length).toBeGreaterThan(0);
    });
  });
});