#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function processDir(src, dest, processFile) {
  if (!fs.existsSync(src)) {
    console.warn(`Source directory not found: ${src}`);
    return;
  }

  if (fs.existsSync(dest)) {
    fs.rmSync(dest, { recursive: true, force: true });
  }

  fs.mkdirSync(dest, { recursive: true });

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      processDir(srcPath, destPath, processFile);
    } else {
      processFile(srcPath, destPath);
    }
  }
}

function copyFile(src, dest) {
  fs.copyFileSync(src, dest);
}

function processAndCopyFile(src, dest) {
  let content = fs.readFileSync(src, "utf-8");

  // Fix relative imports to include .ts extension for Vercel
  // This helps Node.js module resolution work correctly at runtime
  if (src.endsWith(".ts")) {
    // Add .ts extension to relative imports if not already present
    content = content.replace(
      /from\s+['"](\.[^'"]*?)(?<!\.ts)(['"])/g,
      'from "$1.ts"$2'
    );

    // Also handle import statements
    content = content.replace(
      /import\s+([^'"]*?)\s+from\s+['"](\.[^'"]*?)(?<!\.ts)(['"])/g,
      'import $1 from "$2.ts"$3'
    );
  }

  // Copy the original TypeScript file
  fs.copyFileSync(src, dest);

  // Also create a .js version by replacing imports
  if (src.endsWith(".ts") && !src.endsWith(".d.ts")) {
    const jsPath = dest.replace(/\.ts$/, ".js");
    // For .js files, remove .ts extensions from imports
    const jsContent = content.replace(
      /from\s+['"](\.[^'"]*?)\.ts(['"])/g,
      'from "$1.js"$2'
    );
    fs.writeFileSync(jsPath, jsContent);
  }
}

// When this file is at code/copy-api.js:
// __dirname = code/
// srcApi = code/api
// destApi = .../api (at root)
const srcApi = path.resolve(__dirname, "api");
const destApi = path.resolve(__dirname, "..", "api");

console.log(`Processing API files from ${srcApi} to ${destApi}...`);
processDir(srcApi, destApi, processAndCopyFile);
console.log(`✓ API files processed and copied to ${destApi}`);
