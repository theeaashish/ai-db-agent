# lib/formatMoney.ts

This module exports a utility function, `formatMoney`, designed to format a given number into an Indian Rupee (INR) currency string representation.

## Exports

### `formatMoney(amount: number): string`

Formats a numeric amount into a localized currency string using the Indian Rupee format (`en-IN`).

**Parameters:**

*   `amount`: The number to be formatted as currency.

**Returns:**

*   A string representing the formatted currency amount (e.g., "₹1,23,456.00").

**Example:**

```typescript
import { formatMoney } from './lib/formatMoney';

const price = 123456.78;
const formatted = formatMoney(price); // Returns "₹1,23,456.78"
```