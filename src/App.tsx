import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import WebsiteLoader from "@/components/WebsiteLoader";
import { useState, lazy, Suspense } from "react";
import { AnimatePresence } from "framer-motion";

// Lazy-load non-critical app-level components (not needed for first paint)
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const BackgroundMusic = lazy(() => import("@/components/BackgroundMusic"));
const BroadcastModal = lazy(() => import("@/components/BroadcastModal"));
const CustomCursor = lazy(() => import("@/components/CustomCursor"));

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Index />} />
        <Route path="/admin" element={<AdminDashboard />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {/* Lazy-loaded: these don't affect visual first paint */}
        <Suspense fallback={null}>
          <BackgroundMusic />
          <BroadcastModal />
          <CustomCursor />
        </Suspense>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <WebsiteLoader key="loader" onFinish={() => setIsLoading(false)} />
          ) : (
            <BrowserRouter
              future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
              }}
            >
              <AnimatedRoutes />
            </BrowserRouter>
          )}
        </AnimatePresence>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
