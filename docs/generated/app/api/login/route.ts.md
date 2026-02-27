# Login and Authentication Utilities (`app/api/login/route.ts`)

This module provides core utilities for user authentication, including password hashing/verification using `bcrypt` and JWT generation/verification using `jsonwebtoken`. It also exports a high-level `loginUser` function for handling the login flow.

**Note:** This module reads the JWT secret from `process.env.JWT_SECRET`, falling back to `"fallback-secret"` if not set.

## Dependencies

This module relies on:
*   `bcrypt` for password hashing and comparison.
*   `jsonwebtoken` for JWT operations.

## Types

### `User` (Interface)

Defines the expected structure for a user object used within this module:

| Property | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | The unique identifier for the user. |
| `email` | `string` | The user's email address. |
| `passwordHash` | `string` | The hashed version of the user's password. |

## Exports

### `hashPassword(password: string): Promise<string>`

Hashes a plain-text password using bcrypt with a salt round of 10.

**Parameters:**

| Name | Type | Description |
| :--- | :--- | :--- |
| `password` | `string` | The password to hash. |

**Returns:**

A promise that resolves to the generated password hash string.

### `verifyPassword(password: string, hash: string): Promise<boolean>`

Compares a plain-text password against a stored hash.

**Parameters:**

| Name | Type | Description |
| :--- | :--- | :--- |
| `password` | `string` | The plain-text password provided by the user. |
| `hash` | `string` | The stored password hash. |

**Returns:**

A promise that resolves to `true` if the password matches the hash, otherwise `false`.

### `generateToken(userId: string): string`

Generates a JSON Web Token (JWT) for the given user ID, valid for 24 hours.

**Parameters:**

| Name | Type | Description |
| :--- | :--- | :--- |
| `userId` | `string` | The ID of the user to include in the token payload. |

**Returns:**

The generated JWT string.

### `verifyToken(token: string): { userId: string }`

Verifies a JWT and extracts the payload.

**Parameters:**

| Name | Type | Description |
| :--- | :--- | :--- |
| `token` | `string` | The JWT string to verify. |

**Returns:**

An object containing the decoded payload, specifically `{ userId: string }`.

### `loginUser(email: string, password: string, findUser: (email: string) => Promise<User | null>): Promise<{ token: string; user: User } | null>`

Handles the complete user login process: finds the user, verifies the password, and generates an authentication token upon success.

**Parameters:**

| Name | Type | Description |
| :--- | :--- | :--- |
| `email` | `string` | The user's email address. |
| `password` | `string` | The plain-text password provided by the user. |
| `findUser` | `(email: string) => Promise<User | null>` | A callback function responsible for fetching the user record from the database based on the email. |

**Returns:**

A promise that resolves to an object containing the authentication `token` and the `user` object if login is successful, or `null` if the user is not found or the password is incorrect.