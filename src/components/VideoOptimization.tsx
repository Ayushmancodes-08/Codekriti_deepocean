import { useEffect, useRef, useState, useCallback } from 'react';
import {
  detectDeviceCapability,
  selectVideoQuality,
  getSupportedVideoFormat,
  supportsIntersectionObserver,
  type VideoQuality,
  type DeviceCapability,
} from '@/lib/videoOptimization';

export interface VideoOptimizationProps {
  /**
   * Video sources for different quality levels
   * Expected format: /videos/video-{quality}.{format}
   * e.g., /videos/scene-1-480p.mp4, /videos/scene-1-720p.webm
   */
  sources: {
    mobile: string;
    tablet: string;
    desktop: string;
  };
  /** Poster image URL for fallback and loading state */
  poster: string;
  /** Whether to autoplay the video */
  autoPlay?: boolean;
  /** Whether to loop the video */
  loop?: boolean;
  /** CSS class name for styling */
  className?: string;
  /** Callback when video is visible in viewport */
  onVisibilityChange?: (isVisible: boolean) => void;
}

/**
 * VideoOptimization Component
 * 
 * Provides adaptive video playback with:
 * - Device capability detection
 * - Quality selection based on device
 * - Lazy loading with Intersection Observer
 * - Pause/resume based on visibility
 * - Multiple codec support (H.264, VP9)
 * - Fallback to poster image
 */
const VideoOptimization = ({
  sources,
  poster,
  autoPlay = true,
  loop = true,
  className = '',
  onVisibilityChange,
}: VideoOptimizationProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const [deviceCapability, setDeviceCapability] = useState<DeviceCapability>('medium');
  const [selectedQuality, setSelectedQuality] = useState<VideoQuality>('720p');
  const [videoFormat, setVideoFormat] = useState<'h264' | 'vp9' | 'fallback'>('h264');
  const [isVisible, setIsVisible] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Detect device capability on mount
  useEffect(() => {
    const capability = detectDeviceCapability();
    setDeviceCapability(capability);
    setSelectedQuality(selectVideoQuality(capability));
    setVideoFormat(getSupportedVideoFormat());
  }, []);

  // Build video source URL based on quality and format
  const getVideoSource = useCallback((): string => {
    // Extract base path and filename from sources
    const baseSource = sources.desktop;
    const basePath = baseSource.substring(0, baseSource.lastIndexOf('/'));
    const filename = baseSource.substring(baseSource.lastIndexOf('/') + 1);
    const nameWithoutExt = filename.substring(0, filename.lastIndexOf('.'));

    // Construct quality-specific filename
    let qualityFilename = `${nameWithoutExt}-${selectedQuality}`;

    // Add format extension
    if (videoFormat === 'vp9') {
      qualityFilename += '.webm';
    } else if (videoFormat === 'h264') {
      qualityFilename += '.mp4';
    } else {
      // Fallback to original format
      qualityFilename += baseSource.substring(baseSource.lastIndexOf('.'));
    }

    return `${basePath}/${qualityFilename}`;
  }, [sources, selectedQuality, videoFormat]);

  // Setup Intersection Observer for lazy loading and visibility detection
  useEffect(() => {
    if (!supportsIntersectionObserver() || !containerRef.current) {
      return;
    }

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        const visible = entry.isIntersecting;
        setIsVisible(visible);
        onVisibilityChange?.(visible);

        if (videoRef.current) {
          if (visible) {
            // Resume playback when visible
            if (autoPlay && videoRef.current.paused) {
              videoRef.current.play().catch((err) => {
                console.warn('Failed to play video:', err);
              });
            }
          } else {
            // Pause playback when not visible
            if (!videoRef.current.paused) {
              videoRef.current.pause();
            }
          }
        }
      });
    };

    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold: [0, 0.25, 0.5, 0.75, 1],
    });

    observerRef.current.observe(containerRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [autoPlay, onVisibilityChange]);

  // Handle video load
  const handleLoadedData = () => {
    setIsLoading(false);
    setHasError(false);
  };

  // Handle video error with fallback
  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    console.warn('Video failed to load, showing poster image');
  };

  // Handle play error (e.g., autoplay policy)
  const handlePlayError = (error: Error) => {
    console.warn('Video play error:', error);
  };

  const videoSource = getVideoSource();

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden bg-black ${className}`}
    >
      {/* Poster image - shown during loading or on error */}
      {(isLoading || hasError) && (
        <img
          src={poster}
          alt="Video poster"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Video element */}
      {!hasError && (
        <video
          ref={videoRef}
          src={videoSource}
          poster={poster}
          autoPlay={autoPlay}
          loop={loop}
          muted
          playsInline
          preload="metadata"
          onLoadedData={handleLoadedData}
          onError={handleError}
          onPlay={(e) => {
            const video = e.currentTarget;
            video.play().catch(handlePlayError);
          }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white" />
        </div>
      )}

      {/* Error fallback message */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70">
          <p className="text-white text-center px-4">
            Video unavailable. Showing poster image.
          </p>
        </div>
      )}

      {/* Device capability indicator (debug - remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
          {deviceCapability} / {selectedQuality} / {videoFormat}
        </div>
      )}
    </div>
  );
};

export default VideoOptimization;
