# HTTP Response Utilities (`lib/http.ts`)

This module provides standardized functions for structuring successful and failed API responses. These utilities ensure consistency across API endpoints, similar to how authentication and authorization are handled in `server/express.ts`.

## Exports

### `success<T>(data: T)`

Creates a standardized successful response object.

**Parameters:**

| Name | Type | Description |
| :--- | :--- | :--- |
| `data` | `T` | The payload data to return on success. |

**Returns:**

An object conforming to the structure `{ success: true, data: T }`.

### `failure(message: string)`

Creates a standardized failure response object.

**Parameters:**

| Name | Type | Description |
| :--- | :--- | :--- |
| `message` | `string` | A descriptive error message. |

**Returns:**

An object conforming to the structure `{ success: false, error: string }`.