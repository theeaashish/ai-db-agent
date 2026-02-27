# calculator.ts

This module provides basic arithmetic operations, including handling the edge case of division by zero, and an asynchronous calculation function for testing purposes.

## Exports

### `add(a: number, b: number): number`

Performs addition of two numbers.

**Parameters:**

| Name | Type | Description |
| :--- | :--- | :--- |
| `a` | `number` | The first operand. |
| `b` | `number` | The second operand. |

**Returns:**

The sum of `a` and `b`.

### `subtract(a: number, b: number): number`

Performs subtraction of two numbers.

**Parameters:**

| Name | Type | Description |
| :--- | :--- | :--- |
| `a` | `number` | The minuend. |
| `b` | `number` | The subtrahend. |

**Returns:**

The result of `a` minus `b`.

### `multiply(a: number, b: number): number`

Performs multiplication of two numbers.

**Parameters:**

| Name | Type | Description |
| :--- | :--- | :--- |
| `a` | `number` | The first factor. |
| `b` | `number` | The second factor. |

**Returns:**

The product of `a` and `b`.

### `divide(a: number, b: number): number`

Performs division of two numbers. Throws an error if the divisor is zero.

**Parameters:**

| Name | Type | Description |
| :--- | :--- | :--- |
| `a` | `number` | The dividend. |
| `b` | `number` | The divisor. |

**Returns:**

The result of `a` divided by `b`.

**Throws:**

If `b` is `0`, throws an error: `"Cannot divide by zero"`.

### `calculateAsync(operation: "add" | "subtract", a: number, b: number): Promise<number>`

Performs an asynchronous calculation (either addition or subtraction) after a short delay (10ms).

**Parameters:**

| Name | Type | Description |
| :--- | :--- | :--- |
| `operation` | `"add" \| "subtract"` | The operation to perform. |
| `a` | `number` | The first operand. |
| `b` | `number` | The second operand. |

**Returns:**

A promise that resolves to the result of the specified operation.