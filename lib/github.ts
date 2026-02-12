// lib/github.ts

import { logger } from "./logger";

const GITHUB_API_BASE = "https://api.github.com";

type GitHubFetchOptions = {
  token?: string;
};

async function githubFetch<T>(
  path: string,
  options: GitHubFetchOptions = {}
): Promise<T> {
  const res = await fetch(`${GITHUB_API_BASE}${path}`, {
    headers: {
      Accept: "application/vnd.github+json",
      ...(options.token && {
        Authorization: `Bearer ${options.token}`,
      }),
    },
  });

  if (!res.ok) {
    const error = await res.text();
    logger.error("GitHub API error", {
      path,
      status: res.status,
      error,
    });
    throw new Error(`GitHub API failed: ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export async function getUserRepos(
  username: string,
  token?: string
) {
  logger.info("Fetching GitHub repos", { username });

  return githubFetch<
    {
      id: number;
      name: string;
      full_name: string;
      private: boolean;
    }[]
  >(`/users/${username}/repos`, { token });
}

export async function getRepoCommits(
  owner: string,
  repo: string,
  token?: string
) {
  logger.info("Fetching repo commits", { owner, repo });

  return githubFetch<
    {
      sha: string;
      commit: {
        message: string;
        author: {
          name: string;
          date: string;
        };
      };
    }[]
  >(`/repos/${owner}/${repo}/commits`, { token });
}

