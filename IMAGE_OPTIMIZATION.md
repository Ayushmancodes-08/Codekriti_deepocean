# Image Optimization Strategy

This document outlines the comprehensive image optimization implementation for the hackathon website upgrade.

## Overview

The image optimization system provides:
- **Responsive Images**: Automatic srcset generation for multiple screen sizes
- **WebP Support**: Modern format with JPEG fallbacks for older browsers
- **Lazy Loading**: Intersection Observer-based lazy loading for below-the-fold images
- **Size Validation**: Ensures all images stay within 100KB limits
- **Performance**: GPU-accelerated rendering and optimized delivery

## Architecture

### Components

#### 1. Image Optimization Utilities (`src/lib/imageOptimization.ts`)

Core utilities for image optimization:

```typescript
// Generate responsive srcset
generateSrcSet(basePath, sizes, format)

// Generate sizes attribute
generateSizes()

// Detect WebP support
supportsWebP()

// Get optimal image format
getOptimalImageFormat()

// Calculate optimal image size
getOptimalImageSize(viewportWidth, devicePixelRatio)

// Generate complete responsive image props
generateResponsiveImageProps(basePath, alt, className)

// Detect device capabilities
detectDeviceCapabilities()

// Format file size
formatFileSize(bytes)

// Validate image size
isImageSizeAcceptable(fileSizeKB)
```

#### 2. Lazy Loading Hook (`src/hooks/useLazyImage.ts`)

React hook for lazy loading images with Intersection Observer:

```typescript
const { ref, isLoaded, isError } = useLazyImage(options)
```

Features:
- Automatic image loading when entering viewport
- 50px rootMargin for preloading
- Error handling
- Customizable IntersectionObserver options

#### 3. Responsive Image Component (`src/components/ResponsiveImage.tsx`)

High-level component for responsive images:

```typescript
<ResponsiveImage
  src="/images/logo"
  alt="Logo"
  className="w-full h-auto"
  lazy={true}
  placeholder="/placeholder.jpg"
  onLoad={() => console.log('loaded')}
  onError={() => console.log('error')}
/>
```

Features:
- Automatic WebP detection
- Picture element with source tags
- Lazy loading support
- Placeholder images
- Callbacks for load/error events

#### 4. Image Optimization Script (`scripts/optimize-images.js`)

Build-time image optimization:

```bash
npm run optimize:images
```

Validates image sizes and provides optimization guidance.

#### 5. Vite Plugin (`vite-plugin-image-optimization.ts`)

Vite plugin for build-time optimization configuration.

## Image Sizes

Responsive breakpoints for image generation:

```typescript
const IMAGE_SIZES = {
  mobile: 480,    // Mobile phones
  tablet: 768,    // Tablets
  desktop: 1024,  // Desktop
  large: 1440,    // Large screens
};
```

## Quality Settings

Compression quality for different formats:

```typescript
const IMAGE_QUALITY = {
  webp: 80,   // WebP format
  jpeg: 85,   // JPEG format
  png: 90,    // PNG format
};
```

## Size Limits

Maximum image file size: **100KB**

This ensures:
- Fast loading on mobile networks
- Reduced bandwidth usage
- Better Core Web Vitals scores

## Usage Examples

### Basic Responsive Image

```typescript
import { ResponsiveImage } from '@/components/ResponsiveImage';

export function MyComponent() {
  return (
    <ResponsiveImage
      src="/images/logo"
      alt="Company Logo"
      className="w-full h-auto"
    />
  );
}
```

### Lazy Loading Image

```typescript
<ResponsiveImage
  src="/images/hero"
  alt="Hero Image"
  lazy={true}
  placeholder="/images/hero-placeholder.jpg"
  onLoad={() => console.log('Image loaded')}
/>
```

### Using Utilities Directly

```typescript
import {
  generateSrcSet,
  generateSizes,
  supportsWebP,
  getOptimalImageSize,
} from '@/lib/imageOptimization';

// Generate srcset for custom image element
const srcset = generateSrcSet('/images/logo', [480, 768, 1024], 'webp');
const sizes = generateSizes();

// Check WebP support
const hasWebP = await supportsWebP();

// Get optimal size for current viewport
const optimalSize = getOptimalImageSize(window.innerWidth);
```

## Implementation Guide

### Step 1: Prepare Images

1. Ensure all images are under 100KB
2. Use high-quality source images (at least 1440px wide)
3. Place images in `public/images/` or `src/assets/`

### Step 2: Generate Responsive Sizes

Option A: Using sharp (Node.js)

```bash
npm install --save-dev sharp
npm run optimize:images
```

Option B: Using ImageMagick

```bash
# Generate JPEG versions
for size in 480 768 1024 1440; do
  convert input.jpg -quality 85 -resize ${size}x${size} output-${size}w.jpg
done

# Generate WebP versions
for size in 480 768 1024 1440; do
  convert input.jpg -quality 80 -resize ${size}x${size} output-${size}w.webp
done
```

Option C: Using Squoosh CLI

```bash
npm install -g @squoosh/cli

squoosh-cli --webp auto --mozjpeg auto input.jpg
```

### Step 3: Use in Components

```typescript
import { ResponsiveImage } from '@/components/ResponsiveImage';

export function EventCard() {
  return (
    <ResponsiveImage
      src="/images/event-card"
      alt="Event Card"
      className="w-full h-64 object-cover rounded-lg"
      lazy={true}
    />
  );
}
```

## Performance Optimization

### Lazy Loading Strategy

Images below the fold are lazy loaded:

```typescript
<ResponsiveImage
  src="/images/below-fold"
  alt="Below fold image"
  lazy={true}
  placeholder="/images/placeholder.jpg"
/>
```

### Intersection Observer

- **rootMargin**: 50px (preload 50px before entering viewport)
- **threshold**: 0 (trigger as soon as any part is visible)

### Device Capability Detection

```typescript
const capabilities = detectDeviceCapabilities();
// {
//   devicePixelRatio: 2,
//   viewportWidth: 1024,
//   hasWebP: true,
//   bandwidth: '4g'
// }
```

## Browser Support

### WebP Support

- Chrome 23+
- Firefox 65+
- Safari 16+
- Edge 18+

Fallback to JPEG for older browsers.

### Lazy Loading

- All modern browsers via Intersection Observer
- Graceful degradation: images load immediately in older browsers

## Testing

### Unit Tests

```bash
npm run test
```

Tests cover:
- Image size calculations
- Responsive srcset generation
- WebP detection
- Device capability detection
- File size formatting
- Size validation

### Integration Tests

```bash
npm run test
```

Tests cover:
- ResponsiveImage component rendering
- Lazy loading behavior
- Picture element structure
- Source tag generation
- Callback execution

## Monitoring

### Bundle Size

Monitor image-related bundle size:

```bash
npm run build
# Check dist/ folder size
```

### Performance Metrics

Track Core Web Vitals:
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

### Image Delivery

Monitor image delivery:
- Average image size
- Cache hit rate
- Load time by format (WebP vs JPEG)

## Best Practices

### 1. Use Responsive Images

Always use `ResponsiveImage` component for images:

```typescript
// ✅ Good
<ResponsiveImage src="/images/logo" alt="Logo" />

// ❌ Avoid
<img src="/images/logo.jpg" alt="Logo" />
```

### 2. Lazy Load Below-the-Fold Images

```typescript
// ✅ Good - lazy load
<ResponsiveImage src="/images/hero" alt="Hero" lazy={true} />

// ❌ Avoid - eager load everything
<ResponsiveImage src="/images/hero" alt="Hero" lazy={false} />
```

### 3. Provide Meaningful Alt Text

```typescript
// ✅ Good
<ResponsiveImage src="/images/team" alt="Team members at hackathon" />

// ❌ Avoid
<ResponsiveImage src="/images/team" alt="image" />
```

### 4. Use Placeholders for Lazy Images

```typescript
// ✅ Good - with placeholder
<ResponsiveImage
  src="/images/hero"
  alt="Hero"
  lazy={true}
  placeholder="/images/hero-placeholder.jpg"
/>

// ❌ Avoid - no placeholder
<ResponsiveImage src="/images/hero" alt="Hero" lazy={true} />
```

### 5. Validate Image Sizes

```typescript
import { isImageSizeAcceptable } from '@/lib/imageOptimization';

if (!isImageSizeAcceptable(fileSizeKB)) {
  console.warn('Image exceeds 100KB limit');
}
```

## Troubleshooting

### Images Not Loading

1. Check file paths are correct
2. Verify images exist in `public/images/`
3. Check browser console for errors
4. Verify responsive sizes are generated

### WebP Not Working

1. Check browser WebP support: `await supportsWebP()`
2. Verify WebP files are generated
3. Check source tag type attribute

### Lazy Loading Not Working

1. Verify IntersectionObserver is supported
2. Check lazy={true} is set
3. Verify placeholder image exists
4. Check browser console for errors

## Future Improvements

1. **AVIF Format**: Add AVIF support for even better compression
2. **Adaptive Bitrate**: Serve different qualities based on bandwidth
3. **CDN Integration**: Integrate with CDN for automatic optimization
4. **Image Caching**: Implement service worker caching
5. **Analytics**: Track image load times and formats used

## References

- [MDN: Responsive Images](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)
- [WebP Format](https://developers.google.com/speed/webp)
- [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
- [Core Web Vitals](https://web.dev/vitals/)
- [Image Optimization Guide](https://web.dev/image-optimization/)
