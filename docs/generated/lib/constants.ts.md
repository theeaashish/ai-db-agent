# Documentation: `lib/constants.ts`

## Overview
The `lib/constants.ts` file serves as the central configuration hub for the application. It defines global settings, system limits, UI configurations, and database schema definitions. Centralizing these values ensures consistency across the codebase, particularly for validation logic used in `lib/validators.ts`.

## Key Components

### 1. Application Metadata
*   `APP_NAME`: The display name of the application.
*   `APP_VERSION`: The current semantic version of the application.

### 2. System Limits (`QUERY_LIMITS`)
These constants define the constraints for data processing and user input, used primarily by validation functions to prevent resource exhaustion or malicious input.
*   `MAX_ROWS`: Maximum number of rows allowed in a query result.
*   `MAX_QUERY_LENGTH`: Maximum character length for SQL queries (10,000).
*   `MAX_MESSAGE_LENGTH`: Maximum character length for chat messages.
*   `MAX_TABLE_NAME_LENGTH`: Maximum length for database table identifiers (64).

### 3. UI Configuration (`UI_CONSTANTS`)
Defines timing and display constraints for the frontend interface.
*   `CHAT_POLL_INTERVAL_MS`: Frequency of chat updates.
*   `DEBOUNCE_DELAY_MS`: Delay for input debouncing.
*   `TOAST_DURATION_MS`: Duration for notification toasts.
*   `MAX_VISIBLE_MESSAGES`: Limit on the number of messages rendered in the chat history.

### 4. Database Schema (`DB_TABLES` & `DB_COLUMNS`)
Defines the structure of the database to ensure type safety and consistency when querying.
*   **`DB_TABLES`**: Maps logical table names to actual database table strings.
*   **`DB_COLUMNS`**: Maps table keys to arrays of valid column names.

### 5. Domain Types (`REGIONS` & `CATEGORIES`)
Provides enumerated lists for business logic, along with TypeScript utility types for strict typing.
*   `REGIONS`: Valid geographic regions for sales data.
*   `CATEGORIES`: Valid product categories.
*   **Types**: `Region` and `Category` are exported as union types derived from these arrays.

## Usage Example

```typescript
import { QUERY_LIMITS, DB_TABLES } from './lib/constants';

// Example: Using constants for validation
function validateQuery(query: string) {
  if (query.length > QUERY_LIMITS.MAX_QUERY_LENGTH) {
    throw new Error("Query too long");
  }
  // ...
}

// Example: Accessing schema definitions
const salesColumns = DB_COLUMNS[DB_TABLES.SALES];
```

## Related Modules
*   **`lib/validators.ts`**: Consumes `QUERY_LIMITS` and `MAX_TABLE_NAME_LENGTH` to enforce security and input constraints.