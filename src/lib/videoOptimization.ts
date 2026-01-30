/**
 * Video Optimization Utilities
 * Handles device capability detection, quality selection, and performance optimization
 */

export type VideoQuality = '480p' | '720p' | '1080p';
export type DeviceCapability = 'low' | 'medium' | 'high';

/**
 * Detects device capabilities based on bandwidth, screen size, and GPU support
 */
export function detectDeviceCapability(): DeviceCapability {
  // Check for GPU support (WebGL)
  const hasGPU = checkWebGLSupport();

  // Check screen size
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const maxDimension = Math.max(screenWidth, screenHeight);

  // Estimate bandwidth using Network Information API
  const bandwidth = estimateBandwidth();

  // Determine capability based on multiple factors
  if (!hasGPU || bandwidth < 1) {
    return 'low';
  }

  if (maxDimension >= 1920 && bandwidth >= 5) {
    return 'high';
  }

  if (maxDimension >= 1024 && bandwidth >= 2) {
    return 'medium';
  }

  return 'low';
}

/**
 * Checks if WebGL is supported (indicates GPU capability)
 */
function checkWebGLSupport(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return !!gl;
  } catch {
    return false;
  }
}

/**
 * Estimates bandwidth using Network Information API
 * Returns bandwidth in Mbps
 */
function estimateBandwidth(): number {
  if ('connection' in navigator) {
    const connection = (navigator as any).connection;
    if (connection && connection.effectiveType) {
      const effectiveType = connection.effectiveType;
      const bandwidthMap: Record<string, number> = {
        '4g': 10,
        '3g': 1.5,
        '2g': 0.4,
        'slow-2g': 0.1,
      };
      return bandwidthMap[effectiveType] || 5;
    }
  }
  // Default to medium bandwidth if API not available
  return 2;
}

/**
 * Selects optimal video quality based on device capability
 */
export function selectVideoQuality(capability: DeviceCapability): VideoQuality {
  const qualityMap: Record<DeviceCapability, VideoQuality> = {
    low: '480p',
    medium: '720p',
    high: '1080p',
  };
  return qualityMap[capability];
}

/**
 * Checks if device supports specific video codec
 */
export function supportsVideoCodec(codec: 'h264' | 'vp9'): boolean {
  const video = document.createElement('video');

  const codecMap = {
    h264: 'video/mp4; codecs="avc1.42E01E"',
    vp9: 'video/webm; codecs="vp9"',
  };

  const canPlay = video.canPlayType(codecMap[codec]);
  return canPlay === 'probably' || canPlay === 'maybe';
}

/**
 * Gets supported video format for the device
 */
export function getSupportedVideoFormat(): 'h264' | 'vp9' | 'fallback' {
  if (supportsVideoCodec('vp9')) {
    return 'vp9';
  }
  if (supportsVideoCodec('h264')) {
    return 'h264';
  }
  return 'fallback';
}

/**
 * Checks if Intersection Observer is supported
 */
export function supportsIntersectionObserver(): boolean {
  return 'IntersectionObserver' in window;
}

/**
 * Checks if device supports autoplay
 */
export function supportsAutoplay(): boolean {
  // Most modern browsers support autoplay with muted videos
  return true;
}

/**
 * Checks if user prefers reduced motion (accessibility setting)
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Checks if save-data mode is enabled (network saving mode)
 */
export function saveDataEnabled(): boolean {
  if ('connection' in navigator) {
    const connection = (navigator as any).connection;
    return connection?.saveData === true;
  }
  return false;
}

/**
 * Determines if we should use static images instead of videos
 * Returns true for:
 * - Low capability devices (no GPU, slow network)
 * - Users with reduced motion preference
 * - Save-data mode enabled
 * - Very small screens (likely low-power mobile)
 */
export function shouldUseStaticFallback(): boolean {
  // Respect user preferences first
  if (prefersReducedMotion()) return true;
  if (saveDataEnabled()) return true;

  // Check device capability
  const capability = detectDeviceCapability();
  if (capability === 'low') return true;

  // Check for very small viewport (likely low-end mobile)
  if (typeof window !== 'undefined') {
    const minDimension = Math.min(window.innerWidth, window.innerHeight);
    if (minDimension < 360) return true;
  }

  return false;
}
