# Authentication Utilities (`app/api/login/route.ts`)

This module provides core utility functions for handling user authentication tasks, including password hashing/verification using `bcrypt` and JSON Web Token (JWT) generation/verification using `jsonwebtoken`. It also exports a high-level `loginUser` function to orchestrate the login flow.

The JWT secret is read from `process.env.JWT_SECRET`, defaulting to `"fallback-secret"` if the environment variable is not set.

## Dependencies

This module relies on:
*   `bcrypt` for cryptographic operations on passwords.
*   `jsonwebtoken` for creating and validating access tokens.

## Types

### `User` (Interface)

Defines the expected structure for a user object used within this module:

| Property | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | The unique identifier for the user. |
| `email` | `string` | The user's email address. |
| `passwordHash` | `string` | The hashed version of the user's password. |

## Exported Functions

### `hashPassword(password: string): Promise<string>`

Hashes a plain-text password using bcrypt with a salt round of 10.

**Parameters:**

| Name | Type | Description |
| :--- | :--- | :--- |
| `password` | `string` | The plain-text password to hash. |

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

Generates a JWT signed with the configured secret.

The token payload contains the `userId` and is set to expire in 24 hours (`24h`).

**Parameters:**

| Name | Type | Description |
| :--- | :--- | :--- |
| `userId` | `string` | The ID of the user to include in the token payload. |

**Returns:**

A signed JWT string.

### `verifyToken(token: string): { userId: string }`

Verifies the signature and expiration of a provided JWT using the configured secret.

**Parameters:**

| Name | Type | Description |
| :--- | :--- | :--- |
| `token` | `string` | The JWT string to verify. |

**Returns:**

The decoded payload containing the `userId`. Throws an error if verification fails (e.g., invalid signature or expired token).

### `loginUser(email: string, password: string, findUser: (email: string) => Promise<User | null>): Promise<{ token: string; user: User } | null>`

Handles the complete user login process: fetching the user, verifying the password, and generating a JWT upon success.

**Parameters:**

| Name | Type | Description |
| :--- | :--- | :--- |
| `email` | `string` | The user's email address for lookup. |
| `password` | `string` | The plain-text password provided during login. |
| `findUser` | `(email: string) => Promise<User | null>` | A callback function responsible for retrieving the user record by email from the persistence layer. |

**Returns:**

A promise that resolves to an object containing the generated `token` and the retrieved `user` object if login is successful. Returns `null` if the user is not found or the password verification fails.