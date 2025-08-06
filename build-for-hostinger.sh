#!/bin/bash

echo "🚀 Building AeThex for Hostinger deployment..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist/

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building client application..."
npm run build:client

# Copy .htaccess to dist folder
echo "📋 Adding .htaccess for SPA routing..."
cp .htaccess dist/spa/

# Create deployment info
echo "📄 Creating deployment info..."
cat > dist/spa/deployment-info.txt << EOF
AeThex Application - Hostinger Deployment
Built on: $(date)
Version: $(git rev-parse --short HEAD 2>/dev/null || echo "unknown")
Environment: Production

Upload the contents of this folder to your Hostinger public_html directory.
EOF

echo "✅ Build complete!"
echo ""
echo "📁 Files ready for upload in: dist/spa/"
echo "🌐 Upload all contents to your Hostinger public_html folder"
echo "�� Make sure to configure your environment variables"
echo ""
echo "Next steps:"
echo "1. Upload dist/spa/* to Hostinger public_html"
echo "2. Configure DNS: core.aethex.biz → your Hostinger IP"
echo "3. Test at https://core.aethex.biz"
