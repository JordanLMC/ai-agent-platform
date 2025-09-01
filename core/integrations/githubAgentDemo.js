/**
 * GitHub Agent Demo - Example usage of GitHubReader module
 * This file demonstrates how to use the main functions from githubReader.js
 * for agent-powered GitHub research and repository analysis.
 */

const GitHubReader = require('./githubReader');

// Initialize the GitHub reader with your token
// Make sure to set GITHUB_TOKEN environment variable or pass token directly
const githubReader = new GitHubReader(); // Uses process.env.GITHUB_TOKEN
// Or with explicit token: const githubReader = new GitHubReader('your_github_token_here');

/**
 * Demo 1: List Repository Files
 * This function demonstrates how to list all files in a repository
 * with optional filtering by file extensions.
 */
async function demonstrateListRepoFiles() {
  console.log('\n=== Demo 1: Listing Repository Files ===');
  
  try {
    // Example 1: List all files in a repository
    console.log('\n1. Listing all files in microsoft/vscode repository:');
    const allFiles = await githubReader.listRepoFiles('microsoft', 'vscode', '', 'main');
    console.log(`Found ${allFiles.length} files total`);
    console.log('First 5 files:', allFiles.slice(0, 5).map(f => ({ name: f.name, path: f.path, size: f.size })));
    
    // Example 2: List only JavaScript files
    console.log('\n2. Listing only JavaScript files:');
    const jsFiles = await githubReader.listRepoFiles('microsoft', 'vscode', '', 'main', ['.js', '.ts']);
    console.log(`Found ${jsFiles.length} JS/TS files`);
    console.log('First 5 JS/TS files:', jsFiles.slice(0, 5).map(f => ({ name: f.name, path: f.path, extension: f.extension })));
    
    // Example 3: List files in a specific directory
    console.log('\n3. Listing files in src directory:');
    const srcFiles = await githubReader.listRepoFiles('microsoft', 'vscode', 'src', 'main', ['.ts']);
    console.log(`Found ${srcFiles.length} TypeScript files in src directory`);
    console.log('First 3 src files:', srcFiles.slice(0, 3).map(f => ({ name: f.name, path: f.path })));
    
  } catch (error) {
    console.error('Error in demonstrateListRepoFiles:', error.message);
  }
}

/**
 * Demo 2: Fetch Repository File Content
 * This function demonstrates how to fetch the content of specific files
 * from a GitHub repository.
 */
async function demonstrateFetchRepoFile() {
  console.log('\n=== Demo 2: Fetching Repository File Content ===');
  
  try {
    // Example 1: Fetch README file
    console.log('\n1. Fetching README.md from facebook/react:');
    const readmeFile = await githubReader.fetchRepoFile('facebook', 'react', 'README.md');
    if (readmeFile) {
      console.log('README info:', {
        name: readmeFile.name,
        path: readmeFile.path,
        size: readmeFile.size,
        contentPreview: readmeFile.content.substring(0, 200) + '...'
      });
    }
    
    // Example 2: Fetch package.json
    console.log('\n2. Fetching package.json from facebook/react:');
    const packageFile = await githubReader.fetchRepoFile('facebook', 'react', 'package.json');
    if (packageFile) {
      console.log('package.json info:', {
        name: packageFile.name,
        size: packageFile.size,
        contentPreview: packageFile.content.substring(0, 300) + '...'
      });
      
      // Parse JSON content for demonstration
      try {
        const packageData = JSON.parse(packageFile.content);
        console.log('Package name:', packageData.name);
        console.log('Package version:', packageData.version);
        console.log('Package description:', packageData.description);
      } catch (parseError) {
        console.log('Could not parse package.json content');
      }
    }
    
    // Example 3: Fetch a source file
    console.log('\n3. Fetching a source file from the repository:');
    const sourceFile = await githubReader.fetchRepoFile('facebook', 'react', 'packages/react/index.js');
    if (sourceFile) {
      console.log('Source file info:', {
        name: sourceFile.name,
        path: sourceFile.path,
        size: sourceFile.size,
        firstFewLines: sourceFile.content.split('\n').slice(0, 5).join('\n')
      });
    }
    
  } catch (error) {
    console.error('Error in demonstrateFetchRepoFile:', error.message);
  }
}

/**
 * Demo 3: Find Businesses on GitHub
 * This function demonstrates how to search for businesses and organizations
 * on GitHub using various criteria.
 */
async function demonstrateFindBusinesses() {
  console.log('\n=== Demo 3: Finding Businesses on GitHub ===');
  
  try {
    // Example 1: Find businesses in the AI industry
    console.log('\n1. Finding businesses in AI industry:');
    const aiBusinesses = await githubReader.findBusinesses({
      industry: 'artificial-intelligence',
      minStars: 1000,
      limit: 5
    });
    console.log(`Found ${aiBusinesses.length} AI-related businesses/organizations`);
    aiBusinesses.slice(0, 3).forEach((business, index) => {
      console.log(`${index + 1}. ${business.name || business.username}`);
      console.log(`   Type: ${business.type}`);
      console.log(`   Description: ${business.description || 'No description'}`);
      console.log(`   Location: ${business.location || 'Not specified'}`);
      console.log(`   Website: ${business.website || 'None'}`);
      console.log(`   Public Repos: ${business.public_repos}`);
      console.log(`   Top repositories: ${business.repositories.slice(0, 2).map(r => r.name).join(', ')}`);
      console.log('---');
    });
    
    // Example 2: Find JavaScript-focused companies
    console.log('\n2. Finding JavaScript-focused companies:');
    const jsBusinesses = await githubReader.findBusinesses({
      technology: 'JavaScript',
      minStars: 500,
      limit: 3
    });
    console.log(`Found ${jsBusinesses.length} JavaScript-focused businesses`);
    jsBusinesses.forEach((business, index) => {
      console.log(`${index + 1}. ${business.name || business.username} (${business.public_repos} public repos)`);
      console.log(`   Most starred repo: ${business.repositories[0]?.name} (${business.repositories[0]?.stars} stars)`);
    });
    
    // Example 3: Find companies by location
    console.log('\n3. Finding companies in San Francisco:');
    const sfBusinesses = await githubReader.findBusinesses({
      location: 'San Francisco',
      limit: 3
    });
    console.log(`Found ${sfBusinesses.length} businesses in San Francisco`);
    sfBusinesses.forEach((business, index) => {
      console.log(`${index + 1}. ${business.name || business.username}`);
      console.log(`   Description: ${business.description || 'No description'}`);
      console.log(`   Followers: ${business.followers}`);
    });
    
    // Example 4: Search for specific company
    console.log('\n4. Searching for specific company (Google):');
    const googleRepos = await githubReader.findBusinesses({
      company: 'Google',
      minStars: 100,
      limit: 2
    });
    console.log(`Found ${googleRepos.length} Google-related organizations`);
    googleRepos.forEach((business, index) => {
      console.log(`${index + 1}. ${business.name || business.username}`);
      console.log(`   URL: ${business.url}`);
      console.log(`   Notable repositories:`);
      business.repositories.slice(0, 3).forEach(repo => {
        console.log(`     - ${repo.name} (${repo.stars} stars) - ${repo.description || 'No description'}`);
      });
    });
    
  } catch (error) {
    console.error('Error in demonstrateFindBusinesses:', error.message);
  }
}

/**
 * Bonus Demo: Advanced Repository Analysis
 * This demonstrates combining multiple functions for comprehensive analysis
 */
async function demonstrateAdvancedAnalysis() {
  console.log('\n=== Bonus Demo: Advanced Repository Analysis ===');
  
  try {
    // Pick a popular repository for analysis
    const owner = 'vercel';
    const repo = 'next.js';
    
    console.log(`\nAnalyzing ${owner}/${repo}...`);
    
    // 1. Get repository file structure
    const files = await githubReader.listRepoFiles(owner, repo, '', 'main', ['.js', '.ts', '.json']);
    console.log(`\nRepository has ${files.length} JavaScript/TypeScript/JSON files`);
    
    // 2. Get configuration files
    const packageJson = await githubReader.fetchRepoFile(owner, repo, 'package.json');
    if (packageJson) {
      const packageData = JSON.parse(packageJson.content);
      console.log(`\nProject: ${packageData.name} v${packageData.version}`);
      console.log(`Description: ${packageData.description}`);
      console.log(`Dependencies: ${Object.keys(packageData.dependencies || {}).length}`);
      console.log(`Dev Dependencies: ${Object.keys(packageData.devDependencies || {}).length}`);
    }
    
    // 3. Analyze file types
    const fileTypes = {};
    files.forEach(file => {
      const ext = file.extension || 'unknown';
      fileTypes[ext] = (fileTypes[ext] || 0) + 1;
    });
    console.log('\nFile type distribution:');
    Object.entries(fileTypes).forEach(([ext, count]) => {
      console.log(`  ${ext}: ${count} files`);
    });
    
    // 4. Find README and documentation
    const readme = await githubReader.fetchRepoFile(owner, repo, 'README.md');
    if (readme) {
      const lines = readme.content.split('\n');
      console.log(`\nREADME has ${lines.length} lines`);
      console.log('First paragraph:', lines.find(line => line.trim().length > 0));
    }
    
  } catch (error) {
    console.error('Error in demonstrateAdvancedAnalysis:', error.message);
  }
}

/**
 * Main demo runner
 * Executes all demonstration functions in sequence
 */
async function runAllDemos() {
  console.log('🚀 GitHub Agent Demo Starting...');
  console.log('This demo shows how to use the GitHubReader module for agent-powered research.');
  console.log('Make sure you have set your GITHUB_TOKEN environment variable!');
  
  try {
    // Run all demonstration functions
    await demonstrateListRepoFiles();
    await demonstrateFetchRepoFile();
    await demonstrateFindBusinesses();
    await demonstrateAdvancedAnalysis();
    
    console.log('\n✅ All demos completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Set your GitHub token: export GITHUB_TOKEN="your_token_here"');
    console.log('2. Run this demo: node githubAgentDemo.js');
    console.log('3. Customize the examples for your specific use case');
    console.log('4. Integrate with your AI agent for automated research');
    
  } catch (error) {
    console.error('❌ Demo failed:', error.message);
    console.log('\nTroubleshooting:');
    console.log('1. Make sure your GitHub token is set and valid');
    console.log('2. Check your internet connection');
    console.log('3. Verify the repository names and paths are correct');
  }
}

// Export functions for individual testing
module.exports = {
  demonstrateListRepoFiles,
  demonstrateFetchRepoFile,
  demonstrateFindBusinesses,
  demonstrateAdvancedAnalysis,
  runAllDemos
};

// Run all demos if this file is executed directly
if (require.main === module) {
  runAllDemos();
}
