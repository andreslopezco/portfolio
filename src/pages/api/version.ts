import type { APIRoute } from 'astro';
import { Octokit } from 'octokit';

export const GET: APIRoute = async () => {
  try {
    const octokit = new Octokit();
    const owner = 'andreslopezco'; // Replace with your GitHub username
    const repo = 'portfolio'; // Replace with your repository name

    const { data: repoData } = await octokit.rest.repos.get({
      owner,
      repo,
    });

    // Get the latest release if it exists
    const { data: releases } = await octokit.rest.repos.listReleases({
      owner,
      repo,
      per_page: 1,
    });

    const version = releases.length > 0 ? releases[0].tag_name : repoData.default_branch;

    return new Response(JSON.stringify({
      version,
      lastUpdate: repoData.updated_at,
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
      }
    });
  } catch (error) {
    console.error('Error fetching version:', error);
    return new Response(JSON.stringify({
      error: 'Failed to fetch version information'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
