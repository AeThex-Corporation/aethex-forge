import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    fs: {
      allow: ["./client", "./shared"],
      deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**", "server/**"],
    },
  },
  build: {
    outDir: "dist/spa",
  },
  plugins: [react(), expressPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
}));

function expressPlugin(): Plugin {
  let expressApp: any = null;

  return {
    name: "express-plugin",
    apply: "serve",
    async configureServer(server) {
      try {
        console.log("[Vite] Loading Express server...");
        const { createServer } = await import("./server");
        expressApp = createServer();
        console.log("[Vite] Express server created");

        // Return middleware hook that runs BEFORE Vite's default handlers
        return {
          pre: [
            {
              handler: expressApp,
              ident: "express-api",
            } as any,
          ],
        };
      } catch (e) {
        console.error("[Vite] Failed to load Express server:", e instanceof Error ? e.message : String(e));
        if (e instanceof Error && e.stack) {
          console.error(e.stack);
        }
        return {};
      }
    },
  };
}
