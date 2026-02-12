# lib/github.ts

This module provides utility functions for interacting with the GitHub REST API, abstracting the underlying `fetch` calls and incorporating structured logging via the imported `logger`.

It relies on the logging functionality defined in [`lib/logger.ts`](/lib/logger.ts).

## Core Functionality

The module exports functions to retrieve user repositories and repository commits. All API interactions are routed through a centralized, error-handling `githubFetch` function.

### `githubFetch<T>(path: string, options: GitHubFetchOptions = {}): Promise<T>`

This is the internal helper function responsible for making authenticated or unauthenticated requests to the GitHub API base URL (`https://api.github.com`).

It automatically sets necessary headers:
*   `Accept: application/vnd.github+json`
*   `Authorization` header if an access `token` is provided in `options`.

If the HTTP response status is not OK (`res.ok` is false), it logs an error using `logger.error` detailing the path, status, and error response body, and then throws an error.

### Exported Functions

#### `getUserRepos(username: string, token?: string): Promise<Array<{ id: number; name: string; full_name: string; private: boolean; }>>`

Fetches the list of public and private repositories belonging to the specified GitHub `username`.

It logs an informational message before making the request.

#### `getRepoCommits(owner: string, repo: string, token?: string): Promise<Array<{ sha: string; commit: { message: string; author: { name: string; date: string; }; }; }>>`

Fetches the list of commits for a specific repository owned by an `owner`.

It logs an informational message including the owner and repository name before making the request.

## Example Usage

While direct usage of `githubFetch` is discouraged, consumers would use the exported functions:

```typescript
import { getUserRepos } from './lib/github';

// Fetch repositories for a public user
const repos = await getUserRepos("octocat");
console.log(`Found ${repos.length} repos for octocat.`);

// Fetch repositories using a personal access token for private access
const privateRepos = await getUserRepos("my-username", "ghp_YOUR_TOKEN");
```