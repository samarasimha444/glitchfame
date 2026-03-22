import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { analyzer } from "vite-bundle-analyzer";
import path from "path";

export default defineConfig({
  mode: "production", // ensures production optimizations
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
    tailwindcss(),

    // Bundle Analyzer
    analyzer({
      open: true,        // open the report automatically
      summaryOnly: false,
      gzipSize: true,
      brotliSize: true,
    }),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: false,       // disable source maps for production
    minify: "esbuild",      // fast esbuild minification
    cssMinify: true,
    chunkSizeWarningLimit: 1000,

    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            // Core libraries
            if (id.includes("react") || id.includes("react-dom")) return "react";
            if (id.includes("react-router-dom")) return "router";

            // State management / data libs
            if (id.includes("@tanstack/react-query")) return "query";

            // UI libraries
            if (id.includes("lucide-react")) return "icons";

            // fallback for other node_modules
            return "vendor";
          }
        },
      },
    },

    // Recommended: separate dynamic imports for pages/components
    // Example: React.lazy() on route-based components will auto create chunks
    rollupOptionsExperimental: {
      dynamicImportVarsOptions: {
        warnOnError: true
      }
    },
  },

  optimizeDeps: {
    // Optional: Pre-bundle commonly used dependencies for faster dev start
    include: ["react", "react-dom", "@tanstack/react-query"],
  },
});