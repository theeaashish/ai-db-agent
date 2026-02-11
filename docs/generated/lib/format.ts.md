# lib/format.ts

This module provides utility functions for formatting dates.

## Exports

### `formatDate(date, locale)`

Formats a `Date`, timestamp string, or number into a human-readable string using the specified locale.

The default output format resembles: `"10 Feb 2026, 10:30 PM"`.

**Parameters:**

| Name | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `date` | `Date \| string \| number` | | The date value to format. |
| `locale` | `string` | `"en-IN"` | The locale string to use for formatting (e.g., `"en-US"`, `"fr-FR"`). |

**Returns:**

`string` - The formatted date string, or `"Invalid date"` if the input cannot be parsed into a valid date.

**Example Usage:**

```typescript
import { formatDate } from './lib/format';

const now = new Date();
const formatted = formatDate(now, 'en-US');
// Example output: "05/15/2024, 03:45 PM" (format depends on locale)

const invalid = formatDate("not a date");
// Output: "Invalid date"
```