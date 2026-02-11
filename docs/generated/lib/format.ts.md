# lib/format.ts

This module exports a utility function, `formatDate`, designed to convert a date input (which can be a `Date` object, string, or number timestamp) into a human-readable, localized string format.

## Exports

### `formatDate(date, locale)`

Formats a date into a readable string, typically resembling formats like "10 Feb 2026, 10:30 PM".

This function uses the browser's `toLocaleString` method with specific options to ensure a consistent output structure across different locales, prioritizing day, short month, year, and time components.

**Parameters:**

| Name | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `date` | `Date \| string \| number` | - | The date input to format. |
| `locale` | `string` | `"en-IN"` | The BCP 47 language tag to use for formatting (e.g., `"en-US"`, `"en-IN"`). |

**Returns:**

*   `string`: The formatted date string, or `"Invalid date"` if the input cannot be parsed into a valid date.

**Formatting Options Used:**

The output format is constructed using:
*   `day: "2-digit"`
*   `month: "short"`
*   `year: "numeric"`
*   `hour: "2-digit"`
*   `minute: "2-digit"`
*   `hour12: true`

**Example Usage (Conceptual):**

```typescript
import { formatDate } from './lib/format';

const timestamp = 1772544600000; // Example date in milliseconds
const formatted = formatDate(timestamp, 'en-US');
// Example output: "02/01/2026, 10:30 AM" (Actual output depends on locale implementation)
```

> **Note:** This function is related to formatting utilities, as seen in the generated documentation for `docs/generated/lib/format.ts.md`.