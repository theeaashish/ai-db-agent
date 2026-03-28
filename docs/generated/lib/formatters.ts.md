# Formatter Utilities (`lib/formatters.ts`)

The `lib/formatters.ts` module provides a collection of utility functions for formatting data types such as currency, numbers, dates, and text. These utilities are designed to ensure consistent data presentation across the application, leveraging the native `Intl` API where applicable.

## Key Functions

### `formatCurrency(amount, currency?, locale?)`
Formats a numeric value into a localized currency string.
*   **Parameters:**
    *   `amount`: The number to format.
    *   `currency`: ISO currency code (default: `"USD"`).
    *   `locale`: BCP 47 language tag (default: `"en-US"`).
*   **Returns:** A string formatted with two decimal places (e.g., `"$1,234.56"`).

### `formatNumber(value, locale?)`
Formats a number with standard thousand separators.
*   **Parameters:**
    *   `value`: The number to format.
    *   `locale`: BCP 47 language tag (default: `"en-US"`).
*   **Returns:** A localized string representation of the number.

### `formatDate(dateString, locale?)`
Converts a date string into a human-readable format (e.g., `"Jan 1, 2023, 12:00 PM"`).
*   **Parameters:**
    *   `dateString`: A valid date string.
    *   `locale`: BCP 47 language tag (default: `"en-US"`).

### `formatRelativeTime(dateString)`
Calculates the time elapsed since a given date and returns a relative string (e.g., `"2 hours ago"`). If the date is older than 30 days, it falls back to `formatDate`.

### `truncateText(text, maxLength)`
Truncates a string to a specified length, appending an ellipsis (`...`) if the text exceeds the limit.
*   **Parameters:**
    *   `text`: The string to truncate.
    *   `maxLength`: The maximum character count allowed.

### `formatPercentage(value, decimals?)`
Converts a decimal value (e.g., `0.05`) into a percentage string (e.g., `"5.0%"`).
*   **Parameters:**
    *   `value`: The decimal value.
    *   `decimals`: Number of decimal places (default: `1`).

## Error Handling
All numeric and date-based formatting functions perform validation:
*   Throws an `Error` if the input is not a finite number.
*   Throws an `Error` if the provided date string is invalid or empty.

## Usage Example

```typescript
import { formatCurrency, formatRelativeTime } from './lib/formatters';

// Currency
console.log(formatCurrency(1250.5)); // "$1,250.50"

// Relative Time
console.log(formatRelativeTime("2023-10-27T10:00:00Z")); // "2 hours ago"
```