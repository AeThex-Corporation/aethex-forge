#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log("Preparing API files for Vercel...");

const srcApi = path.resolve(__dirname, "api");
const destApi = path.resolve(__dirname, "..", "api");

// Files to exclude from API directory (utilities that shouldn't be handlers)
const excludeFiles = new Set([
  "_supabase.ts",
  "_cors.ts",
  "_notifications.ts",
  "opportunities.ts",
  "applications.ts",
]);

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
    } else if (!entry.name.startsWith(".") && !excludeFiles.has(entry.name)) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`  Copied: ${entry.name}`);
    } else if (excludeFiles.has(entry.name)) {
      console.log(`  Skipped (utility): ${entry.name}`);
    }
  }
}

console.log(`Copying API files from ${srcApi}...`);
copyDir(srcApi, destApi);
console.log(`✓ API files prepared for Vercel`);
