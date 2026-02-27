import { describe, it, expect, vi } from "vitest";
import {
  add,
  subtract,
  multiply,
  divide,
  calculateAsync,
} from "./calculator";

describe("Calculator", () => {
  // --- add ---
  describe("add", () => {
    it("should return the sum of two positive numbers", () => {
      expect(add(5, 3)).toBe(8);
    });

    it("should handle negative numbers correctly", () => {
      expect(add(-5, 3)).toBe(-2);
      expect(add(-5, -3)).toBe(-8);
    });

    it("should handle zero", () => {
      expect(add(10, 0)).toBe(10);
      expect(add(0, -10)).toBe(-10);
      expect(add(0, 0)).toBe(0);
    });

    it("should handle floating point numbers", () => {
      expect(add(0.1, 0.2)).toBeCloseTo(0.3);
    });
  });

  // --- subtract ---
  describe("subtract", () => {
    it("should return the difference of two positive numbers", () => {
      expect(subtract(10, 4)).toBe(6);
    });

    it("should handle subtraction resulting in a negative number", () => {
      expect(subtract(4, 10)).toBe(-6);
    });

    it("should handle negative inputs", () => {
      expect(subtract(-10, 5)).toBe(-15);
      expect(subtract(10, -5)).toBe(15);
      expect(subtract(-10, -5)).toBe(-5);
    });

    it("should handle zero", () => {
      expect(subtract(10, 0)).toBe(10);
      expect(subtract(0, 10)).toBe(-10);
    });

    it("should handle floating point numbers", () => {
      expect(subtract(0.3, 0.1)).toBeCloseTo(0.2);
    });
  });

  // --- multiply ---
  describe("multiply", () => {
    it("should return the product of two positive numbers", () => {
      expect(multiply(5, 6)).toBe(30);
    });

    it("should handle negative numbers", () => {
      expect(multiply(-5, 6)).toBe(-30);
      expect(multiply(5, -6)).toBe(-30);
      expect(multiply(-5, -6)).toBe(30);
    });

    it("should handle zero", () => {
      expect(multiply(100, 0)).toBe(0);
      expect(multiply(0, -100)).toBe(0);
    });

    it("should handle floating point numbers", () => {
      expect(multiply(2.5, 2)).toBe(5);
      expect(multiply(0.5, 0.5)).toBeCloseTo(0.25);
    });
  });

  // --- divide ---
  describe("divide", () => {
    it("should return the quotient of two numbers", () => {
      expect(divide(10, 2)).toBe(5);
    });

    it("should handle division resulting in a fraction", () => {
      expect(divide(5, 2)).toBe(2.5);
    });

    it("should handle negative numbers", () => {
      expect(divide(-10, 2)).toBe(-5);
      expect(divide(10, -2)).toBe(-5);
      expect(divide(-10, -2)).toBe(5);
    });

    it("should handle division by 1", () => {
      expect(divide(42, 1)).toBe(42);
    });

    it("should handle division resulting in 0", () => {
      expect(divide(0, 5)).toBe(0);
    });

    it("should throw an error when dividing by zero", () => {
      expect(() => divide(10, 0)).toThrow("Cannot divide by zero");
      expect(() => divide(-10, 0)).toThrow("Cannot divide by zero");
      expect(() => divide(0, 0)).toThrow("Cannot divide by zero");
    });

    it("should handle floating point division", () => {
      expect(divide(1, 3)).toBeCloseTo(0.333333333);
    });
  });

  // --- calculateAsync ---
  describe("calculateAsync", () => {
    // Mocking setTimeout to avoid actual waiting, although the implementation uses Promise constructor which is harder to mock directly without spying on global timers.
    // Since the delay is fixed (10ms), we rely on the async nature and check the result.

    it("should correctly perform addition asynchronously", async () => {
      const result = await calculateAsync("add", 10, 5);
      expect(result).toBe(15);
    });

    it("should correctly perform subtraction asynchronously", async () => {
      const result = await calculateAsync("subtract", 10, 5);
      expect(result).toBe(5);
    });

    it("should handle negative numbers in async addition", async () => {
      const result = await calculateAsync("add", -10, 3);
      expect(result).toBe(-7);
    });

    it("should handle negative numbers in async subtraction", async () => {
      const result = await calculateAsync("subtract", 5, 15);
      expect(result).toBe(-10);
    });

    it("should handle zero in async operations", async () => {
      const addResult = await calculateAsync("add", 0, 99);
      expect(addResult).toBe(99);

      const subResult = await calculateAsync("subtract", 99, 0);
      expect(subResult).toBe(99);
    });
  });
});