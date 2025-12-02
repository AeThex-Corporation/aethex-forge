import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0",
    port: 5000,
    strictPort: true,
    allowedHosts: true,
    hmr: {
      clientPort: 5000,
    },
    fs: {
      allow: [path.resolve(__dirname, "./client"), path.resolve(__dirname, "./shared"), path.resolve(__dirname, "./node_modules"), path.resolve(__dirname)],
      deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**", "server/**", "api/**", "discord-bot/**"],
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
  return {
    name: "express-plugin",
    apply: "serve",
    async configureServer(server) {
      try {
        console.log("[Vite] Loading Express server...");
        const { createServer } = await import("./server");
        const app = createServer();
        console.log("[Vite] Express server created, mounting...");

        // Mount Express as middleware - this handles /api/* routes
        // Using unshift to add it to the beginning of the middleware chain
        server.middlewares.stack.unshift({
          route: "",
          handle: app,
        });

        console.log("[Vite] Express server mounted successfully");
      } catch (e) {
        console.error(
          "[Vite] Failed to load Express server:",
          e instanceof Error ? e.message : String(e),
        );
        if (e instanceof Error && e.stack) {
          console.error(e.stack);
        }
      }
    },
  };
}
