# Helper Utility: Timeout Wrapper

The `helper.ts` file provides a robust utility for managing asynchronous operations by enforcing execution time limits. This is particularly useful for preventing hanging processes in API routes or long-running tasks.

## Overview

The `withTimeout` function acts as a wrapper for any `Promise`. It uses `Promise.race` to compete the target operation against a timer, ensuring that if the operation exceeds the specified duration, it is rejected with a descriptive error.

## Key Components

### `withTimeout<T>`

A generic utility function that wraps an asynchronous operation with a timeout mechanism.

*   **Parameters**:
    *   `promise`: The `Promise<T>` to execute.
    *   `label`: A string identifier used for logging and error reporting.
    *   `ms` (optional): The timeout duration in milliseconds (defaults to `30,000ms`).
*   **Behavior**:
    *   Logs the start of the operation.
    *   Races the provided promise against a `setTimeout` promise.
    *   Logs the total execution time upon success.
    *   Logs and re-throws an error if the timeout is reached or the operation fails.

## Usage Example

You can use `withTimeout` to wrap critical asynchronous calls, such as external API requests or complex calculations (e.g., those found in `calculator.ts`), to ensure your application remains responsive.

```typescript
import { withTimeout } from './helper';
import { calculateAsync } from './calculator';

async function performTask() {
  try {
    const result = await withTimeout(
      calculateAsync('add', 5, 10),
      'CalculationTask',
      5000 // 5 second timeout
    );
    console.log('Result:', result);
  } catch (error) {
    // Handle timeout or calculation error
    console.error('Task failed:', error);
  }
}
```

## Integration Context

This utility is designed to complement the error handling and performance constraints defined in your API routes (e.g., `app/api/chat/route.ts`). By wrapping tool executions or external service calls in `withTimeout`, you can ensure that the 30-second `maxDuration` constraint of your API is respected and debugged effectively through the provided console logs.