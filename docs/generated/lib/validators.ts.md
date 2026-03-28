# lib/validators.ts

This module provides security and input validation utilities for the AI DB Agent. It focuses on preventing SQL injection, enforcing database constraints, and sanitizing user-provided chat messages.

## Interfaces

### `ValidationResult`
The standard return type for validation functions.

| Property | Type | Description |
| :--- | :--- | :--- |
| `isValid` | `boolean` | Indicates if the input passed all validation checks. |
| `errors` | `string[]` | A list of descriptive error messages if validation fails. |
| `sanitized` | `string` | The cleaned input string if valid; otherwise `undefined`. |

---

## Functions

### `validateSqlQuery(query: string): ValidationResult`
Validates a raw SQL query string for safety. It checks for:
* **Empty input:** Rejects null, undefined, or whitespace-only strings.
* **Length constraints:** Enforces a maximum length of 10,000 characters (referencing `QUERY_LIMITS.MAX_QUERY_LENGTH` in `lib/constants.ts`).
* **Dangerous Keywords:** Rejects queries containing destructive commands (e.g., `DROP`, `DELETE`, `TRUNCATE`, `GRANT`).
* **Injection Patterns:** Scans for common SQL injection signatures (e.g., `OR '1'='1'`, `UNION ALL SELECT`, comment sequences).

### `isValidTableName(name: string): boolean`
Checks if a string is a valid database table name.
* **Rules:** Must start with a letter or underscore, contain only alphanumeric characters or underscores, and be 64 characters or fewer.

### `validateChatMessage(message: string): ValidationResult`
Validates user input intended for the chat interface.
* **Length constraints:** Enforces a maximum length of 5,000 characters (referencing `QUERY_LIMITS.MAX_MESSAGE_LENGTH` in `lib/constants.ts`).
* **Character safety:** Rejects messages containing null bytes (`\x00`).

---

## Usage Example

```typescript
import { validateSqlQuery } from './lib/validators';

const result = validateSqlQuery("SELECT * FROM products; DROP TABLE users;");

if (!result.isValid) {
  console.error("Validation failed:", result.errors);
} else {
  console.log("Safe query:", result.sanitized);
}
```

## Related Components
* **`lib/constants.ts`**: Defines the limits used by these validators, such as `MAX_QUERY_LENGTH` and `MAX_MESSAGE_LENGTH`.