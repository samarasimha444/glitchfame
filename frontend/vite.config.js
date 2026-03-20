import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
    tailwindcss(),
  ],

  build: {
    chunkSizeWarningLimit: 1000, 

    rollupOptions: {
      output: {
        manualChunks: {
          // core libs
          react: ["react", "react-dom"],
          router: ["react-router-dom"],

          // data & state
          query: ["@tanstack/react-query"],

          // UI libs
          icons: ["lucide-react"],

          // optional (add if used)
          // socket: ["socket.io-client"],
          // charts: ["recharts"],
        },
      },
    },
  },
});