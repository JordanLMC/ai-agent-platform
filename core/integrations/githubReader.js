const { Octokit } = require('@octokit/rest');
const fs = require('fs').promises;
const path = require('path');

/**
 * Generic GitHub Repository Reader and Research Module
 * Provides utilities for reading repository contents and searching for businesses
 */
class GitHubReader {
  constructor(token = null) {
    this.octokit = new Octokit({
      auth: token || process.env.GITHUB_TOKEN
    });
  }

  /**
   * List all files in a repository with optional filtering
   * @param {string} owner - Repository owner
   * @param {string} repo - Repository name
   * @param {string} path - Path within repo (default: '')
   * @param {string} ref - Branch/commit ref (default: 'main')
   * @param {Array<string>} extensions - Filter by file extensions
   * @returns {Array<Object>} Array of file objects
   */
  async listRepoFiles(owner, repo, path = '', ref = 'main', extensions = []) {
    try {
      const response = await this.octokit.rest.repos.getContent({
        owner,
        repo,
        path,
        ref
      });

      let files = [];
      const contents = Array.isArray(response.data) ? response.data : [response.data];

      for (const item of contents) {
        if (item.type === 'file') {
          const fileExt = path.extname(item.name).toLowerCase();
          if (extensions.length === 0 || extensions.includes(fileExt)) {
            files.push({
              name: item.name,
              path: item.path,
              size: item.size,
              download_url: item.download_url,
              type: 'file',
              extension: fileExt
            });
          }
        } else if (item.type === 'dir') {
          // Recursively get files from subdirectories
          const subFiles = await this.listRepoFiles(owner, repo, item.path, ref, extensions);
          files = files.concat(subFiles);
        }
      }

      return files;
    } catch (error) {
      console.error(`Error listing files for ${owner}/${repo}:`, error.message);
      return [];
    }
  }

  /**
   * Fetch content of a specific file from a repository
   * @param {string} owner - Repository owner
   * @param {string} repo - Repository name
   * @param {string} filePath - Path to the file
   * @param {string} ref - Branch/commit ref (default: 'main')
   * @returns {Object} File content and metadata
   */
  async fetchRepoFile(owner, repo, filePath, ref = 'main') {
    try {
      const response = await this.octokit.rest.repos.getContent({
        owner,
        repo,
        path: filePath,
        ref
      });

      const file = response.data;
      let content = '';

      if (file.encoding === 'base64') {
        content = Buffer.from(file.content, 'base64').toString('utf8');
      } else {
        content = file.content;
      }

      return {
        name: file.name,
        path: file.path,
        size: file.size,
        content,
        encoding: file.encoding,
        sha: file.sha,
        download_url: file.download_url
      };
    } catch (error) {
      console.error(`Error fetching file ${filePath} from ${owner}/${repo}:`, error.message);
      return null;
    }
  }

  /**
   * Search for repositories by topic, language, or keyword
   * @param {string} query - Search query
   * @param {Object} options - Search options
   * @returns {Array<Object>} Array of repository objects
   */
  async searchRepositories(query, options = {}) {
    try {
      const searchOptions = {
        q: query,
        sort: options.sort || 'stars',
        order: options.order || 'desc',
        per_page: options.per_page || 30,
        page: options.page || 1
      };

      const response = await this.octokit.rest.search.repos(searchOptions);
      
      return response.data.items.map(repo => ({
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        owner: repo.owner.login,
        description: repo.description,
        url: repo.html_url,
        clone_url: repo.clone_url,
        language: repo.language,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        issues: repo.open_issues_count,
        topics: repo.topics || [],
        created_at: repo.created_at,
        updated_at: repo.updated_at,
        license: repo.license?.name || null
      }));
    } catch (error) {
      console.error('Error searching repositories:', error.message);
      return [];
    }
  }

  /**
   * Find businesses/organizations on GitHub based on various criteria
   * @param {Object} criteria - Search criteria
   * @returns {Array<Object>} Array of business/organization profiles
   */
  async findBusinesses(criteria = {}) {
    try {
      let queries = [];
      
      // Build search query based on criteria
      if (criteria.industry) {
        queries.push(`topic:${criteria.industry}`);
      }
      if (criteria.technology) {
        queries.push(`language:${criteria.technology}`);
      }
      if (criteria.location) {
        queries.push(`location:"${criteria.location}"`);
      }
      if (criteria.company) {
        queries.push(`${criteria.company} in:name,description`);
      }
      if (criteria.minStars) {
        queries.push(`stars:>=${criteria.minStars}`);
      }
      
      // Default to searching for organizations if no specific criteria
      if (queries.length === 0) {
        queries.push('type:org');
      }

      const query = queries.join(' ');
      const repositories = await this.searchRepositories(query, {
        sort: 'stars',
        order: 'desc',
        per_page: criteria.limit || 50
      });

      // Group by organization/owner to find businesses
      const businesses = {};
      
      for (const repo of repositories) {
        const owner = repo.owner;
        if (!businesses[owner]) {
          // Get organization/user details
          try {
            const orgResponse = await this.octokit.rest.users.getByUsername({
              username: owner
            });
            
            const orgData = orgResponse.data;
            businesses[owner] = {
              username: owner,
              name: orgData.name,
              type: orgData.type,
              description: orgData.bio,
              location: orgData.location,
              website: orgData.blog,
              url: orgData.html_url,
              avatar_url: orgData.avatar_url,
              public_repos: orgData.public_repos,
              followers: orgData.followers,
              following: orgData.following,
              created_at: orgData.created_at,
              repositories: []
            };
          } catch (error) {
            // If we can't get org details, create basic entry
            businesses[owner] = {
              username: owner,
              type: 'unknown',
              repositories: []
            };
          }
        }
        
        businesses[owner].repositories.push({
          name: repo.name,
          description: repo.description,
          language: repo.language,
          stars: repo.stars,
          url: repo.url
        });
      }

      // Convert to array and sort by relevance (number of repos, stars, etc.)
      const businessList = Object.values(businesses)
        .filter(business => business.type === 'Organization' || business.public_repos > 5)
        .sort((a, b) => {
          const aScore = a.repositories.reduce((sum, repo) => sum + repo.stars, 0);
          const bScore = b.repositories.reduce((sum, repo) => sum + repo.stars, 0);
          return bScore - aScore;
        });

      return businessList;
    } catch (error) {
      console.error('Error finding businesses:', error.message);
      return [];
    }
  }

  /**
   * Analyze repository for business indicators
   * @param {string} owner - Repository owner
   * @param {string} repo - Repository name
   * @returns {Object} Analysis results
   */
  async analyzeRepository(owner, repo) {
    try {
      // Get repository details
      const repoResponse = await this.octokit.rest.repos.get({ owner, repo });
      const repoData = repoResponse.data;

      // Get README content for analysis
      let readmeContent = '';
      try {
        const readme = await this.fetchRepoFile(owner, repo, 'README.md');
        readmeContent = readme ? readme.content : '';
      } catch (error) {
        // Try other common README names
        const readmeFiles = ['README.rst', 'README.txt', 'README'];
        for (const filename of readmeFiles) {
          try {
            const readme = await this.fetchRepoFile(owner, repo, filename);
            if (readme) {
              readmeContent = readme.content;
              break;
            }
          } catch (e) {
            continue;
          }
        }
      }

      // Business indicators
      const businessIndicators = {
        hasLicense: !!repoData.license,
        hasDescription: !!repoData.description,
        hasWebsite: !!repoData.homepage,
        highStars: repoData.stargazers_count > 100,
        activeMaintenance: new Date(repoData.updated_at) > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // Updated in last 90 days
        hasTopics: repoData.topics && repoData.topics.length > 0,
        hasContributors: repoData.forks_count > 10
      };

      // Analyze README for business keywords
      const businessKeywords = [
        'company', 'business', 'enterprise', 'commercial', 'product',
        'service', 'solution', 'platform', 'api', 'saas', 'startup',
        'corporation', 'inc', 'llc', 'ltd', 'gmbh'
      ];
      
      const keywordMatches = businessKeywords.filter(keyword => 
        readmeContent.toLowerCase().includes(keyword)
      );

      return {
        repository: {
          name: repoData.full_name,
          description: repoData.description,
          language: repoData.language,
          stars: repoData.stargazers_count,
          forks: repoData.forks_count,
          issues: repoData.open_issues_count,
          topics: repoData.topics,
          license: repoData.license?.name,
          homepage: repoData.homepage,
          created_at: repoData.created_at,
          updated_at: repoData.updated_at
        },
        businessIndicators,
        keywordMatches,
        businessScore: Object.values(businessIndicators).filter(Boolean).length + keywordMatches.length
      };
    } catch (error) {
      console.error(`Error analyzing repository ${owner}/${repo}:`, error.message);
      return null;
    }
  }

  /**
   * Get trending repositories in a specific category/language
   * @param {string} language - Programming language
   * @param {string} since - Time period (daily, weekly, monthly)
   * @returns {Array<Object>} Trending repositories
   */
  async getTrendingRepos(language = '', since = 'weekly') {
    try {
      const dateMap = {
        daily: new Date(Date.now() - 24 * 60 * 60 * 1000),
        weekly: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        monthly: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      };

      const sinceDate = dateMap[since] || dateMap.weekly;
      const dateString = sinceDate.toISOString().split('T')[0];

      let query = `created:>${dateString}`;
      if (language) {
        query += ` language:${language}`;
      }

      return await this.searchRepositories(query, {
        sort: 'stars',
        order: 'desc',
        per_page: 30
      });
    } catch (error) {
      console.error('Error getting trending repositories:', error.message);
      return [];
    }
  }
}

module.exports = GitHubReader;
