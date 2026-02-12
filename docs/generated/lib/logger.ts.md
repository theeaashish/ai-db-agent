# lib/logger.ts

This module provides a simple logging utility (`logger`) that outputs formatted log messages to the console. Logging behavior is conditionally controlled based on the `NODE_ENV` environment variable to suppress debug messages in production.

## Core Functionality

The module defines a `log` function responsible for formatting and outputting messages.

### Formatting

The internal `format` function structures the log output to include a timestamp, log level, the message, and optional metadata.

### Conditional Logging

Logging is suppressed if the environment is set to `"production"` and the log level is `"debug"`.

*   `error` messages are always sent to `console.error()`.
*   `warn` messages are sent to `console.warn()`.
*   `info` and `debug` messages are sent to `console.log()`.

## Exports

### `logger` Object

An object providing methods for different log levels.

| Method | Description |
| :--- | :--- |
| `logger.debug(msg, meta?)` | Logs a detailed message. Suppressed in production. |
| `logger.info(msg, meta?)` | Logs an informational message. |
| `logger.warn(msg, meta?)` | Logs a warning message. |
| `logger.error(msg, meta?)` | Logs an error message (always outputs). |

### Example Usage

The usage pattern is consistent across all exported methods:

```typescript
import { logger } from './lib/logger';

// Example usage:
logger.info("Application started", { version: "1.0.0" });
logger.error("Failed to initialize service", new Error("Connection refused"));
logger.debug("Processing request ID 456"); // Only visible outside production
```