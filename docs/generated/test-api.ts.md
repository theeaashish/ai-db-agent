# `test-api.ts` Documentation

## Overview
`test-api.ts` is a lightweight, standalone HTTP server implementation using Node.js's native `http` module. It demonstrates how to build a functional RESTful API without external dependencies, featuring custom routing, rate limiting, and JSON request/response handling.

## Key Components

### 1. `Router` Class
A simple registry for mapping HTTP methods and paths to handler functions.
*   **`register(method, path, handler)`**: Adds a new route to the internal collection.
*   **`find(method, path)`**: Retrieves a registered route handler based on the request method and URL path.

### 2. `TokenBucketLimiter` Class
Implements rate limiting to prevent abuse.
*   **Mechanism**: Uses a token bucket algorithm where each IP address is assigned a bucket.
*   **`allow(key)`**: Checks if a request is permitted based on the bucket's current token count. Tokens refill over time based on the `refillRate`.
*   **Configuration**: Initialized with a capacity of 20 tokens and a refill rate of 5 tokens per second.

### 3. Utilities
*   **`parseBody(req)`**: An asynchronous helper that reads and parses incoming JSON request bodies.
*   **`sendJSON(res, status, data)`**: A helper function to standardize JSON responses with the correct `Content-Type` header.

## API Routes

| Method | Path | Description |
| :--- | :--- | :--- |
| `GET` | `/users` | Returns the list of all stored users. |
| `POST` | `/users` | Creates a new user (expects `{ name: string }` in body). |
| `GET` | `/health` | Returns a simple status object `{ status: "ok" }`. |

## Server Logic
The server is initialized via `http.createServer`. For every incoming request:
1.  **Rate Limiting**: The client's IP address is checked against the `TokenBucketLimiter`. If the limit is exceeded, it returns a `429 Too Many Requests` status.
2.  **Routing**: The request path is parsed and matched against the `Router`. If no match is found, it returns a `404 Not Found`.
3.  **Execution**: The request body is parsed, and the corresponding handler is executed.
4.  **Error Handling**: Any unhandled exceptions are caught, logged, and returned as a `500 Internal Server Error`.

## Usage
The server starts automatically upon execution, listening on port `3000`.

```bash
# Start the server
npx ts-node test-api.ts

# Example: Check health
curl http://localhost:3000/health

# Example: Create a user
curl -X POST http://localhost:3000/users -d '{"name": "Alice"}' -H "Content-Type: application/json"
```