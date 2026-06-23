// VitePress build-time data loader.
// https://vitepress.dev/guide/data-loading
//
// Fetches the public repositories for GITHUB_USER once, at build time, and bakes
// the result into the static bundle. Unlike a client-side fetch, this means:
//   - zero GitHub API calls from visitors' browsers (no rate-limit risk),
//   - the data is server-rendered into the HTML (good for SEO and no flash of
//     empty content), and
//   - one request per build instead of one per page view.
//
// Import the typed `data` export from a component or page:
//   import { data as repos } from './repos.data.mts';
//
// Set GITHUB_TOKEN in the environment to raise the API rate limit from 60 to
// 5000 requests per hour. It is optional; the loader works without it.

import { defineLoader } from 'vitepress';

const GITHUB_USER = 'ahandsel';

// Repositories matching any of these names are hidden from the cards.
const EXCLUDE = new Set<string>([`${GITHUB_USER}.github.io`]);

export interface Repo {
  name: string;
  description: string;
  url: string;
  homepage: string | null;
  language: string | null;
  stars: number;
  forks: number;
  topics: string[];
  updatedAt: string;
}

declare const data: Repo[];
export { data };

// The raw shape we consume from the GitHub REST API response.
interface GitHubRepo {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics?: string[];
  updated_at: string;
  fork: boolean;
  archived: boolean;
}

export default defineLoader({
  async load(): Promise<Repo[]> {
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': `${GITHUB_USER}-vitepress-portfolio`,
    };
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&type=owner&sort=updated`,
      { headers },
    );

    if (!res.ok) {
      // Do not fail the whole build over a transient API hiccup; render an empty
      // grid instead and log enough to diagnose it in the build output.
      console.warn(
        `⚠️ repos.data: GitHub API returned ${res.status} ${res.statusText}; rendering no repo cards.`,
      );
      return [];
    }

    const raw = (await res.json()) as GitHubRepo[];

    const repos = raw
      .filter((repo) => !repo.fork && !repo.archived && !EXCLUDE.has(repo.name))
      .map<Repo>((repo) => ({
        name: repo.name,
        description: repo.description ?? '',
        url: repo.html_url,
        homepage: repo.homepage || null,
        language: repo.language,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        topics: repo.topics ?? [],
        updatedAt: repo.updated_at,
      }))
      // Most-starred first, then most-recently updated as a tie-breaker.
      .sort((a, b) => b.stars - a.stars || b.updatedAt.localeCompare(a.updatedAt));

    console.log(`✅ repos.data: loaded ${repos.length} repositories for ${GITHUB_USER}.`);
    return repos;
  },
});
