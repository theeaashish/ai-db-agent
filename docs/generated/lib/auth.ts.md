# JWT Authentication Utilities

This module provides utility functions for generating and verifying JSON Web Tokens (JWTs) using the secret configured in the environment variables.

## Dependencies

This module relies on:
*   `jsonwebtoken` for JWT operations.
*   `./env` for accessing configuration, specifically `env.JWT_SECRET`.

## Exports

### `generateToken(userId: string): string`

Generates a JWT signed with the configured secret.

The token payload contains the `userId` and is set to expire in 7 days (`7d`).

**Parameters:**

| Name | Type | Description |
| :--- | :--- | :--- |
| `userId` | `string` | The ID of the user to include in the token payload. |

**Returns:**

A signed JWT string.

### `verifyToken(token: string): { userId: string }`

Verifies the signature and expiration of a provided JWT.

**Parameters:**

| Name | Type | Description |
| :--- | :--- | :--- |
| `token` | `string` | The JWT string to verify. |

**Returns:**

The decoded payload containing the `userId`. Throws an error if verification fails (e.g., invalid signature or expired token).