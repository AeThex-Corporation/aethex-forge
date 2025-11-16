#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function copyDir(src, dest) {
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
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }

  console.log(`✓ Copied ${src} to ${dest}`);
}

// When this file is at code/copy-api.js:
// __dirname = code/
// srcApi = code/api
// destApi = .../api (at root)
const srcApi = path.resolve(__dirname, "api");
const destApi = path.resolve(__dirname, "..", "api");

copyDir(srcApi, destApi);

// Compile TypeScript files to JavaScript for Vercel
try {
  console.log("Transpiling TypeScript API files...");
  const tscPath = path.resolve(__dirname, "node_modules/.bin/tsc");

  // Use tsx to transpile the API directory
  execSync(`npx tsx --eval "
const ts = require('typescript');
const path = require('path');
const fs = require('fs');

function transpileDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      transpileDir(fullPath);
    } else if (entry.name.endsWith('.ts') && !entry.name.endsWith('.d.ts')) {
      const source = fs.readFileSync(fullPath, 'utf-8');
      const result = ts.transpileModule(source, {
        compilerOptions: {
          module: ts.ModuleKind.ES2020,
          target: ts.ScriptTarget.ES2020
        }
      });
      const jsPath = fullPath.replace(/\.ts$/, '.js');
      fs.writeFileSync(jsPath, result.outputText);
      console.log('✓ Transpiled', fullPath, 'to', jsPath);
    }
  }
}

transpileDir('${destApi}');
"`, { stdio: 'inherit' });

  console.log("✓ TypeScript transpilation complete");
} catch (error) {
  console.warn("Note: TypeScript transpilation may not be necessary if using proper runtime");
  // Don't fail the build if transpilation fails
}
