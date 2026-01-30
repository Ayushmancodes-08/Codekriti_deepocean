import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "ES2020",
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: mode === "production",
      },
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks - Core dependencies
          if (id.includes("node_modules/react") && !id.includes("react-hook-form")) {
            return "vendor-react";
          }
          
          // UI and form libraries
          if (id.includes("node_modules/@radix-ui")) {
            return "vendor-radix-ui";
          }
          if (id.includes("node_modules/react-hook-form") || id.includes("node_modules/zod")) {
            return "vendor-forms";
          }
          
          // Animation library
          if (id.includes("node_modules/framer-motion")) {
            return "vendor-framer-motion";
          }
          
          // Router
          if (id.includes("node_modules/react-router")) {
            return "vendor-router";
          }
          
          // Query library
          if (id.includes("node_modules/@tanstack/react-query")) {
            return "vendor-query";
          }
          
          // Other utilities
          if (id.includes("node_modules/lucide-react") || id.includes("node_modules/sonner")) {
            return "vendor-utils";
          }
          
          // Registration Components - Lazy loaded, separate chunk
          if (id.includes("components/RegistrationFlow") || 
              id.includes("components/SingleParticipantForm") || 
              id.includes("components/TeamMembersForm") || 
              id.includes("components/TeamDetailsForm") ||
              id.includes("components/EventSelection")) {
            return "chunk-registration";
          }
          
          // Media Components - Lazy loaded
          if (id.includes("components/VideoOptimization") || 
              id.includes("components/ResponsiveImage") ||
              id.includes("components/VideoBackground")) {
            return "chunk-media";
          }
          
          // Contexts and hooks
          if (id.includes("contexts/") || id.includes("hooks/")) {
            return "chunk-state";
          }
        },
      },
    },
    chunkSizeWarningLimit: 500,
    reportCompressedSize: true,
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "framer-motion",
      "react-hook-form",
      "zod",
    ],
  },
}));
