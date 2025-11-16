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
    { cwd: __dirname, stdio: "inherit" }
  );
  console.log("✓ Transpiled to JavaScript");
} catch (error) {
  console.error("Transpilation error (continuing):", error.message);
}

// Step 3: Fix ESM imports by adding .js extensions to relative imports
console.log("Step 3: Fixing ESM module imports...");
let fixedCount = 0;

function fixImportsInDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      fixImportsInDir(fullPath);
    } else if (entry.name.endsWith(".js")) {
      let content = fs.readFileSync(fullPath, "utf-8");
      
      // Fix relative imports for ESM: "../../_supabase" -> "../../_supabase.js"
      let fixedContent = content.replace(
        /from\s+"(\.\.?\/[^"]+)"/g,
        (match, importPath) => {
          if (importPath.endsWith(".js")) return match;
          return `from "${importPath}.js"`;
        }
      );
      
      fixedContent = fixedContent.replace(
        /from\s+'(\.\.?\/[^']+)'/g,
        (match, importPath) => {
          if (importPath.endsWith(".js")) return match;
          return `from '${importPath}.js'`;
        }
      );
      
      if (fixedContent !== content) {
        fs.writeFileSync(fullPath, fixedContent);
        fixedCount++;
      }
    }
  }
}

fixImportsInDir(destApi);
console.log(`✓ Fixed ESM imports in ${fixedCount} files`);

console.log("\n✓ API build complete! Vercel will serve the JavaScript files.");
