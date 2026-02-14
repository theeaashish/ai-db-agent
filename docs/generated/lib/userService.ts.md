# UserService Documentation

The `UserService` class manages the lifecycle and storage of `User` objects. It handles user creation with validation, deactivation, searching, and filtering for active users.

## Dependencies

This service relies on utility functions for data transformation and validation:
*   `validateEmail` (from `../utils/validateEmail`): Used to ensure email format correctness during user creation.
*   `slugify` (from `../utils/slugify`): Used to generate a URL-friendly `username` from the user's `name`.

## Types

### `User`

Defines the structure for a user record:

| Property | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | Unique identifier for the user. |
| `name` | `string` | The user's full name. |
| `email` | `string` | The user's email address. |
| `username` | `string` | A slugified version of the name, used for public identifiers. |
| `isActive` | `boolean` | Account status. |
| `createdAt` | `Date` | Timestamp of account creation. |

## Class: `UserService`

Manages a collection of users stored in an internal `Map`.

### Methods

#### `createUser(name: string, email: string): User`

Creates a new user, performing necessary validations and transformations before storage.

1.  Validates the provided `email` using `validateEmail`. Throws an error if invalid.
2.  Checks for existing users with the same `email`. Throws an error if a duplicate is found.
3.  Generates a unique `id` using `crypto.randomUUID()`.
4.  Generates the `username` by slugifying the `name` using `slugify`.
5.  Sets the user as `isActive: true`.
6.  Stores the new user in the internal map and returns the created `User` object.

#### `deactivateUser(id: string)`

Marks an existing user as inactive.

*   Throws an error if the user ID is not found in the service.
*   Sets the `isActive` property of the found user to `false`.
*   Returns the updated `User` object.

#### `search(query: string): User[]`

Searches all users whose name or email contains the provided query string (case-insensitive).

*   Returns an array of matching `User` objects.

#### `getActiveUsers(): User[]`

Returns an array containing only users where `isActive` is `true`.