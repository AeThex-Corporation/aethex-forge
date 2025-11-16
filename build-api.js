#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log("Preparing API files for Vercel...");

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
    } else if (!entry.name.startsWith(".")) {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

console.log(`Copying API files from ${srcApi}...`);
copyDir(srcApi, destApi);
console.log(`✓ Copied to ${destApi}`);
console.log("Vercel will compile and serve TypeScript files.");
