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

// Secret admin access hook - type "admin" on desktop, tap corner 5x on mobile
const useSecretAdminAccess = (onAccess: () => void) => {
  const [keyBuffer, setKeyBuffer] = useState("");
  const cornerTaps = useRef(0);
  const lastCornerTap = useRef(0);

  useEffect(() => {
    // Desktop: Type "admin"
    const handleKeyDown = (e: KeyboardEvent) => {
      const newBuffer = (keyBuffer + e.key.toLowerCase()).slice(-5);
      setKeyBuffer(newBuffer);
      
      if (newBuffer === "admin") {
        onAccess();
        setKeyBuffer("");
      }
    };

    // Mobile: Tap top-right corner 5 times
    const handleTouch = (e: TouchEvent) => {
      const touch = e.changedTouches[0];
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      
      // Check if touch is in top-right corner (within 60px of top-right)
      const isTopRightCorner = (
        touch.clientX > screenWidth - 60 &&
        touch.clientY < 60
      );
      
      if (isTopRightCorner) {
        const now = Date.now();
        
        // Reset if more than 2 seconds between taps
        if (now - lastCornerTap.current > 2000) {
          cornerTaps.current = 0;
        }
        
        cornerTaps.current++;
        lastCornerTap.current = now;
        
        // 5 taps in corner opens admin
        if (cornerTaps.current >= 5) {
          cornerTaps.current = 0;
          onAccess();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("touchend", handleTouch, { passive: true });

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("touchend", handleTouch);
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
