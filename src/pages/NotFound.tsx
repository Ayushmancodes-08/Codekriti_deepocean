import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex min-h-screen items-center justify-center bg-[#0a192f] text-white overflow-hidden relative"
    >
      {/* Background aesthetic */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] animate-pulse-slow" />
      </div>

      <div className="text-center relative z-10 px-6">
        <h1 className="mb-2 text-8xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-cyan-400 to-blue-600 drop-shadow-[0_0_20px_rgba(6,182,212,0.3)]">
          404
        </h1>
        <h2 className="mb-6 text-2xl font-display font-medium text-cyan-100/80">
          Lost in the Abyss?
        </h2>
        <p className="mb-8 text-lg text-gray-400 max-w-md mx-auto leading-relaxed">
          The page you're searching for has drifted into the deep sea. Let's get you back to the surface.
        </p>
        <a
          href="/"
          className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full font-display font-bold text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all transform hover:scale-105 active:scale-95"
        >
          Resurface to Home
        </a>
      </div>
    </motion.div>
  );
};

export default NotFound;
