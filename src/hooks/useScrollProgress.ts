import { useState, useEffect, useCallback, useRef } from 'react';

interface SectionThreshold {
  id: string;
  videoIndex: number;
}

const sectionThresholds: SectionThreshold[] = [
  { id: 'hero', videoIndex: 0 },
  { id: 'about', videoIndex: 1 },
  { id: 'events', videoIndex: 2 },
  { id: 'register', videoIndex: 3 },
  { id: 'footer', videoIndex: 4 },
];

// Throttle function for performance
const throttle = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout | null = null;
  let lastRan: number = 0;

  return function (this: any, ...args: any[]) {
    const now = Date.now();

    if (!lastRan) {
      func.apply(this, args);
      lastRan = now;
    } else {
      if (timeoutId) clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        if (now - lastRan >= delay) {
          func.apply(this, args);
          lastRan = now;
        }
      }, delay - (now - lastRan));
    }
  };
};

export const useScrollProgress = () => {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [activeSectionId, setActiveSectionId] = useState('hero');
  const [scrollProgress, setScrollProgress] = useState(0);
  const rafIdRef = useRef<number | null>(null);
  const ticking = useRef(false);

  const updateScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? scrollTop / docHeight : 0;
    setScrollProgress(progress);

    // Find which section is currently in view (optimized with early exit)
    for (let i = sectionThresholds.length - 1; i >= 0; i--) {
      const sectionId = sectionThresholds[i].id;
      const section = document.getElementById(sectionId);
      if (section) {
        const rect = section.getBoundingClientRect();
        // Section is considered "active" when its top is above the viewport center
        if (rect.top <= window.innerHeight * 0.5) {
          setActiveVideoIndex(sectionThresholds[i].videoIndex);
          setActiveSectionId(sectionId);
          break;
        }
      }
    }

    ticking.current = false;
  }, []);

  useEffect(() => {
    // Use RAF for smooth 60fps updates
    const handleScroll = () => {
      if (!ticking.current) {
        rafIdRef.current = requestAnimationFrame(updateScroll);
        ticking.current = true;
      }
    };

    // Initial check
    updateScroll();

    // Passive listener for better scroll performance
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [updateScroll]);

  return { activeVideoIndex, activeSectionId, scrollProgress };
};

export default useScrollProgress;
