import React, { useState, useEffect } from 'react';
import { useLazyImage } from '@/hooks/useLazyImage';
import { generateSizes } from '@/lib/imageOptimization';

interface ResponsiveImageProps {
  /**
   * Base path to the image (without extension)
   * e.g., '/images/logo' for '/images/logo-480w.webp', '/images/logo-480w.jpg'
   */
  src: string;
  /**
   * Alt text for accessibility
   */
  alt: string;
  /**
   * CSS class name
   */
  className?: string;
  /**
   * Whether to lazy load the image (default: true)
   */
  lazy?: boolean;
  /**
   * Placeholder image while loading
   */
  placeholder?: string;
  /**
   * Callback when image loads
   */
  onLoad?: () => void;
  /**
   * Callback when image fails to load
   */
  onError?: () => void;
  /**
   * Image sizes for responsive behavior
   */
  sizes?: string;
  /**
   * Custom width
   */
  width?: number;
  /**
   * Custom height
   */
  height?: number;
}

/**
 * ResponsiveImage Component
 * Handles responsive images with WebP support and fallbacks
 * Supports lazy loading with Intersection Observer
 */
export const ResponsiveImage = React.forwardRef<
  HTMLImageElement,
  ResponsiveImageProps
>(
  (
    {
      src,
      alt,
      className = '',
      lazy = true,
      placeholder,
      onLoad,
      onError,
      sizes = generateSizes(),
      width,
      height,
    },
    ref
  ) => {
    const [supportsWebP, setSupportsWebP] = useState(true);
    const { ref: lazyRef, isLoaded, isError } = useLazyImage();

    // Detect WebP support
    useEffect(() => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        const dataUrl = canvas.toDataURL('image/webp');
        setSupportsWebP(dataUrl && dataUrl.indexOf('image/webp') === 5);
      } catch (error) {
        // If canvas is not supported, default to false
        setSupportsWebP(false);
      }
    }, []);

    // Generate srcset for WebP and fallback
    const webpSrcSet = `
      ${src}-480w.webp 480w,
      ${src}-768w.webp 768w,
      ${src}-1024w.webp 1024w,
      ${src}-1440w.webp 1440w
    `.trim();

    const jpgSrcSet = `
      ${src}-480w.jpg 480w,
      ${src}-768w.jpg 768w,
      ${src}-1024w.jpg 1024w,
      ${src}-1440w.jpg 1440w
    `.trim();

    const fallbackSrc = `${src}-1024w.jpg`;

    const imageRef = lazy ? lazyRef : ref;

    return (
      <picture>
        {/* WebP source for modern browsers */}
        {supportsWebP && (
          <source
            srcSet={lazy ? undefined : webpSrcSet}
            data-srcset={lazy ? webpSrcSet : undefined}
            sizes={sizes}
            type="image/webp"
          />
        )}

        {/* JPEG fallback source */}
        <source
          srcSet={lazy ? undefined : jpgSrcSet}
          data-srcset={lazy ? jpgSrcSet : undefined}
          sizes={sizes}
          type="image/jpeg"
        />

        {/* Fallback img tag */}
        <img
          ref={imageRef}
          src={lazy ? placeholder : fallbackSrc}
          data-src={lazy ? fallbackSrc : undefined}
          alt={alt}
          className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
          sizes={sizes}
          width={width}
          height={height}
          onLoad={onLoad}
          onError={onError}
        />
      </picture>
    );
  }
);

ResponsiveImage.displayName = 'ResponsiveImage';
