## `formatDate(date)`

Formats a `Date` object into a readable string using medium date style and short time style, specifically tailored for the Indian locale (`en-IN`).

This function leverages `Intl.DateTimeFormat` to produce a localized string representation of the date and time.

### Key Function

*   **`formatDate(date: Date)`**: Formats the provided `Date` object.

### Parameters

| Name | Type | Description |
| :--- | :--- | :--- |
| `date` | `Date` | The date object to format. |

### Formatting Details

The formatting is achieved using the following `Intl.DateTimeFormat` options:

*   **Locale**: `"en-IN"` (Indian English)
*   **`dateStyle`**: `"medium"` (e.g., "10 Feb 2026")
*   **`timeStyle`**: `"short"` (e.g., "10:30 PM")

### Example Usage

If the input date corresponds to February 10, 2026, at 10:30 PM, the output will resemble:

```
"10 Feb 2026, 10:30 PM"
```