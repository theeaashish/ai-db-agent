# lib/logger.ts

This module provides a simple, structured logging utility (`logger`) that outputs log messages as JSON objects to the console. Logging behavior is conditional based on the environment variable `NODE_ENV`.

## Log Levels

The logger supports four distinct log levels:

*   `info`
*   `warn`
*   `error`
*   `debug`

## Core Functionality

The primary logging mechanism is handled by the internal `log` function, which constructs a payload containing a timestamp, level, message, and optional metadata.

### Conditional Logging

*   **Error Logs:** Messages logged at the `error` level are always printed to `console.error()`, regardless of the environment.
*   **Development Logs:** Messages logged at any level (`info`, `warn`, `debug`) are only printed to `console.log()` if the application is running in development mode (`process.env.NODE_ENV !== "production"`). In production, only explicit `error` calls will produce output.

## Exports

### `logger` Object

An object containing methods corresponding to each log level.

| Method | Description |
| :--- | :--- |
| `logger.info(msg, meta?)` | Logs an informational message. |
| `logger.warn(msg, meta?)` | Logs a warning message. |
| `logger.error(msg, meta?)` | Logs an error message (always outputs). |
| `logger.debug(msg, meta?)` | Logs a detailed debug message (only outputs in development). |

### Log Payload Structure

All logged messages are output as an object similar to this structure:

```json
{
  "timestamp": "2024-01-01T12:00:00.000Z",
  "level": "info",
  "message": "Operation successful",
  "meta": { /* optional metadata */ }
}
```

## Example Usage

```typescript
import { logger } from './lib/logger';

// Logs to console.log in development, potentially ignored in production
logger.info("User authenticated successfully", { userId: 123 });

// Logs to console.warn in development, potentially ignored in production
logger.warn("Configuration file not found", { path: "/etc/config.json" });

// Always logs to console.error
logger.error("Database connection failed", new Error("Timeout"));

// Only logs in development mode
logger.debug("Starting background job");
```