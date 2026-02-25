import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

/**
 * Makes the main Vite-injected CSS bundle non-blocking at build time.
 * Converts blocking <link rel="stylesheet"> → preload + onload swap.
 * A <noscript> fallback keeps CSS working without JS.
 */
function nonBlockingCssPlugin(): Plugin {
  return {
    name: 'non-blocking-css',
    apply: 'build',
    transformIndexHtml(html) {
      // Vite injects: <link rel="stylesheet" crossorigin href="/assets/index-XXXX.css">
      return html.replace(
        /(<link rel="stylesheet" crossorigin href="([^"]+\.css)"\s*\/>)/g,
        (_, _full, href) =>
          `<link rel="preload" as="style" href="${href}" onload="this.onload=null;this.rel='stylesheet'" />` +
          `<noscript><link rel="stylesheet" href="${href}" /></noscript>`
      );
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
    // Proxy /api/register to Supabase Edge Function during local dev
    // In production, Vercel's serverless function at /api/register.ts handles this
    proxy: {
      '/api/register': {
        target: 'https://iorulrnihsjouawhvcyt.supabase.co/functions/v1/register-team',
        changeOrigin: true,
        rewrite: () => '',
        timeout: 60000, // 60 second timeout for large image uploads
        headers: {
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvcnVscm5paHNqb3Vhd2h2Y3l0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwODQ3MTMsImV4cCI6MjA4NjY2MDcxM30.JmSmWlS3_xESGBc34SS0SIyLkLvJRMOZABWFwUXUkjs',
        },
      },
      '/api/admin/registrations': {
        target: 'https://iorulrnihsjouawhvcyt.supabase.co/rest/v1/registrations?select=*&order=created_at.desc',
        changeOrigin: true,
        rewrite: () => '',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvcnVscm5paHNqb3Vhd2h2Y3l0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwODQ3MTMsImV4cCI6MjA4NjY2MDcxM30.JmSmWlS3_xESGBc34SS0SIyLkLvJRMOZABWFwUXUkjs',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvcnVscm5paHNqb3Vhd2h2Y3l0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwODQ3MTMsImV4cCI6MjA4NjY2MDcxM30.JmSmWlS3_xESGBc34SS0SIyLkLvJRMOZABWFwUXUkjs',
        },
      },
      '/api/admin/action': {
        target: 'https://iorulrnihsjouawhvcyt.supabase.co/functions/v1/register-team',
        changeOrigin: true,
        rewrite: () => '',
        headers: {
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvcnVscm5paHNqb3Vhd2h2Y3l0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwODQ3MTMsImV4cCI6MjA4NjY2MDcxM30.JmSmWlS3_xESGBc34SS0SIyLkLvJRMOZABWFwUXUkjs',
        },
      },
    },
    // Pre-warm critical-path files so the first browser request is instant
    warmup: {
      clientFiles: [
        './src/main.tsx',
        './src/App.tsx',
        './src/pages/Index.tsx',
        './src/components/VideoBackground.tsx',
        './src/components/Navbar.tsx',
        './src/components/HeroSection.tsx',
      ],
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
    nonBlockingCssPlugin(),
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
        passes: 2,           // 2nd pass catches additional dead code
        unsafe_arrows: true, // arrow → shorthand — saves bytes
      },
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // ── Core React ──────────────────────────────────────────────────────
          if (
            (id.includes("node_modules/react/") ||
              id.includes("node_modules/react-dom/") ||
              id.includes("node_modules/scheduler/")) &&
            !id.includes("react-hook-form") &&
            !id.includes("react-router")
          ) {
            return "vendor-react";
          }

          // ── Radix UI: per-package split ─────────────────────────────────────
          // Each @radix-ui/react-* is independent — split them so only
          // packages actually imported on a page are downloaded.
          const radixMatch = id.match(/node_modules\/@radix-ui\/(react-[^/]+)/);
          if (radixMatch) {
            const pkg = radixMatch[1];
            // Core components used everywhere — group for fewer round-trips
            const coreGroup = ['react-dialog', 'react-tooltip', 'react-select',
              'react-checkbox', 'react-scroll-area', 'react-label', 'react-slot'];
            if (coreGroup.some(p => pkg === p)) {
              return 'vendor-radix-core';
            }
            return `vendor-radix-${pkg}`;
          }

          // ── Forms ──────────────────────────────────────────────────────────
          if (id.includes("node_modules/react-hook-form") || id.includes("node_modules/zod")) {
            return "vendor-forms";
          }

          // ── Framer Motion ────────────────────────────────────────────────
          if (id.includes("node_modules/framer-motion")) {
            return "vendor-framer-motion";
          }

          // ── Router ────────────────────────────────────────────────────────
          if (id.includes("node_modules/react-router")) {
            return "vendor-router";
          }

          // ── Data fetching ─────────────────────────────────────────────────
          if (id.includes("node_modules/@tanstack/react-query")) {
            return "vendor-query";
          }

          // ── Icons ─────────────────────────────────────────────────────────
          if (id.includes("node_modules/lucide-react")) {
            return "vendor-icons";
          }

          // ── Supabase (admin-only) ──────────────────────────────────────────
          if (id.includes("node_modules/@supabase") || id.includes("node_modules/supabase")) {
            return "vendor-supabase";
          }

          // ── Notifications ─────────────────────────────────────────────────
          if (id.includes("node_modules/sonner")) {
            return "vendor-utils";
          }

          // ── Registration flow (lazy loaded) ───────────────────────────────
          if (
            id.includes("components/registration") ||
            id.includes("components/SingleParticipantForm") ||
            id.includes("components/TeamMembersForm")
          ) {
            return "chunk-registration";
          }
        },
      },
    },
    chunkSizeWarningLimit: 500,
    reportCompressedSize: true,
  },
  optimizeDeps: {
    // Pre-bundle frequently-used deps at server start (not on first request)
    include: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "framer-motion",
      "react-hook-form",
      "zod",
      "react-router-dom",
      "@tanstack/react-query",
      "lucide-react",
      "sonner",
      "@radix-ui/react-dialog",
      "@radix-ui/react-tooltip",
      "@radix-ui/react-scroll-area",
      "@radix-ui/react-select",
      "@radix-ui/react-checkbox",
      "@radix-ui/react-label",
      "@radix-ui/react-slot",
    ],
    // KEY: don't block the server start waiting for the full crawl to finish
    holdUntilCrawlEnd: false,
  },
  esbuild: {
    target: 'es2020',
    legalComments: 'none', // strip /* MIT */ blocks → slightly smaller dev output
  },
}));
