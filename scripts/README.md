# GitHub Issues Import Script

Automatically converts markdown issue documentation into GitHub Issues.

## Quick Start

### 1. Install Dependencies

```bash
npm install @octokit/rest
```

### 2. Get GitHub Token

1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Give it a name: "Issue Import Script"
4. Select scope: **`repo`** (full control of private repositories)
5. Click "Generate token"
6. Copy the token (you won't see it again!)

### 3. Set Token

```bash
export GITHUB_TOKEN=your_github_token_here
```

Or add to your shell profile (~/.bashrc, ~/.zshrc):
```bash
echo 'export GITHUB_TOKEN=your_token_here' >> ~/.bashrc
source ~/.bashrc
```

### 4. Run the Script

```bash
node scripts/import-github-issues.js
```

## What It Does

The script will:
1. ✅ Create all necessary labels (P0, P1, P2, bug, feature, etc.)
2. 📄 Parse `docs/issues/P0-ISSUES.md`, `P1-ISSUES.md`, `P2-ISSUES.md`
3. 🎯 Create GitHub Issues with:
   - Proper titles with priority prefix
   - Full issue body with formatting
   - Appropriate labels
   - Links to referenced files

4. 📊 Output summary with issue URLs

## Example Output

```
🚀 GitHub Issues Import Script

📝 Ensuring labels exist...
  ✓ Label "P0" exists
  ✓ Created label "P1"
  ✓ Created label "bug"

📄 Processing P0-ISSUES.md...
   Found 5 issues

  ✓ Created: [P0] Fix onboarding progress loss on page refresh
    → https://github.com/AeThex-Corporation/aethex-forge/issues/1
  ✓ Created: [P0] Complete Stripe payment integration
    → https://github.com/AeThex-Corporation/aethex-forge/issues/2
  ...

✅ Done! Created 25 GitHub issues

View issues: https://github.com/AeThex-Corporation/aethex-forge/issues
```

## Troubleshooting

### Error: GITHUB_TOKEN not set
```bash
export GITHUB_TOKEN=your_token_here
```

### Error: 404 Not Found
- Check that REPO_OWNER and REPO_NAME in the script match your repository
- Verify your token has `repo` scope

### Error: 403 Forbidden
- Your token doesn't have permission
- Generate a new token with `repo` scope

### Error: npm ERR! Cannot find module '@octokit/rest'
```bash
npm install @octokit/rest
```

## Customization

Edit `scripts/import-github-issues.js`:

```javascript
// Change repository
const REPO_OWNER = 'YourGitHubUsername';
const REPO_NAME = 'your-repo-name';

// Add custom labels
const LABELS = {
  P0: { name: 'P0', color: 'B60205', description: 'Critical' },
  // Add more...
};
```

## What Gets Created

### Labels
- **P0** (red) - Critical priority
- **P1** (orange) - Medium priority
- **P2** (yellow) - Low priority
- **bug** (red) - Something isn't working
- **feature** (green) - New feature
- **enhancement** (blue) - Enhancement
- **tech-debt** (purple) - Technical debt
- **security** (red) - Security issue

### Issues from P0-ISSUES.md
1. Fix onboarding progress loss (bug, P0)
2. Complete Stripe integration (bug, P0)
3. Refactor large components (tech-debt, P0)
4. Add error tracking (feature, P0)
5. Add form validation (feature, P0)

### Issues from P1-ISSUES.md
1. Build notification system (feature, P1)
2. Complete project workflows (feature, P1)
3. Add image upload (feature, P1)
4. Implement moderation (feature, P1)
5. Add 2FA (security, P1)

### Issues from P2-ISSUES.md
15 enhancement issues (dark mode, i18n, PWA, etc.)

## Advanced Usage

### Dry Run (Preview)
Edit the script and comment out the `createIssue` call to see what would be created:

```javascript
// await createIssue(issue);  // Comment this out
console.log('Would create:', issue.title);
```

### Assign Issues
Add assignees to created issues:

```javascript
await octokit.rest.issues.create({
  // ...existing params
  assignees: ['your-github-username'],
});
```

### Create Milestone
Group issues under a milestone:

```javascript
// Create milestone first
const milestone = await octokit.rest.issues.createMilestone({
  owner: REPO_OWNER,
  repo: REPO_NAME,
  title: 'Q1 2026 Priorities',
});

// Then assign to issues
await octokit.rest.issues.create({
  // ...existing params
  milestone: milestone.data.number,
});
```

## Clean Up

To delete all created issues (use with caution!):

```bash
# List all issues
gh issue list --limit 100

# Close specific issue
gh issue close <issue-number>

# Or delete (requires admin access)
gh api -X DELETE /repos/OWNER/REPO/issues/ISSUE_NUMBER
```

## Notes

- Script waits 1 second between creating issues to respect GitHub API rate limits
- Issues are created in order: P0 → P1 → P2
- Existing labels won't be overwritten
- Run as many times as needed (won't create duplicates if you don't re-run)
