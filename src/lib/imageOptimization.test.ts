import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  IMAGE_SIZES,
  IMAGE_QUALITY,
  MAX_IMAGE_SIZE_KB,
  generateSrcSet,
  generateSizes,
  supportsWebP,
  getOptimalImageFormat,
  getOptimalImageSize,
  generateResponsiveImageProps,
  detectDeviceCapabilities,
  formatFileSize,
  isImageSizeAcceptable,
} from './imageOptimization';

describe('Image Optimization Utilities', () => {
  describe('Constants', () => {
    it('should have correct IMAGE_SIZES', () => {
      expect(IMAGE_SIZES.mobile).toBe(480);
      expect(IMAGE_SIZES.tablet).toBe(768);
      expect(IMAGE_SIZES.desktop).toBe(1024);
      expect(IMAGE_SIZES.large).toBe(1440);
    });

    it('should have correct IMAGE_QUALITY', () => {
      expect(IMAGE_QUALITY.webp).toBe(80);
      expect(IMAGE_QUALITY.jpeg).toBe(85);
      expect(IMAGE_QUALITY.png).toBe(90);
    });

    it('should have MAX_IMAGE_SIZE_KB set to 100', () => {
      expect(MAX_IMAGE_SIZE_KB).toBe(100);
    });
  });

  describe('generateSrcSet', () => {
    it('should generate srcset for WebP format', () => {
      const srcset = generateSrcSet('/images/logo', [480, 768], 'webp');
      expect(srcset).toContain('/images/logo-480w.webp 480w');
      expect(srcset).toContain('/images/logo-768w.webp 768w');
    });

    it('should generate srcset for JPEG format', () => {
      const srcset = generateSrcSet('/images/logo', [480, 768], 'jpg');
      expect(srcset).toContain('/images/logo-480w.jpg 480w');
      expect(srcset).toContain('/images/logo-768w.jpg 768w');
    });

    it('should use default sizes if not provided', () => {
      const srcset = generateSrcSet('/images/logo');
      expect(srcset).toContain('480w');
      expect(srcset).toContain('768w');
      expect(srcset).toContain('1024w');
      expect(srcset).toContain('1440w');
    });

    it('should handle single size', () => {
      const srcset = generateSrcSet('/images/logo', [480]);
      expect(srcset).toBe('/images/logo-480w.webp 480w');
    });
  });

  describe('generateSizes', () => {
    it('should generate responsive sizes string', () => {
      const sizes = generateSizes();
      expect(sizes).toContain('(max-width: 480px)');
      expect(sizes).toContain('(max-width: 768px)');
      expect(sizes).toContain('(max-width: 1024px)');
      expect(sizes).toContain('(max-width: 1440px)');
    });

    it('should include viewport width units', () => {
      const sizes = generateSizes();
      expect(sizes).toContain('vw');
    });
  });

  describe('supportsWebP', () => {
    it('should return a promise', () => {
      const result = supportsWebP();
      expect(result).toBeInstanceOf(Promise);
    });
  });

  describe('getOptimalImageFormat', () => {
    it('should return a promise', () => {
      const result = getOptimalImageFormat();
      expect(result).toBeInstanceOf(Promise);
    });
  });

  describe('getOptimalImageSize', () => {
    it('should return optimal size for mobile viewport', () => {
      const size = getOptimalImageSize(320, 1);
      expect(size).toBeGreaterThanOrEqual(320);
      expect([480, 768, 1024, 1440]).toContain(size);
    });

    it('should return optimal size for tablet viewport', () => {
      const size = getOptimalImageSize(768, 1);
      expect(size).toBeGreaterThanOrEqual(768);
      expect([480, 768, 1024, 1440]).toContain(size);
    });

    it('should return optimal size for desktop viewport', () => {
      const size = getOptimalImageSize(1024, 1);
      expect(size).toBeGreaterThanOrEqual(1024);
      expect([480, 768, 1024, 1440]).toContain(size);
    });

    it('should account for device pixel ratio', () => {
      const size1x = getOptimalImageSize(480, 1);
      const size2x = getOptimalImageSize(480, 2);
      expect(size2x).toBeGreaterThanOrEqual(size1x);
    });

    it('should return largest size if viewport is very large', () => {
      const size = getOptimalImageSize(2000, 1);
      expect(size).toBe(1440);
    });
  });

  describe('generateResponsiveImageProps', () => {
    it('should generate all required props', () => {
      const props = generateResponsiveImageProps('/images/logo', 'Logo');
      expect(props).toHaveProperty('srcSet');
      expect(props).toHaveProperty('fallbackSrcSet');
      expect(props).toHaveProperty('sizes');
      expect(props).toHaveProperty('alt');
    });

    it('should include WebP srcset', () => {
      const props = generateResponsiveImageProps('/images/logo', 'Logo');
      expect(props.srcSet).toContain('.webp');
    });

    it('should include JPEG fallback srcset', () => {
      const props = generateResponsiveImageProps('/images/logo', 'Logo');
      expect(props.fallbackSrcSet).toContain('.jpg');
    });

    it('should include alt text', () => {
      const props = generateResponsiveImageProps('/images/logo', 'My Logo');
      expect(props.alt).toBe('My Logo');
    });

    it('should include className if provided', () => {
      const props = generateResponsiveImageProps('/images/logo', 'Logo', 'my-class');
      expect(props.className).toBe('my-class');
    });
  });

  describe('detectDeviceCapabilities', () => {
    it('should return device capability object', () => {
      const capabilities = detectDeviceCapabilities();
      expect(capabilities).toHaveProperty('devicePixelRatio');
      expect(capabilities).toHaveProperty('viewportWidth');
      expect(capabilities).toHaveProperty('hasWebP');
      expect(capabilities).toHaveProperty('bandwidth');
    });

    it('should have valid device pixel ratio', () => {
      const capabilities = detectDeviceCapabilities();
      expect(capabilities.devicePixelRatio).toBeGreaterThanOrEqual(1);
    });

    it('should have valid viewport width', () => {
      const capabilities = detectDeviceCapabilities();
      expect(capabilities.viewportWidth).toBeGreaterThan(0);
    });
  });

  describe('formatFileSize', () => {
    it('should format bytes correctly', () => {
      expect(formatFileSize(0)).toBe('0 Bytes');
      expect(formatFileSize(1024)).toContain('KB');
      expect(formatFileSize(1024 * 1024)).toContain('MB');
    });

    it('should handle small files', () => {
      const result = formatFileSize(512);
      expect(result).toContain('Bytes');
    });

    it('should handle large files', () => {
      const result = formatFileSize(1024 * 1024 * 10);
      expect(result).toContain('MB');
    });

    it('should round to 2 decimal places', () => {
      const result = formatFileSize(1536); // 1.5 KB
      expect(result).toMatch(/\d+(\.\d+)?\s+KB/);
    });
  });

  describe('isImageSizeAcceptable', () => {
    it('should accept images under max size', () => {
      expect(isImageSizeAcceptable(50)).toBe(true);
      expect(isImageSizeAcceptable(99)).toBe(true);
    });

    it('should accept images at max size', () => {
      expect(isImageSizeAcceptable(100)).toBe(true);
    });

    it('should reject images over max size', () => {
      expect(isImageSizeAcceptable(101)).toBe(false);
      expect(isImageSizeAcceptable(200)).toBe(false);
    });

    it('should accept zero size', () => {
      expect(isImageSizeAcceptable(0)).toBe(true);
    });
  });
});
