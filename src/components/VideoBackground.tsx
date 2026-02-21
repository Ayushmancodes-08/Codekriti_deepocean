import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { ASSETS } from '../config/assets';

interface VideoBackgroundProps {
  activeIndex: number;
}

const VideoBackground = ({ activeIndex }: VideoBackgroundProps) => {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Strictly load ONLY the first video initially
  const [loadedVideos, setLoadedVideos] = useState<Set<number>>(new Set([0]));
  const [videoErrors, setVideoErrors] = useState<Set<number>>(new Set());
  const [isVisible, setIsVisible] = useState(true);
  const [canLoadOthers, setCanLoadOthers] = useState(false);

  // Disable static fallback completely as per user request


  // Visibility detection
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;

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
  }, []);

  // Defer loading of other videos until after initial render + delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setCanLoadOthers(true);
    }, 4000); // Wait 4 seconds before even considering other videos

    return () => clearTimeout(timer);
  }, []);

  // Smart loading logic
  useEffect(() => {
    if (!canLoadOthers) return;

    // Load current, next, and previous only when needed
    const videosToLoad = new Set(loadedVideos);

    // Always keep current loaded
    videosToLoad.add(activeIndex);

    // Preload next
    videosToLoad.add((activeIndex + 1) % ASSETS.VIDEOS.length);

    // Low priority for previous (load only if we have bandwidth/idle)
    if (window.requestIdleCallback) {
      window.requestIdleCallback(() => {
        setLoadedVideos(prev => {
          const updated = new Set(prev);
          updated.add((activeIndex - 1 + ASSETS.VIDEOS.length) % ASSETS.VIDEOS.length);
          return updated;
        });
      });
    }

    setLoadedVideos(prev => {
      const newSet = new Set(prev);
      videosToLoad.forEach(id => newSet.add(id));
      return newSet;
    });

  }, [activeIndex, canLoadOthers]);

  // Handle Playback
  useEffect(() => {
    if (!isVisible) return;

    videoRefs.current.forEach((video, index) => {
      if (!video) return;

      if (index === activeIndex) {
        if (video.paused) {
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {
              console.log('Autoplay prevented:', index);
            });
          }
        }
      } else {
        if (!video.paused) {
          video.pause();
        }
      }
    });
  }, [activeIndex, isVisible, loadedVideos]);

  const handleVideoLoaded = useCallback((index: number) => {
    setLoadedVideos(prev => new Set([...prev, index]));
  }, []);

  const handleVideoError = useCallback((index: number) => {
    console.error(`Failed to load video ${index}`);
    setVideoErrors(prev => new Set([...prev, index]));
  }, []);

  // Memoize render list - AGGRESSIVE PRUNING
  const videosToRender = useMemo(() => {
    return ASSETS.VIDEOS.map((src, index) => {
      const isCurrent = index === activeIndex;
      const isNext = index === (activeIndex + 1) % ASSETS.VIDEOS.length;

      // ONLY render current and next. Remove all others from DOM completely.
      const shouldRender = isCurrent || isNext || (index === 0 && !canLoadOthers);

      return { src, index, isCurrent, shouldRender };
    });
  }, [activeIndex, canLoadOthers]);

  return (
    <div ref={containerRef} className="fixed inset-0 w-full h-full overflow-hidden z-0 bg-background">
      {/* Base gradient */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-ocean-surface via-ocean-deep to-ocean-abyss"
        style={{ zIndex: 0 }}
      />

      {videosToRender.map(({ src, index, isCurrent, shouldRender }) => {
        if (!shouldRender) return null;

        return (
          <div
            key={src}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${isCurrent ? 'opacity-100' : 'opacity-0'}`}
            style={{ zIndex: index + 1, pointerEvents: 'none' }}
          >
            {!videoErrors.has(index) ? (
              <video
                ref={(el) => { videoRefs.current[index] = el; }}
                src={src}
                muted
                loop
                playsInline
                crossOrigin="anonymous"
                autoPlay={index === activeIndex || index === 0}
                preload={index === activeIndex ? "auto" : "metadata"}
                onLoadedData={() => handleVideoLoaded(index)}
                onError={() => handleVideoError(index)}
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                  filter: 'brightness(0.6) saturate(1.1)',
                }}
              />
            ) : (
              // Fallback for error state only
              <img
                src={ASSETS.VIDEO_POSTERS[index]}
                alt={`Scene ${index + 1}`}
                crossOrigin="anonymous"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ filter: 'brightness(0.6) saturate(1.1)' }}
              />
            )}
          </div>
        );
      })}

      {/* Show poster for first video IMMEDIATELY to prevent black flash if video takes time */}
      {!loadedVideos.has(0) && (
        <div className="absolute inset-0 w-full h-full z-[1]" style={{ pointerEvents: 'none' }}>
          <img
            src={ASSETS.VIDEO_POSTERS[0]}
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: 'brightness(0.6) saturate(1.1)' }}
          />
        </div>
      )}


      {/* Overlay gradient */}
      <div
        className="absolute inset-0 video-overlay pointer-events-none"
        style={{ zIndex: 10 }}
      />

      {/* Particles - lighter weight */}
      <div
        className="absolute inset-0 particles-bg opacity-20 pointer-events-none"
        style={{ zIndex: 11 }}
      />

      {/* Vignette */}
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
