import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    ViteImageOptimizer({
      png: { quality: 80 },
      jpeg: { quality: 80 },
      webp: { quality: 80, lossless: true },
      avif: { quality: 70, lossless: true },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "ES2020",
    minify: "terser",
    cssMinify: true,
    cssCodeSplit: true,
    terserOptions: {
      compress: {
        drop_console: mode === "production",
        drop_debugger: true,
        pure_funcs: mode === "production" ? ['console.log', 'console.info', 'console.debug'] : [],
      },
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Core React - smallest possible chunk, cached aggressively
          if (id.includes("node_modules/react/") || id.includes("node_modules/react-dom/") || id.includes("node_modules/scheduler/")) {
            if (!id.includes("react-hook-form") && !id.includes("react-router")) {
              return "vendor-react";
            }
          }

          // Radix UI component primitives
          if (id.includes("node_modules/@radix-ui")) {
            return "vendor-radix-ui";
          }

          // Forms
          if (id.includes("node_modules/react-hook-form") || id.includes("node_modules/zod")) {
            return "vendor-forms";
          }

          // Animation library (large — keep isolated)
          if (id.includes("node_modules/framer-motion")) {
            return "vendor-framer-motion";
          }

          // Router
          if (id.includes("node_modules/react-router")) {
            return "vendor-router";
          }

          // Data fetching
          if (id.includes("node_modules/@tanstack/react-query")) {
            return "vendor-query";
          }

          // Icons — lucide-react is large, isolate so it's cached separately
          if (id.includes("node_modules/lucide-react")) {
            return "vendor-icons";
          }

          // Supabase — admin-only, keep out of main bundle
          if (id.includes("node_modules/@supabase") || id.includes("node_modules/supabase")) {
            return "vendor-supabase";
          }

          // Notifications
          if (id.includes("node_modules/sonner")) {
            return "vendor-utils";
          }

          // Registration flow — lazy loaded, separate chunk
          if (
            id.includes("components/RegistrationFlow") ||
            id.includes("components/SingleParticipantForm") ||
            id.includes("components/TeamMembersForm") ||
            id.includes("components/TeamDetailsForm") ||
            id.includes("components/EventSelection")
          ) {
            return "chunk-registration";
          }

          // Media — lazy loaded
          if (
            id.includes("components/VideoOptimization") ||
            id.includes("components/ResponsiveImage") ||
            id.includes("components/VideoBackground")
          ) {
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
