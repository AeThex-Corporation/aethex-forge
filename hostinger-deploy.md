# Deploying AeThex to Hostinger

## **Step 1: Build Your Application**

Run these commands in your local project directory:

```bash
# Install dependencies
npm install

# Build the client-side application
npm run build:client
```

This creates a `dist/spa` folder with your built application.

## **Step 2: Prepare Environment Variables**

Create a `.env.production` file with your Supabase credentials:

```env
VITE_SUPABASE_URL=https://kmdeisowhtsalsekkzqd.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Then rebuild with production environment:

```bash
npm run build:client
```

## **Step 3: Upload to Hostinger**

1. **Access Hostinger File Manager:**

   - Login to your Hostinger control panel
   - Go to "File Manager"
   - Navigate to `public_html` folder

2. **Upload Files:**
   - Upload ALL contents of `dist/spa` folder to `public_html`
   - Your file structure should look like:
     ```
     public_html/
     ├── index.html
     ├── assets/
     │   ├── index-[hash].js
     │   ├── index-[hash].css
     │   └── ...
     ├── placeholder.svg
     └── robots.txt
     ```

## **Step 4: Configure DNS for core.aethex.biz**

### Option A: Use Hostinger DNS (Recommended)

1. In Hostinger control panel, go to DNS Zone Editor
2. Update/Add these records:
   ```
   Type: A
   Name: core
   Value: [Your Hostinger server IP]
   TTL: 3600
   ```

### Option B: Update at Domain Registrar

1. Go to your domain registrar (where you bought aethex.biz)
2. Update DNS to point `core.aethex.biz` to your Hostinger hosting

## **Step 5: Configure SPA Routing**

Create `.htaccess` file in `public_html` to handle React Router:

```apache
RewriteEngine On
RewriteBase /

# Handle Angular and React requests
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Cache static assets
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
</IfModule>
```

## **Step 6: Test Your Deployment**

1. Wait 5-15 minutes for DNS propagation
2. Visit `https://core.aethex.biz`
3. Test login functionality
4. Verify Supabase connection works

## **Step 7: Optional - API Functions**

Your current Netlify functions won't work on Hostinger. You have two options:

### Option A: Remove Server Functions (Simplest)

Since you're using Supabase, you may not need the Express server. Simply remove server-side code.

### Option B: Use Hostinger Node.js Hosting

If you need server functions:

1. Upgrade to Hostinger plan that supports Node.js
2. Deploy your Express server separately
3. Update API endpoints in your React app

## **Benefits of Hostinger vs Netlify:**

✅ **Direct DNS control** - No more DNS propagation issues  
✅ **Better domain management** - Full control over core.aethex.biz  
✅ **Lower cost** - Often cheaper than Netlify Pro  
✅ **Traditional hosting** - More familiar cPanel interface

## **Potential Issues & Solutions:**

**Issue:** API functions not working  
**Solution:** Use Supabase Edge Functions or upgrade to Node.js hosting

**Issue:** Environment variables not loading  
**Solution:** Ensure VITE\_ prefix and rebuild application

**Issue:** 404 errors on routes  
**Solution:** Ensure .htaccess file is uploaded and configured

## **Rollback Plan:**

If issues occur, you can quickly revert:

1. Update DNS back to Netlify
2. Your Netlify deployment remains active
3. Switch takes 5-15 minutes
