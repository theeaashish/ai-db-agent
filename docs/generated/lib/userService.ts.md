# UserService Documentation

The `UserService` class manages user data, including creation, validation, deactivation, searching, and filtering active users. It relies on external utility functions for email validation (`validateEmail`) and generating usernames (`slugify`).

## Dependencies

This module depends on:
*   `../utils/validateEmail`: Used to ensure the provided email address is in a valid format during user creation.
*   `../utils/slugify`: Used to transform the user's name into a URL-friendly username.

## Types

### `User`

Defines the structure for a user object managed by the service.

| Property | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | Unique identifier for the user (generated via `crypto.randomUUID()`). |
| `name` | `string` | The user's full name. |
| `email` | `string` | The user's email address. |
| `username` | `string` | A URL-friendly slug derived from the `name`. |
| `isActive` | `boolean` | Indicates if the user account is currently active. |
| `createdAt` | `Date` | Timestamp when the user record was created. |

## Class: `UserService`

Manages the collection of users stored in an internal `Map`.

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

Searches all stored users whose name or email contains the provided query string.

*   The search is case-insensitive.
*   Returns an array of matching `User` objects.

#### `getActiveUsers(): User[]`

Returns an array containing only users where the `isActive` property is `true`.