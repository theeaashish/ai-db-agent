# lib/format.ts

This module provides a utility function for formatting dates into a human-readable string using specified locale options.

## Exports

### `formatDate(date, locale)`

Formats a `Date`, timestamp string, or number into a readable string. The default output format resembles: `"10 Feb 2026, 10:30 PM"`.

This function uses `toLocaleString` with specific options (`day: "2-digit"`, `month: "short"`, `year: "numeric"`, `hour: "2-digit"`, `minute: "2-digit"`, `hour12: true`) to achieve a consistent, localized format.

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

const timestamp = 1672531200000; // Jan 1, 2023
const formatted = formatDate(timestamp, 'en-US');
// Example output (en-US): "01/01/2023, 12:00 AM"

const specificDate = new Date('2025-10-20T15:45:00');
const formattedIN = formatDate(specificDate); // Uses default 'en-IN'
// Example output (en-IN): "20 Oct 2025, 03:45 PM"
```