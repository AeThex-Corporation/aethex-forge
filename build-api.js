#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log("Building API routes for Vercel...");

// Step 1: Copy TypeScript files from code/api to /api at root
console.log("Step 1: Copying TypeScript API files...");
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
console.log(`✓ TypeScript files copied to ${destApi}`);

// Step 2: Precompile TypeScript to JavaScript with proper ESM imports
console.log("Step 2: Transpiling to JavaScript with ESM imports...");
try {
  execSync(
    `npx esbuild "${destApi}/**/*.ts" --platform=node --target=es2020 --format=esm --outdir="${destApi}" --allow-overwrite`,
    { cwd: __dirname, stdio: "inherit" },
  );
  console.log("✓ Transpiled to JavaScript");
} catch (error) {
  console.error("Transpilation error (continuing):", error.message);
}

// Step 3: Fix ESM imports by adding .js extensions to relative imports
console.log("Step 3: Fixing ESM module imports...");
let fixedCount = 0;
let importFixedCount = 0;

function fixImportsInDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      fixImportsInDir(fullPath);
    } else if (entry.name.endsWith(".js")) {
      let content = fs.readFileSync(fullPath, "utf-8");
      let originalContent = content;

      // Pattern 1: import ... from "..."
      content = content.replace(
        /from\s+["'](\.[^"']+)["']/g,
        (match, importPath) => {
          if (
            importPath.endsWith(".js") ||
            importPath.endsWith(".json") ||
            importPath.includes("node_modules")
          ) {
            return match;
          }
          importFixedCount++;
          return `from "${importPath}.js"`;
        },
      );

      // Pattern 2: import("...")
      content = content.replace(
        /import\s*\(\s*["'](\.[^"']+)["']\s*\)/g,
        (match, importPath) => {
          if (
            importPath.endsWith(".js") ||
            importPath.endsWith(".json") ||
            importPath.includes("node_modules")
          ) {
            return match;
          }
          importFixedCount++;
          return `import("${importPath}.js")`;
        },
      );

      // Pattern 3: require("...")
      content = content.replace(
        /require\s*\(\s*["'](\.[^"']+)["']\s*\)/g,
        (match, importPath) => {
          if (
            importPath.endsWith(".js") ||
            importPath.endsWith(".json") ||
            importPath.includes("node_modules")
          ) {
            return match;
          }
          importFixedCount++;
          return `require("${importPath}.js")`;
        },
      );

      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content);
        fixedCount++;
        console.log(`  Fixed: ${path.relative(destApi, fullPath)}`);
      }
    }
  }
}

fixImportsInDir(destApi);
console.log(
  `✓ Fixed ESM imports in ${fixedCount} files (${importFixedCount} total imports)`,
);

// Step 4: Remove TypeScript files so Vercel doesn't recompile them
console.log("Step 4: Removing TypeScript source files...");
let removedCount = 0;

function removeTypeScriptFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      removeTypeScriptFiles(fullPath);
    } else if (entry.name.endsWith(".ts") && !entry.name.endsWith(".d.ts")) {
      fs.unlinkSync(fullPath);
      removedCount++;
    }
  }
}

removeTypeScriptFiles(destApi);
console.log(`✓ Removed ${removedCount} TypeScript files`);

console.log(
  "\n✓ API build complete! Vercel will serve the pre-compiled JavaScript files.",
);
