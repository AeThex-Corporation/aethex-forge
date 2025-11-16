#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Copy API files from code/api to /api at root
console.log("Copying API files for Vercel...");
const srcApi = path.resolve(__dirname, "api");
const destApi = path.resolve(__dirname, "..", "api");

function copyDir(src, dest) {
  if (fs.existsSync(dest)) {
    fs.rmSync(dest, { recursive: true, force: true });
  }
  fs.mkdirSync(dest, { recursive: true });

  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

copyDir(srcApi, destApi);
console.log(`✓ API files copied to ${destApi}`);
console.log("✓ Vercel will auto-detect and compile TypeScript files");
