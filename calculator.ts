// Simple calculator with edge cases
export function add(a: number, b: number): number {
  return a + b;
}

export function subtract(a: number, b: number): number {
  return a - b;
}

export function multiply(a: number, b: number): number {
  return a * b;
}

export function divide(a: number, b: number): number {
  if (b === 0) {
    throw new Error("Cannot divide by zero");
  }
  return a / b;
}

// Async function for testing
export async function calculateAsync(
  operation: "add" | "subtract",
  a: number,
  b: number
): Promise<number> {
  await new Promise((resolve) => setTimeout(resolve, 10));
  return operation === "add" ? add(a, b) : subtract(a, b);
}
