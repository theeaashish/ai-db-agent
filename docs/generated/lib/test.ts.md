# UserService Documentation

The `UserService` class manages user data, including creation, validation, deactivation, and searching. It utilizes external utility functions for email validation (`validateEmail`) and generating slugs for usernames (`slugify`).

## Dependencies

This module depends on:
*   `../utils/validateEmail`: For validating email formats during user creation.
*   `../utils/slugify`: For transforming user names into unique usernames (slugs).

## Types

### `User`

Defines the structure for a user object stored within the service.

| Property | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | Unique identifier for the user (UUID). |
| `name` | `string` | The user's full name. |
| `email` | `string` | The user's email address. |
| `username` | `string` | A URL-friendly slug derived from the name. |
| `isActive` | `boolean` | Account status. |
| `createdAt` | `Date` | Timestamp of user creation. |

## `UserService` Class

Manages an in-memory collection of `User` objects using a `Map`.

### Constructor

Initializes an empty internal user store (`Map`).

### Methods

#### `createUser(name: string, email: string): User`

Creates a new user, performing necessary validations and transformations.

1.  Validates the provided `email` using `validateEmail`. Throws an error if invalid.
2.  Checks if an account with the same `email` already exists. Throws an error if a duplicate is found.
3.  Generates a unique `id` using `crypto.randomUUID()`.
4.  Generates the `username` by slugifying the `name` using `slugify`.
5.  Sets the user as `isActive: true`.
6.  Stores the new user and returns the created `User` object.

#### `deactivateUser(id: string): User`

Marks an existing user as inactive.

*   Throws an error if the user ID is not found.
*   Sets the `isActive` property of the found user to `false`.

#### `search(query: string): User[]`

Searches all users whose name or email contains the provided query string (case-insensitive).

#### `getActiveUsers(): User[]`

Returns an array containing only users where `isActive` is `true`.

### Example Usage

```typescript
import { UserService } from './lib/test'; // Assuming './lib/test' is the path to this file

const userService = new UserService();

try {
  const newUser = userService.createUser("Alice Smith", "alice@example.com");
  console.log(`Created user: ${newUser.username} (${newUser.id})`);

  // Deactivate user
  userService.deactivateUser(newUser.id);

  // Search
  const results = userService.search("smith");
  console.log("Search results:", results.map(u => u.name));

} catch (error) {
  if (error instanceof Error) {
    console.error("Operation failed:", error.message);
  }
}
```