#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// First, copy API files to root
console.log("Copying API files...");
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

// Now transpile TypeScript files to JavaScript using esbuild
console.log("Transpiling API routes to JavaScript...");
try {
  // Use esbuild to transpile all .ts files in the API directory
  execSync(
    `npx esbuild "${destApi}/**/*.ts" --platform=node --target=es2020 --format=esm --outdir="${destApi}" --allow-overwrite`,
    {
      cwd: __dirname,
      stdio: "inherit",
      env: { ...process.env, SKIP_TSC: "true" },
    }
  );
  console.log("✓ API routes transpiled successfully");
} catch (error) {
  console.error("Error transpiling API routes:", error.message);
}

// Fix ESM imports by adding .js extensions to relative imports
console.log("Fixing ESM imports...");
function fixImportsInDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      fixImportsInDir(fullPath);
    } else if (entry.name.endsWith(".js")) {
      let content = fs.readFileSync(fullPath, "utf-8");

      // Fix: import x from "../../_supabase" -> import x from "../../_supabase.js"
      // This regex matches relative imports without .js extension
      const fixedContent = content
        .replace(/from\s+["'](\.[^"']*?)(?<!\.js)(["'])/g, (match, path, quote) => {
          // Skip if it's already .js
          if (path.endsWith(".js")) {
            return match;
          }
          // Skip if it's a node_modules import
          if (!path.startsWith(".")) {
            return match;
          }
          return `from "${path}.js"${quote}`;
        });

      if (fixedContent !== content) {
        fs.writeFileSync(fullPath, fixedContent);
        console.log(`✓ Fixed imports in ${path.relative(destApi, fullPath)}`);
      }
    }
  }
}

fixImportsInDir(destApi);
console.log("✓ ESM imports fixed");
