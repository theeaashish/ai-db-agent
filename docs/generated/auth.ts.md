# Authentication Router (`auth.ts`)

This file defines an Express router (`router`) responsible for handling user authentication endpoints: `/login` and a protected route `/profile`. It utilizes `bcryptjs` for password comparison and `jsonwebtoken` for JWT creation. It also integrates an external authentication middleware (`authMiddleware`).

**Note:** This implementation uses a hardcoded dummy user for demonstration purposes. In a production environment, user retrieval and password hashing should interact with a database.

## Dependencies

This module imports and uses:
*   `express`: For creating the router.
*   `jsonwebtoken`: For signing JWTs.
*   `bcryptjs`: For asynchronous password hashing and comparison.
*   `../middleware/auth.js`: An external middleware assumed to verify JWTs on protected routes.

## Exports

*   `default`: An Express router instance configured with the authentication routes.

## Key Components

### Dummy User Data

A hardcoded `user` object is defined for testing the login logic:

```typescript
const user = {
  id: "123",
  email: "test@example.com",
  password: bcrypt.hashSync("password123", 10), // Password is pre-hashed
};
```

### `/login` Route (POST)

Handles user login attempts.

1.  Extracts `email` and `password` from the request body.
2.  Compares the provided password against the hardcoded user's hashed password using `bcrypt.compare`.
3.  If credentials are valid, it generates a JSON Web Token (JWT) signed with `process.env.JWT_SECRET` and an expiration time defined by `process.env.JWT_EXPIRES_IN`.
4.  Responds with a success message and the generated `token`.
5.  Returns a 401 Unauthorized response for invalid credentials.

### `/profile` Route (GET)

A protected route that requires valid authentication.

1.  It is protected by the imported `authMiddleware`.
2.  If the middleware successfully verifies the token, the decoded payload (containing user information) is attached to `req.user`.
3.  The route responds with a success message and the user data from the request object.

## Usage Example (Conceptual)

This router should be mounted in your main Express application setup:

```typescript
// Example in server.ts or app.ts
import authRoutes from './auth';
// ... app setup ...
app.use('/api/auth', authRoutes);
```