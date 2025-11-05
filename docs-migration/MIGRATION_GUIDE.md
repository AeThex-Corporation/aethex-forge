# AeThex Documentation Migration Guide

## Overview

This guide explains how to migrate the AeThex documentation from the React-based local docs system to Gitbook.

## Migration Structure

The migration package includes:

1. **Markdown Files** - 9 documentation pages in Markdown format
2. **JSON Structure** - Structured data for programmatic import
3. **Implementation Guide** - Instructions for local fallback system
4. **Gitbook API Guide** - How to push content to Gitbook

### Files Included

```
code/docs-migration/
├── 01-overview.md           # Welcome to AeThex Documentation
├── 02-getting-started.md    # Getting Started
├── 03-platform.md           # Platform Guide
├── 04-api-reference.md      # API Reference
├── 05-tutorials.md          # Tutorials
├── 06-cli.md                # CLI Tools
├── 07-examples.md           # Code Examples
├── 08-integrations.md       # Integrations
├── 09-curriculum.md         # Curriculum
├── MIGRATION_GUIDE.md       # This file
├── docs-structure.json      # Gitbook structure definition
├── migration-implementation.ts # Implementation helper
└── gitbook-api-script.js    # Script to push to Gitbook
```

## Step 1: Prepare Gitbook Workspace

1. Go to your Gitbook workspace "AeThex Docs"
2. Create a new space or use existing one
3. Create the following page structure:
   - Overview
   - Getting Started
   - Platform
   - API Reference
   - Tutorials
   - CLI Tools
   - Code Examples
   - Integrations
   - Curriculum

## Step 2: Import Markdown Content

### Option A: Manual Import

1. Open each Markdown file
2. Copy the content
3. Paste into corresponding Gitbook page
4. Format as needed (Gitbook handles most Markdown automatically)

### Option B: Gitbook Import API

Use the Gitbook API to programmatically import content:

```bash
# Set up environment variables
export GITBOOK_API_TOKEN=gb_api_jORqpp2qlvg7pwlPiIKHAbgcFIDJBIJ1pz09WpIg
export GITBOOK_SPACE_ID=your-space-id

# Run the sync script
node code/docs-migration/gitbook-api-script.js sync
```

## Step 3: Set Up Fallback System (Local)

Keep your local React docs as a fallback while you confirm everything is synced:

### Update DocsLayout.tsx

Add a banner and fallback behavior:

```typescript
<div className="mb-4 rounded-lg border border-yellow-500/40 bg-yellow-900/20 p-4">
  <p className="text-sm text-yellow-200">
    📚 These docs are being migrated to Gitbook.
    <a href="https://docs.aethex.tech" className="underline">
      View the latest version →
    </a>
  </p>
</div>
```

### Add Gitbook Embed (Optional)

For seamless integration, embed Gitbook content directly:

```typescript
<iframe
  src="https://docs.aethex.tech/your-page"
  style={{ width: '100%', height: '100vh', border: 'none' }}
  title="AeThex Documentation"
/>
```

## Step 4: Update Navigation Links

Update your app to link to Gitbook:

1. Keep internal `/docs/*` routes during transition
2. Update external links to point to Gitbook: `https://docs.aethex.tech`
3. Monitor analytics to track transition

## Step 5: Verify Content Migration

### Checklist

- [ ] All 9 sections present in Gitbook
- [ ] Code examples render correctly
- [ ] Tables display properly
- [ ] Links work (may need to update internal links)
- [ ] Images and assets load
- [ ] Navigation structure matches original
- [ ] Search functionality works

### Testing

1. Visit each page in Gitbook
2. Test links and navigation
3. Verify code snippets are highlighted correctly
4. Check mobile responsiveness
5. Test search functionality

## Step 6: Update Internal Links

Before fully migrating, update links throughout your app:

### Links to Update

1. Header navigation: `/docs` → `https://docs.aethex.tech`
2. Footer links
3. In-content links
4. Breadcrumbs
5. Cards and CTAs

## Step 7: Set Up API Sync (Optional)

For automated updates, set up periodic syncs using the Gitbook API and GitHub Actions.

## Step 8: Monitor and Adjust

1. **Week 1-2:** Keep both systems active

   - Local React docs as primary
   - Gitbook as secondary
   - Gather user feedback

2. **Week 3-4:** Switch primary to Gitbook

   - Update all links to point to Gitbook
   - Keep local docs as fallback redirect

3. **Week 5+:** Full migration complete
   - Remove local docs pages (or archive)
   - Update all documentation links

## Rollback Plan

If issues arise, you can quickly rollback:

1. Revert link changes
2. Keep local docs active
3. Fix issues in Gitbook
4. Re-attempt migration when ready

## API Credentials

Your Gitbook API token has been provided:

- **API Token:** gb_api_jORqpp2qlvg7pwlPiIKHAbgcFIDJBIJ1pz09WpIg
- **Space Name:** AeThex Docs

Store these securely as environment variables.

## Quick Start Commands

```bash
# 1. Install dependencies (if needed)
npm install

# 2. Sync documentation to Gitbook
export GITBOOK_API_TOKEN=gb_api_jORqpp2qlvg7pwlPiIKHAbgcFIDJBIJ1pz09WpIg
export GITBOOK_SPACE_ID=your-space-id
node code/docs-migration/gitbook-api-script.js sync

# 3. Verify all pages migrated
node code/docs-migration/gitbook-api-script.js validate

# 4. List all pages in workspace
node code/docs-migration/gitbook-api-script.js list
```

## Next Steps

1. Find your Gitbook Space ID from Gitbook settings
2. Run the sync script to push content
3. Verify content in Gitbook
4. Update your app links as needed
5. Monitor usage during transition period
