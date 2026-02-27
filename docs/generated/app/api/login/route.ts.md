# API Login Utilities (`app/api/login/route.ts`)

This module provides core utilities for user authentication, including password hashing/verification using `bcrypt` and JWT generation/verification using `jsonwebtoken`. It also exports a high-level `loginUser` function to handle the authentication flow.

## Dependencies

This file directly imports and uses:
*   `bcrypt` for cryptographic hashing operations.
*   `jsonwebtoken` for creating and verifying authentication tokens.
*   It reads the JWT secret from the environment variable `JWT_SECRET`, falling back to `"fallback-secret"`.

## Interfaces

### `User`

Defines the expected structure for a user object used within this module:

| Property | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | The unique identifier for the user. |
| `email` | `string` | The user's email address. |
| `passwordHash` | `string` | The stored, hashed password. |

## Exports

### `hashPassword(password: string): Promise<string>`

Hashes a plain-text password using bcrypt with 10 salt rounds.

**Parameters:**

| Name | Type | Description |
| :--- | :--- | :--- |
| `password` | `string` | The password to hash. |

**Returns:**

A promise that resolves to the generated password hash string.

### `verifyPassword(password: string, hash: string): Promise<boolean>`

Compares a plain-text password against a stored hash using bcrypt.

**Parameters:**

| Name | Type | Description |
| :--- | :--- | :--- |
| `password` | `string` | The plain-text password provided by the user. |
| `hash` | `string` | The stored password hash. |

**Returns:**

A promise that resolves to `true` if the password matches the hash, otherwise `false`.

### `generateToken(userId: string): string`

Generates a JWT signed with the configured secret (`JWT_SECRET`).

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

Attempts to authenticate a user by email and password.

This function first retrieves the user using the provided `findUser` function, verifies the password against the stored hash, and if successful, generates an authentication token.

**Parameters:**

| Name | Type | Description |
| :--- | :--- | :--- |
| `email` | `string` | The user's email address. |
| `password` | `string` | The plain-text password provided by the user. |
| `findUser` | `(email: string) => Promise<User | null>` | A function to look up a user by email. |

**Returns:**

A promise that resolves to an object containing the generated `token` and the retrieved `user` object upon successful login, or `null` if the user is not found or the password verification fails.