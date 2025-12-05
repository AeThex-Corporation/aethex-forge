# AeThex Desktop App - Release Guide

This guide covers building, signing, and distributing the AeThex Desktop application.

## Quick Start

### Prerequisites
- Node.js 20+
- npm or yarn
- For Windows builds: Windows 10/11
- For macOS builds: macOS 11+ with Xcode Command Line Tools
- For Linux builds: Ubuntu 20.04+ or equivalent

### Building Locally

```bash
# Install dependencies
npm install

# Build the desktop app (creates installers in ./dist)
npm run desktop:build
```

## Automated Builds (GitHub Actions)

The repository includes a GitHub Actions workflow that automatically builds for all platforms.

### Triggering a Release

1. **Tag a release:**
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

2. **Manual trigger:**
   Go to Actions > Build Desktop App > Run workflow

### Build Artifacts

After a successful build, artifacts are available:
- **Windows:** `AeThex Desktop Terminal-{version}-win-x64.exe`
- **macOS:** `AeThex Desktop Terminal-{version}-mac-{arch}.dmg`
- **Linux:** `AeThex Desktop Terminal-{version}-x64.AppImage`, `.deb`

## Code Signing

### Windows Code Signing

To sign Windows builds, you need a code signing certificate.

1. **Get a certificate:**
   - Purchase from DigiCert, Sectigo, or other CA
   - Or use Azure SignTool with Azure Key Vault

2. **Add GitHub Secrets:**
   ```
   WIN_CSC_LINK: Base64-encoded .pfx certificate
   WIN_CSC_KEY_PASSWORD: Certificate password
   ```

3. **Update electron-builder.yml:**
   ```yaml
   win:
     certificateFile: ${env.WIN_CSC_LINK}
     certificatePassword: ${env.WIN_CSC_KEY_PASSWORD}
   ```

### macOS Code Signing & Notarization

Apple requires apps to be signed and notarized for distribution.

1. **Prerequisites:**
   - Apple Developer Program membership ($99/year)
   - Developer ID Application certificate
   - App-specific password for notarization

2. **Add GitHub Secrets:**
   ```
   APPLE_ID: Your Apple ID email
   APPLE_APP_SPECIFIC_PASSWORD: Generated from appleid.apple.com
   APPLE_TEAM_ID: Your Team ID (from Developer Portal)
   CSC_LINK: Base64-encoded .p12 certificate
   CSC_KEY_PASSWORD: Certificate password
   ```

3. **Update GitHub workflow to include notarization:**
   ```yaml
   - name: Build and notarize
     run: npm run desktop:build
     env:
       APPLE_ID: ${{ secrets.APPLE_ID }}
       APPLE_APP_SPECIFIC_PASSWORD: ${{ secrets.APPLE_APP_SPECIFIC_PASSWORD }}
       APPLE_TEAM_ID: ${{ secrets.APPLE_TEAM_ID }}
       CSC_LINK: ${{ secrets.CSC_LINK }}
       CSC_KEY_PASSWORD: ${{ secrets.CSC_KEY_PASSWORD }}
   ```

4. **Update electron-builder.yml:**
   ```yaml
   mac:
     notarize:
       teamId: ${env.APPLE_TEAM_ID}
   ```

## Auto-Updates

The app is configured to check for updates from GitHub Releases.

### How it works:
1. User installs the app
2. On launch, app checks GitHub Releases for newer version
3. If found, prompts user to download and install

### Configuration

The `publish` section in `electron-builder.yml` configures the update server:

```yaml
publish:
  provider: github
  owner: aethex
  repo: aethex-desktop
  releaseType: release
```

### Testing Updates

1. Build version 1.0.0 and install
2. Push version 1.0.1 to GitHub Releases
3. Launch the app - it should detect and offer the update

## Customization

### App Icons

Replace files in `build/icons/`:
- `icon.ico` - Windows (256x256 multi-size)
- `icon.icns` - macOS (512x512 multi-size)
- `icon.png` - Linux (512x512)

See `build/icons/README.md` for conversion instructions.

### Installer Graphics

**Windows NSIS:**
- `build/installerHeader.bmp` - 150x57 pixels
- `build/installerSidebar.bmp` - 164x314 pixels

**macOS DMG:**
- `build/icons/icon.icns` - Volume icon
- (Optional) Add `build/dmg-background.png` (540x380 pixels) and update electron-builder.yml with `dmg.background: build/dmg-background.png`

### License

Add a `LICENSE` file to the root directory to display during Windows installation.

## Troubleshooting

### "App is damaged" on macOS
- App is not signed or notarized
- Run: `xattr -cr /Applications/AeThex\ Desktop\ Terminal.app`

### Windows SmartScreen warning
- App is not code-signed
- Users can click "More info" > "Run anyway"

### Linux AppImage won't run
```bash
chmod +x AeThex*.AppImage
./AeThex*.AppImage
```

### Build fails with "icon not found"
- Ensure `build/icons/icon.ico` exists for Windows builds
- Ensure `build/icons/icon.icns` exists for macOS builds

## Version Management

Update version in `package.json` before creating a release tag:

```json
{
  "version": "1.0.0"
}
```

The version is used in:
- Installer filename
- Auto-update checks
- About dialog
