# Express Server Setup (`server/express.ts`)

This file sets up a basic Express server, configuring middleware, defining authentication and authorization mechanisms using JWTs, and implementing several in-memory API routes for user management.

## Dependencies and Configuration

The server initializes Express and configures essential settings based on environment variables:

*   **Port:** Reads from `process.env.PORT`, defaults to `5000`.
*   **JWT Secret:** Reads from `process.env.JWT_SECRET`, defaults to `"super-secret-key"`.

It utilizes external libraries for:
*   `cors`: Enabling Cross-Origin Resource Sharing.
*   `helmet`: Setting various HTTP headers for security.
*   `morgan`: HTTP request logging (using the 'dev' format).
*   `jsonwebtoken` (jwt): For creating and verifying authentication tokens.

## Data Structures

The file defines types for users and requests:

*   `Role`: Union type for user roles: `"admin"` or `"user"`.
*   `User`: Interface representing a user stored in the in-memory database.
*   `AuthRequest`: Extends Express `Request` to optionally include decoded user information (`id` and `role`) after successful authentication.

## In-Memory Database

A simple `Map` is used to simulate a database for users:

```typescript
const users = new Map<string, User>();
```

## Middleware

Several middleware functions are configured globally:

1.  **JSON Parsing:** `express.json()` to parse request bodies.
2.  **Security:** `helmet()` for security headers.
3.  **CORS:** `cors()` enabled.
4.  **Logging:** `morgan("dev")` for HTTP request logging.
5.  **Request Timer:** Custom middleware logging the duration of each request.

## Authentication and Authorization

### `authenticate(req, res, next)`

Middleware to verify JWT tokens provided in the `Authorization` header (`Bearer <token>`). If valid, it decodes the token payload (`id` and `role`) and attaches it to `req.user`. Returns 401 if the header is missing or the token is invalid/expired.

### `authorize(roles)`

A factory function that returns middleware to restrict access based on the user's role. It checks if `req.user.role` is included in the provided `roles` array. Returns 403 if the user is not authorized.

## Utilities

### `asyncHandler(fn)`

A wrapper function to simplify handling asynchronous route handlers. It catches any promise rejections from the handler function and passes them to the Express error handler via `next(err)`.

## API Routes

The server exposes the following endpoints:

| Method | Path | Description | Authentication/Authorization |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | Returns server status and uptime. | None |
| `POST` | `/auth/register` | Creates a new user in the in-memory store. Requires name, email, and role. | None |
| `POST` | `/auth/login` | Authenticates by email and returns a JWT valid for 1 hour. | None |
| `GET` | `/me` | Retrieves the details of the currently authenticated user. | `authenticate` |
| `GET` | `/admin/users` | Retrieves all users. | `authenticate`, `authorize(["admin"])` |
| `DELETE` | `/admin/users/:id` | Deletes a user by ID. | `authenticate`, `authorize(["admin"])` |

## Error Handling

A global error handling middleware is registered at the end to catch any unhandled errors thrown by routes or middleware, logging the error and responding with a generic `500 Internal Server Error`.

## Server Start

The application starts listening on the configured `PORT`.