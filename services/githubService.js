const axios = require('axios');
require('dotenv').config();

class GithubService {
  constructor() {
    const headers = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'GitHub-Profile-Analyzer-API'
    };

    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }

    this.client = axios.create({
      baseURL: 'https://api.github.com',
      headers,
      timeout: 10000
    });
  }

  async fetchUserData(username) {
    try {
      const response = await this.client.get(`/users/${username}`);
      return response.data;
    } catch (error) {
      this._handleError(error, `fetching GitHub user: ${username}`);
    }
  }

  async fetchUserRepos(username) {
    try {
      const response = await this.client.get(`/users/${username}/repos?per_page=100&sort=updated`);
      return response.data;
    } catch (error) {
      this._handleError(error, `fetching GitHub repositories for: ${username}`);
    }
  }

  async performProfileAnalysis(username) {
    const [userData, repos] = await Promise.all([
      this.fetchUserData(username),
      this.fetchUserRepos(username)
    ]);

    let totalStars = 0;
    let totalForks = 0;
    const languageFrequency = {};

    repos.forEach(repo => {
      totalStars += repo.stargazers_count;
      totalForks += repo.forks_count;
      if (repo.language) {
        languageFrequency[repo.language] = (languageFrequency[repo.language] || 0) + 1;
      }
    });

    const topLanguages = Object.entries(languageFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([language]) => language);

    return {
      profile: {
        username: userData.login,
        name: userData.name,
        avatarUrl: userData.avatar_url,
        bio: userData.bio,
        publicRepos: userData.public_repos,
        followers: userData.followers,
        following: userData.following,
        githubCreatedAt: userData.created_at
      },
      analysis: {
        totalStars,
        totalForks,
        topLanguages,
        analyzedReposCount: repos.length
      }
    };
  }

  _handleError(error, context) {
    if (error.response) {
      const status = error.response.status;
      if (status === 404) {
        throw new Error(`GitHub resources not found while ${context}`);
      }
      throw new Error(`GitHub API Error (${status}) while ${context}: ${error.response.data.message}`);
    }
    throw new Error(`Failed network communication while ${context}: ${error.message}`);
  }
}

module.exports = new GithubService();
