# App Icons

This directory contains the application icons for the AeThex Desktop app.

## Required Files

| File | Platform | Size | Format |
|------|----------|------|--------|
| `icon.ico` | Windows | 256x256 (multi-size) | ICO |
| `icon.icns` | macOS | 512x512 (multi-size) | ICNS |
| `icon.png` | Linux | 512x512 | PNG |

## Converting from SVG

The `icon.svg` file is the source icon. Use one of these methods to generate platform-specific icons:

### Option 1: Online Converters
1. **ICO**: https://convertio.co/svg-ico/ or https://cloudconvert.com/svg-to-ico
2. **ICNS**: https://cloudconvert.com/svg-to-icns
3. **PNG**: Any image editor or https://svgtopng.com/

### Option 2: Command Line (requires ImageMagick)

```bash
# Install ImageMagick
# macOS: brew install imagemagick
# Ubuntu: sudo apt install imagemagick
# Windows: choco install imagemagick

# Generate PNG
convert -background none -resize 512x512 icon.svg icon.png

# Generate ICO (Windows)
convert -background none icon.svg -define icon:auto-resize=256,128,64,48,32,16 icon.ico

# For ICNS (macOS), use iconutil:
mkdir icon.iconset
sips -z 16 16 icon.png --out icon.iconset/icon_16x16.png
sips -z 32 32 icon.png --out icon.iconset/icon_16x16@2x.png
sips -z 32 32 icon.png --out icon.iconset/icon_32x32.png
sips -z 64 64 icon.png --out icon.iconset/icon_32x32@2x.png
sips -z 128 128 icon.png --out icon.iconset/icon_128x128.png
sips -z 256 256 icon.png --out icon.iconset/icon_128x128@2x.png
sips -z 256 256 icon.png --out icon.iconset/icon_256x256.png
sips -z 512 512 icon.png --out icon.iconset/icon_256x256@2x.png
sips -z 512 512 icon.png --out icon.iconset/icon_512x512.png
sips -z 1024 1024 icon.png --out icon.iconset/icon_512x512@2x.png
iconutil -c icns icon.iconset
rm -rf icon.iconset
```

### Option 3: electron-icon-builder (Recommended)

```bash
npm install -g electron-icon-builder
electron-icon-builder --input=icon.svg --output=./
```

## Replacing the Default Icon

1. Create your custom icon as a 512x512 or larger PNG/SVG
2. Convert to all three formats using the methods above
3. Replace the files in this directory
4. Rebuild the desktop app: `npm run desktop:build`
