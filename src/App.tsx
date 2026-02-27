import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import WebsiteLoader from "@/components/WebsiteLoader";
import { useState, lazy, Suspense, useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import AdminDashboard from "./pages/AdminDashboard";

// Lazy-load non-critical app-level components (not needed for first paint)
const BackgroundMusic = lazy(() => import("@/components/BackgroundMusic"));
const BroadcastModal = lazy(() => import("@/components/BroadcastModal"));
const CustomCursor = lazy(() => import("@/components/CustomCursor"));

const queryClient = new QueryClient();

// Secret admin access hook - type "admin" anywhere or long-press for 5s on mobile
const useSecretAdminAccess = (onAccess: () => void) => {
  const [keyBuffer, setKeyBuffer] = useState("");
  const touchStartTime = useRef<number | null>(null);
  const touchTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const newBuffer = (keyBuffer + e.key.toLowerCase()).slice(-5);
      setKeyBuffer(newBuffer);
      
      if (newBuffer === "admin") {
        onAccess();
        setKeyBuffer("");
      }
    };

    const handleTouchStart = () => {
      touchStartTime.current = Date.now();
      
      // Show a subtle hint after 3 seconds
      if (touchTimer.current) clearTimeout(touchTimer.current);
      touchTimer.current = setTimeout(() => {
        // Optional: could show a subtle visual cue here
      }, 3000);
    };

    const handleTouchEnd = () => {
      if (touchTimer.current) {
        clearTimeout(touchTimer.current);
        touchTimer.current = null;
      }
      
      if (touchStartTime.current) {
        const duration = Date.now() - touchStartTime.current;
        if (duration >= 5000) { // 5 seconds long press
          onAccess();
        }
        touchStartTime.current = null;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
      if (touchTimer.current) clearTimeout(touchTimer.current);
    };
  }, [keyBuffer, onAccess]);
};

const AnimatedRoutes = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  useSecretAdminAccess(() => {
    navigate("/admin");
  });

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
