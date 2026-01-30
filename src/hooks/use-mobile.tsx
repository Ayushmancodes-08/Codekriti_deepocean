import * as React from "react";

const MOBILE_BREAKPOINT = 768;
const LOW_END_MEMORY_THRESHOLD = 4; // GB

/**
 * Hook to detect if user is on mobile device
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}

/**
 * Hook to detect low-end device for performance optimization
 * Checks: memory, hardware concurrency, connection, screen size
 */
export function useIsLowEndDevice() {
  const [isLowEnd, setIsLowEnd] = React.useState<boolean>(false);

  React.useEffect(() => {
    const checkDevice = () => {
      // Check device memory (Chrome/Edge)
      const deviceMemory = (navigator as any).deviceMemory;
      if (deviceMemory && deviceMemory < LOW_END_MEMORY_THRESHOLD) {
        return true;
      }

      // Check hardware concurrency (CPU cores)
      const cpuCores = navigator.hardwareConcurrency;
      if (cpuCores && cpuCores <= 2) {
        return true;
      }

      // Check network connection
      const connection = (navigator as any).connection;
      if (connection) {
        if (connection.saveData) return true;
        if (connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g') {
          return true;
        }
      }

      // Check for very small viewport (likely old/low-end mobile)
      if (window.innerWidth < 360 || window.innerHeight < 640) {
        return true;
      }

      // Check for reduced motion preference
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return true;
      }

      return false;
    };

    setIsLowEnd(checkDevice());

    // Re-check on visibility change (battery saving modes)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        setIsLowEnd(checkDevice());
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  return isLowEnd;
}

/**
 * Hook to get performance tier: 'low' | 'medium' | 'high'
 */
export function usePerformanceTier(): 'low' | 'medium' | 'high' {
  const [tier, setTier] = React.useState<'low' | 'medium' | 'high'>('medium');

  React.useEffect(() => {
    const detectTier = (): 'low' | 'medium' | 'high' => {
      // Device memory check
      const memory = (navigator as any).deviceMemory;
      const cores = navigator.hardwareConcurrency;
      const connection = (navigator as any).connection;
      const isMobile = window.innerWidth < MOBILE_BREAKPOINT;

      // Low tier conditions
      if (
        (memory && memory < 4) ||
        (cores && cores <= 2) ||
        (connection?.effectiveType && ['2g', 'slow-2g'].includes(connection.effectiveType)) ||
        connection?.saveData ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ) {
        return 'low';
      }

      // High tier conditions
      if (
        (memory && memory >= 8) &&
        (cores && cores >= 4) &&
        !isMobile &&
        (connection?.effectiveType === '4g' || !connection)
      ) {
        return 'high';
      }

      return 'medium';
    };

    setTier(detectTier());
  }, []);

  return tier;
}
