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
  return {
    name: "express-plugin",
    apply: "serve", // Only apply during development (serve mode)
    configureServer(server) {
      return () => {
        (async () => {
          try {
            console.log("[Vite] Loading Express server...");
            const { createServer } = await import("./server");
            const app = createServer();
            console.log("[Vite] Express server created, mounting to middleware...");
            server.middlewares.use(app);
            console.log("[Vite] Express server mounted successfully");
          } catch (e) {
            console.error("[Vite] Failed to start express middleware:", e instanceof Error ? e.message : String(e));
            if (e instanceof Error && e.stack) {
              console.error("[Vite] Stack:", e.stack);
            }
          }
        })();
      };
    },
  };
}
