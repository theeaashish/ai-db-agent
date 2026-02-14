# lib/types.ts Documentation

This file exports a simulated in-memory database client (`db`) for managing `User` records, primarily intended for testing purposes.

## Types

### `User`

Defines the structure for a user record stored in the simulated database.

| Property | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | Unique identifier for the user. |
| `email` | `string` | The user's email address. |
| `name` | `string` | The user's full name. |

## Simulated Database Client (`db`)

An object providing basic CRUD operations against an in-memory array of users.

### Exports

#### `db.createUser(data: Omit<User, "id">): User`

Creates a new user record by adding a unique `id` to the provided data and pushing it to the internal user list.

**Parameters:**
* `data`: An object containing `email` and `name` (all properties of `User` except `id`).

**Returns:**
* The newly created `User` object, including the generated `id`.

#### `db.getUserByEmail(email: string): User | null`

Retrieves a user record based on their email address.

**Parameters:**
* `email`: The email address to search for.

**Returns:**
* The matching `User` object, or `null` if no user is found.

***

**Note on Context:** While this file defines a basic `User` type, related code snippets (e.g., in `lib/test.ts` and `server/express.ts`) suggest that production or more complex services might use a richer `User` interface that includes fields like `username`, `isActive`, or `role`. This module focuses only on the minimal structure required for its simulated persistence layer.