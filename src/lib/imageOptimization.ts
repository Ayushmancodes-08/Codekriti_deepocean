/**
 * Image Optimization Utilities
 * Handles responsive images, WebP conversion, lazy loading, and compression
 */

/**
 * Image size configuration for responsive images
 * Maps breakpoint names to pixel widths
 */
export const IMAGE_SIZES = {
  mobile: 480,
  tablet: 768,
  desktop: 1024,
  large: 1440,
} as const;

/**
 * Quality settings for different image formats
 */
export const IMAGE_QUALITY = {
  webp: 80,
  jpeg: 85,
  png: 90,
} as const;

/**
 * Maximum file size for images (in KB)
 */
export const MAX_IMAGE_SIZE_KB = 100;

/**
 * Generates a srcset string for responsive images
 * @param basePath - Base path to the image (without extension)
 * @param sizes - Array of sizes to generate srcset for
 * @param format - Image format (webp, jpg, png)
 * @returns srcset string for use in img tag
 */
export function generateSrcSet(
  basePath: string,
  sizes: number[] = Object.values(IMAGE_SIZES),
  format: 'webp' | 'jpg' | 'png' = 'webp'
): string {
  return sizes
    .map((size) => `${basePath}-${size}w.${format} ${size}w`)
    .join(', ');
}

/**
 * Generates sizes attribute for responsive images
 * @returns sizes attribute string for use in img tag
 */
export function generateSizes(): string {
  return `
    (max-width: 480px) 100vw,
    (max-width: 768px) 90vw,
    (max-width: 1024px) 80vw,
    (max-width: 1440px) 70vw,
    60vw
  `.trim();
}

/**
 * Detects if browser supports WebP format
 * @returns Promise that resolves to true if WebP is supported
 */
export async function supportsWebP(): Promise<boolean> {
  return new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src =
      'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAADwAQCdASoBIAEADsAcJaACdLoB/gAA/v8A/v8A';
  });
}

/**
 * Gets the appropriate image format based on browser support
 * @returns Promise that resolves to 'webp' or 'jpg'
 */
export async function getOptimalImageFormat(): Promise<'webp' | 'jpg'> {
  const hasWebP = await supportsWebP();
  return hasWebP ? 'webp' : 'jpg';
}

/**
 * Calculates optimal image size based on device pixel ratio and viewport width
 * @param viewportWidth - Current viewport width in pixels
 * @param devicePixelRatio - Device pixel ratio (default: window.devicePixelRatio)
 * @returns Optimal image width in pixels
 */
export function getOptimalImageSize(
  viewportWidth: number,
  devicePixelRatio: number = typeof window !== 'undefined' ? window.devicePixelRatio : 1
): number {
  const scaledWidth = viewportWidth * devicePixelRatio;

  // Find the closest size from IMAGE_SIZES that is >= scaledWidth
  const sizes = Object.values(IMAGE_SIZES).sort((a, b) => a - b);
  return sizes.find((size) => size >= scaledWidth) || sizes[sizes.length - 1];
}

/**
 * Generates a complete picture element with WebP and fallback
 * @param basePath - Base path to the image (without extension)
 * @param alt - Alt text for the image
 * @param className - CSS class name
 * @returns Object with srcSet, sizes, and fallback src
 */
export function generateResponsiveImageProps(
  basePath: string,
  alt: string,
  className?: string
) {
  return {
    srcSet: generateSrcSet(basePath, Object.values(IMAGE_SIZES), 'webp'),
    fallbackSrcSet: generateSrcSet(basePath, Object.values(IMAGE_SIZES), 'jpg'),
    sizes: generateSizes(),
    alt,
    className,
  };
}

/**
 * Detects device capabilities for image optimization
 * @returns Object with device capability information
 */
export function detectDeviceCapabilities() {
  if (typeof window === 'undefined') {
    return {
      devicePixelRatio: 1,
      viewportWidth: 1024,
      hasWebP: false,
      bandwidth: 'unknown',
    };
  }

  return {
    devicePixelRatio: window.devicePixelRatio || 1,
    viewportWidth: window.innerWidth,
    hasWebP: false, // Will be determined asynchronously
    bandwidth: (navigator as any).connection?.effectiveType || 'unknown',
  };
}

/**
 * Formats file size in human-readable format
 * @param bytes - File size in bytes
 * @returns Formatted file size string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Validates if image size is within acceptable limits
 * @param fileSizeKB - File size in kilobytes
 * @returns true if size is acceptable
 */
export function isImageSizeAcceptable(fileSizeKB: number): boolean {
  return fileSizeKB <= MAX_IMAGE_SIZE_KB;
}
