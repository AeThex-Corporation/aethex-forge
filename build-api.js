#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import * as esbuild from "esbuild";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log("Building API routes for Vercel with esbuild...");

const srcApi = path.resolve(__dirname, "api");
const destApi = path.resolve(__dirname, "..", "api");

// Ensure destination exists
if (fs.existsSync(destApi)) {
  fs.rmSync(destApi, { recursive: true, force: true });
}
fs.mkdirSync(destApi, { recursive: true });

// Find all TypeScript files in src/api
const tsFiles = [];

function findTsFiles(dir, prefix = "") {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      findTsFiles(fullPath, prefix + entry.name + "/");
    } else if (entry.name.endsWith(".ts") && !entry.name.endsWith(".d.ts")) {
      tsFiles.push(fullPath);
    }
  }
}

findTsFiles(srcApi);

if (tsFiles.length === 0) {
  console.log("No TypeScript files found");
  process.exit(0);
}

console.log(`Found ${tsFiles.length} TypeScript files`);

// Build each file separately to preserve structure
async function buildAll() {
  for (const tsFile of tsFiles) {
    const relativePath = path.relative(srcApi, tsFile);
    const outFile = path.join(destApi, relativePath.replace(/\.ts$/, ".js"));
    const outDir = path.dirname(outFile);

    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

    try {
      await esbuild.build({
        entryPoints: [tsFile],
        outfile: outFile,
        platform: "node",
        target: "es2020",
        format: "esm",
        external: ["@supabase/supabase-js", "nodemailer", "stripe", "ethers"],
        bundle: false,
        sourcemap: false,
        logLevel: "silent",
      });
      console.log(`✓ ${relativePath}`);
    } catch (error) {
      console.error(`✗ Failed to build ${relativePath}:`, error.message);
      process.exit(1);
    }
  }
}

await buildAll();
console.log(`\n✓ API build complete! ${tsFiles.length} files compiled.`);
