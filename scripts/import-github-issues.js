#!/usr/bin/env node

/**
 * GitHub Issues Import Script
 *
 * Converts markdown issue documentation into GitHub Issues
 * Reads from docs/issues/ and creates issues with proper labels
 *
 * Usage:
 *   node scripts/import-github-issues.js
 *
 * Requirements:
 *   - GitHub Personal Access Token with repo scope
 *   - Set GITHUB_TOKEN environment variable
 *   - npm install @octokit/rest
 */

const fs = require('fs');
const path = require('path');
const { Octokit } = require('@octokit/rest');

// Configuration
const REPO_OWNER = 'AeThex-Corporation';
const REPO_NAME = 'aethex-forge';
const ISSUES_DIR = path.join(__dirname, '../docs/issues');

// Initialize Octokit
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

// Label definitions
const LABELS = {
  P0: { name: 'P0', color: 'B60205', description: 'Critical priority - fix ASAP' },
  P1: { name: 'P1', color: 'D93F0B', description: 'Medium priority' },
  P2: { name: 'P2', color: 'FBCA04', description: 'Low priority / nice to have' },
  bug: { name: 'bug', color: 'D73A4A', description: 'Something isn\'t working' },
  feature: { name: 'feature', color: '0E8A16', description: 'New feature or request' },
  enhancement: { name: 'enhancement', color: 'A2EEEF', description: 'Enhancement to existing feature' },
  'tech-debt': { name: 'tech-debt', color: 'D876E3', description: 'Technical debt' },
  security: { name: 'security', color: 'B60205', description: 'Security issue' },
  documentation: { name: 'documentation', color: '0075CA', description: 'Documentation improvements' },
};

/**
 * Parse markdown file into individual issues
 */
function parseMarkdownIssues(content, priority) {
  const issues = [];

  // Split by "## Issue" headings
  const sections = content.split(/^## Issue \d+:/m);

  // Skip the first section (it's the header before first issue)
  for (let i = 1; i < sections.length; i++) {
    const section = sections[i].trim();

    // Extract title (first line with brackets removed)
    const titleMatch = section.match(/^\[.*?\]\s*(.+?)$/m);
    if (!titleMatch) continue;

    const title = titleMatch[1].trim();

    // Extract labels from title
    const labels = [priority];
    if (title.toLowerCase().includes('fix') || section.includes('**Labels:** `bug`')) {
      labels.push('bug');
    } else if (section.includes('**Labels:** `feature`')) {
      labels.push('feature');
    } else if (section.includes('**Labels:** `enhancement`')) {
      labels.push('enhancement');
    } else if (section.includes('**Labels:** `tech-debt`')) {
      labels.push('tech-debt');
    } else if (section.includes('**Labels:** `security`')) {
      labels.push('security');
    }

    // Get the body (everything after the title line)
    const bodyStartIndex = section.indexOf('\n');
    const body = section.substring(bodyStartIndex).trim();

    issues.push({
      title: `[${priority}] ${title}`,
      body,
      labels,
    });
  }

  return issues;
}

/**
 * Ensure all labels exist in the repository
 */
async function ensureLabels() {
  console.log('📝 Ensuring labels exist...');

  for (const [key, label] of Object.entries(LABELS)) {
    try {
      await octokit.rest.issues.getLabel({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        name: label.name,
      });
      console.log(`  ✓ Label "${label.name}" exists`);
    } catch (error) {
      if (error.status === 404) {
        // Label doesn't exist, create it
        await octokit.rest.issues.createLabel({
          owner: REPO_OWNER,
          repo: REPO_NAME,
          name: label.name,
          color: label.color,
          description: label.description,
        });
        console.log(`  ✓ Created label "${label.name}"`);
      } else {
        throw error;
      }
    }
  }
}

/**
 * Create a single GitHub issue
 */
async function createIssue(issue) {
  try {
    const response = await octokit.rest.issues.create({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      title: issue.title,
      body: issue.body,
      labels: issue.labels,
    });

    console.log(`  ✓ Created: ${issue.title}`);
    console.log(`    → ${response.data.html_url}`);
    return response.data;
  } catch (error) {
    console.error(`  ✗ Failed to create: ${issue.title}`);
    console.error(`    Error: ${error.message}`);
    throw error;
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 GitHub Issues Import Script\n');

  // Check for GitHub token
  if (!process.env.GITHUB_TOKEN) {
    console.error('❌ Error: GITHUB_TOKEN environment variable not set');
    console.error('\nTo fix this:');
    console.error('1. Go to https://github.com/settings/tokens');
    console.error('2. Create a Personal Access Token with "repo" scope');
    console.error('3. Run: export GITHUB_TOKEN=your_token_here');
    process.exit(1);
  }

  // Ensure labels exist
  await ensureLabels();
  console.log('');

  // Process each priority file
  const files = [
    { file: 'P0-ISSUES.md', priority: 'P0' },
    { file: 'P1-ISSUES.md', priority: 'P1' },
    { file: 'P2-ISSUES.md', priority: 'P2' },
  ];

  let totalCreated = 0;

  for (const { file, priority } of files) {
    const filePath = path.join(ISSUES_DIR, file);

    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️  File not found: ${file}`);
      continue;
    }

    console.log(`📄 Processing ${file}...`);

    const content = fs.readFileSync(filePath, 'utf8');
    const issues = parseMarkdownIssues(content, priority);

    console.log(`   Found ${issues.length} issues\n`);

    for (const issue of issues) {
      await createIssue(issue);
      totalCreated++;

      // Rate limiting: wait 1 second between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('');
  }

  console.log(`✅ Done! Created ${totalCreated} GitHub issues`);
  console.log(`\nView issues: https://github.com/${REPO_OWNER}/${REPO_NAME}/issues`);
}

// Run the script
main().catch((error) => {
  console.error('❌ Script failed:', error.message);
  process.exit(1);
});
