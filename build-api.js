#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log("Validating API setup for Vercel...");

const apiDir = path.resolve(__dirname, "api");

if (!fs.existsSync(apiDir)) {
  console.error("❌ API directory not found at", apiDir);
  process.exit(1);
}

const files = fs.readdirSync(apiDir);
console.log(`✓ Found API directory with ${files.length} entries`);
console.log("✓ Vercel will compile TypeScript files automatically");
