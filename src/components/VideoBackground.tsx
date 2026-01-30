import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VIDEO_SOURCES, VIDEO_POSTERS } from '../config/videoConfig';
import { usePerformanceTier } from '@/hooks/use-mobile';

interface VideoBackgroundProps {
  activeIndex: number;
}

const VideoBackground = ({ activeIndex }: VideoBackgroundProps) => {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [loadedVideos, setLoadedVideos] = useState<Set<number>>(new Set([0]));
  const [videoErrors, setVideoErrors] = useState<Set<number>>(new Set());
  const [isVisible, setIsVisible] = useState(true);

  // Get device performance tier
  const performanceTier = usePerformanceTier();

  // Low-end devices always use static images - OVERRIDDEN per user request
  // const useStaticFallback = performanceTier === 'low';
  const useStaticFallback = false;

  // Visibility detection - pause videos when not visible
  useEffect(() => {
    if (useStaticFallback || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [useStaticFallback]);

  // Page visibility API - pause when tab is hidden
  useEffect(() => {
    if (useStaticFallback) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        videoRefs.current.forEach(video => {
          if (video && !video.paused) {
            video.pause();
          }
        });
      } else if (isVisible) {
        const activeVideo = videoRefs.current[activeIndex];
        if (activeVideo && activeVideo.paused) {
          activeVideo.play().catch(() => { });
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [activeIndex, isVisible, useStaticFallback]);

  // Smart preloading based on performance tier
  useEffect(() => {
    if (useStaticFallback) return;

    // High: preload current, next, and previous
    // Medium/Low: preload current and next only (optimized for all devices)
    const videosToLoad = new Set([activeIndex]);

    videosToLoad.add((activeIndex + 1) % VIDEO_SOURCES.length);

    if (performanceTier === 'high') {
      videosToLoad.add((activeIndex - 1 + VIDEO_SOURCES.length) % VIDEO_SOURCES.length);
    }

    const loadVideos = () => {
      setLoadedVideos(prev => {
        const newSet = new Set(prev);
        videosToLoad.forEach(index => newSet.add(index));
        return newSet;
      });
    };

    // Use requestIdleCallback for non-critical preloading (high tier)
    // Use immediate loading for medium/low tier
    if (performanceTier === 'high' && 'requestIdleCallback' in window) {
      const idleCallbackId = (window as any).requestIdleCallback(loadVideos, { timeout: 2000 });
      return () => (window as any).cancelIdleCallback(idleCallbackId);
    } else {
      const timeoutId = setTimeout(loadVideos, performanceTier === 'medium' ? 50 : 100);
      return () => clearTimeout(timeoutId);
    }
  }, [activeIndex, performanceTier, useStaticFallback]);

  // Optimized video playback
  useEffect(() => {
    if (!isVisible || useStaticFallback) return;

    videoRefs.current.forEach((video, index) => {
      if (!video) return;

      if (index === activeIndex) {
        if (video.paused) {
          video.play().catch(() => {
            console.log('Video autoplay prevented for video', index);
          });
        }
      } else {
        if (!video.paused) {
          video.pause();
        }
        // Only reset non-adjacent videos (memory optimization)
        if (Math.abs(index - activeIndex) > 1) {
          video.currentTime = 0;
        }
      }
    });
  }, [activeIndex, isVisible, useStaticFallback]);

  // Aggressive cleanup on unmount
  useEffect(() => {
    const refs = videoRefs.current;
    return () => {
      refs.forEach(video => {
        if (video) {
          video.pause();
          video.src = '';
          video.load();
        }
      });
    };
  }, []);

  const handleVideoLoaded = useCallback((index: number) => {
    setLoadedVideos(prev => new Set([...prev, index]));
  }, []);

  const handleVideoError = useCallback((index: number) => {
    console.error(`Failed to load video ${index}`);
    setVideoErrors(prev => new Set([...prev, index]));
  }, []);

  // Memoize which videos to render
  const videosToRender = useMemo(() => {
    if (useStaticFallback) return [];

    return VIDEO_SOURCES.map((src, index) => {
      const isCurrent = index === activeIndex;
      const isNext = index === (activeIndex + 1) % VIDEO_SOURCES.length;
      const isPrev = index === (activeIndex - 1 + VIDEO_SOURCES.length) % VIDEO_SOURCES.length;

      // Render strategy for all devices (since fallback is disabled)
      // High tier: render current, next, and previous
      // Medium/Low tier: render current and next only to save memory
      const shouldRender = performanceTier === 'high'
        ? (isCurrent || isNext || isPrev)
        : (isCurrent || isNext);

      const shouldLoad = loadedVideos.has(index);

      return { src, index, isCurrent, shouldRender, shouldLoad };
    });
  }, [activeIndex, loadedVideos, performanceTier, useStaticFallback]);

  // Transition duration based on performance tier
  const transitionDuration = performanceTier === 'high' ? 0.5 : 0.3;

  return (
    <div ref={containerRef} className="fixed inset-0 w-full h-full overflow-hidden z-0 bg-background">
      {/* Base gradient for loading state */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-ocean-surface via-ocean-deep to-ocean-abyss"
        style={{ zIndex: 0 }}
      />

      {/* Static fallback for low-end devices - DISABLED, but keeping block structure if needed later */}
      {useStaticFallback ? (
        <img
          src={VIDEO_POSTERS[activeIndex]}
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          style={{
            zIndex: 1,
            filter: 'brightness(0.6) saturate(1.1)',
          }}
        />
      ) : (
        <AnimatePresence mode="popLayout">
          {videosToRender.map(({ src, index, isCurrent, shouldRender, shouldLoad }) => {
            if (!shouldRender) return null;

            return (
              <motion.div
                key={src}
                className="absolute inset-0 w-full h-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: isCurrent ? 1 : 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: transitionDuration, ease: 'easeInOut' }}
                style={{ zIndex: index + 1, pointerEvents: 'none' }}
              >
                {shouldLoad && !videoErrors.has(index) && (
                  <video
                    ref={(el) => { videoRefs.current[index] = el; }}
                    src={src}
                    muted
                    loop
                    playsInline
                    autoPlay={index === 0 && isVisible}
                    preload={index === activeIndex ? 'auto' : 'metadata'}
                    onLoadedData={() => handleVideoLoaded(index)}
                    onError={() => handleVideoError(index)}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{
                      filter: 'brightness(0.6) saturate(1.1)',
                      willChange: isCurrent ? 'opacity' : 'auto',
                    }}
                  />
                )}

                {videoErrors.has(index) && (
                  <img
                    src={VIDEO_POSTERS[index]}
                    alt={`Scene ${index + 1}`}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ filter: 'brightness(0.6) saturate(1.1)' }}
                  />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      )}

      {/* Overlay gradient for content readability */}
      <div
        className="absolute inset-0 video-overlay pointer-events-none"
        style={{ zIndex: 10 }}
      />

      {/* Reduced particle overlay - only for high tier */}
      {performanceTier === 'high' && (
        <div
          className="absolute inset-0 particles-bg opacity-20 pointer-events-none"
          style={{ zIndex: 11 }}
        />
      )}

      {/* Vignette effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 12,
          background: 'radial-gradient(ellipse at center, transparent 0%, hsl(220 60% 3% / 0.4) 100%)',
        }}
      />
    </div>
  );
};

export default VideoBackground;

