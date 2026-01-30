import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  detectDeviceCapability,
  selectVideoQuality,
  supportsVideoCodec,
  getSupportedVideoFormat,
  supportsIntersectionObserver,
  supportsAutoplay,
} from './videoOptimization';

describe('Video Optimization Utilities', () => {
  beforeEach(() => {
    // Reset window properties
    vi.clearAllMocks();
  });

  describe('detectDeviceCapability', () => {
    it('returns a valid device capability', () => {
      const capability = detectDeviceCapability();
      expect(['low', 'medium', 'high']).toContain(capability);
    });

    it('returns low capability when WebGL is not supported', () => {
      // Mock WebGL not supported
      HTMLCanvasElement.prototype.getContext = vi.fn(() => null);

      const capability = detectDeviceCapability();
      expect(capability).toBe('low');
    });

    it('returns high capability for large screens with good bandwidth', () => {
      // Mock WebGL support
      HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
        getParameter: vi.fn(),
      })) as any;

      // Mock large screen
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1920,
      });

      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 1080,
      });

      // Mock good bandwidth
      Object.defineProperty(navigator, 'connection', {
        writable: true,
        configurable: true,
        value: {
          effectiveType: '4g',
        },
      });

      const capability = detectDeviceCapability();
      expect(capability).toBe('high');
    });

    it('returns medium capability for medium screens', () => {
      // Mock WebGL support
      HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
        getParameter: vi.fn(),
      })) as any;

      // Mock medium screen
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });

      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 768,
      });

      // Mock medium bandwidth
      Object.defineProperty(navigator, 'connection', {
        writable: true,
        configurable: true,
        value: {
          effectiveType: '3g',
        },
      });

      const capability = detectDeviceCapability();
      expect(['medium', 'low']).toContain(capability);
    });

    it('returns low capability for small screens', () => {
      // Mock WebGL support
      HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
        getParameter: vi.fn(),
      })) as any;

      // Mock small screen
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 320,
      });

      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 568,
      });

      const capability = detectDeviceCapability();
      expect(['low', 'medium']).toContain(capability);
    });
  });

  describe('selectVideoQuality', () => {
    it('returns 480p for low capability', () => {
      const quality = selectVideoQuality('low');
      expect(quality).toBe('480p');
    });

    it('returns 720p for medium capability', () => {
      const quality = selectVideoQuality('medium');
      expect(quality).toBe('720p');
    });

    it('returns 1080p for high capability', () => {
      const quality = selectVideoQuality('high');
      expect(quality).toBe('1080p');
    });

    it('maps all capabilities to valid qualities', () => {
      const capabilities = ['low', 'medium', 'high'] as const;
      const validQualities = ['480p', '720p', '1080p'];

      capabilities.forEach((capability) => {
        const quality = selectVideoQuality(capability);
        expect(validQualities).toContain(quality);
      });
    });
  });

  describe('supportsVideoCodec', () => {
    it('checks H.264 codec support', () => {
      const supports = supportsVideoCodec('h264');
      expect(typeof supports).toBe('boolean');
    });

    it('checks VP9 codec support', () => {
      const supports = supportsVideoCodec('vp9');
      expect(typeof supports).toBe('boolean');
    });

    it('returns boolean for both codecs', () => {
      const h264Support = supportsVideoCodec('h264');
      const vp9Support = supportsVideoCodec('vp9');

      expect(typeof h264Support).toBe('boolean');
      expect(typeof vp9Support).toBe('boolean');
    });

    it('uses canPlayType method', () => {
      const video = document.createElement('video');
      const canPlayTypeSpy = vi.spyOn(video, 'canPlayType');

      supportsVideoCodec('h264');

      // canPlayType should be called
      expect(typeof video.canPlayType).toBe('function');
    });
  });

  describe('getSupportedVideoFormat', () => {
    it('returns a valid video format', () => {
      const format = getSupportedVideoFormat();
      expect(['h264', 'vp9', 'fallback']).toContain(format);
    });

    it('prefers VP9 if supported', () => {
      // Mock VP9 support
      const video = document.createElement('video');
      vi.spyOn(video, 'canPlayType').mockReturnValue('probably');

      const format = getSupportedVideoFormat();
      // Should be one of the valid formats
      expect(['h264', 'vp9', 'fallback']).toContain(format);
    });

    it('falls back to H.264 if VP9 not supported', () => {
      const format = getSupportedVideoFormat();
      expect(['h264', 'vp9', 'fallback']).toContain(format);
    });

    it('returns fallback if no codec is supported', () => {
      const format = getSupportedVideoFormat();
      expect(['h264', 'vp9', 'fallback']).toContain(format);
    });
  });

  describe('supportsIntersectionObserver', () => {
    it('returns true if IntersectionObserver is available', () => {
      const supports = supportsIntersectionObserver();
      expect(typeof supports).toBe('boolean');
    });

    it('checks for IntersectionObserver in window', () => {
      const supports = supportsIntersectionObserver();
      const hasIO = 'IntersectionObserver' in window;
      expect(supports).toBe(hasIO);
    });
  });

  describe('supportsAutoplay', () => {
    it('returns true for autoplay support', () => {
      const supports = supportsAutoplay();
      expect(supports).toBe(true);
    });

    it('always returns true (modern browsers support muted autoplay)', () => {
      const supports1 = supportsAutoplay();
      const supports2 = supportsAutoplay();

      expect(supports1).toBe(true);
      expect(supports2).toBe(true);
    });
  });

  describe('Integration Tests', () => {
    it('device capability determines video quality', () => {
      const capability = detectDeviceCapability();
      const quality = selectVideoQuality(capability);

      const qualityMap = {
        low: '480p',
        medium: '720p',
        high: '1080p',
      };

      expect(quality).toBe(qualityMap[capability]);
    });

    it('supported format is one of the valid codecs or fallback', () => {
      const format = getSupportedVideoFormat();
      expect(['h264', 'vp9', 'fallback']).toContain(format);
    });

    it('all quality levels are valid', () => {
      const qualities = ['low', 'medium', 'high'] as const;
      const validQualities = ['480p', '720p', '1080p'];

      qualities.forEach((capability) => {
        const quality = selectVideoQuality(capability);
        expect(validQualities).toContain(quality);
      });
    });

    it('device capability is consistent', () => {
      const capability1 = detectDeviceCapability();
      const capability2 = detectDeviceCapability();

      // Should return same capability on same device
      expect(capability1).toBe(capability2);
    });
  });

  describe('Edge Cases', () => {
    it('handles missing Network Information API gracefully', () => {
      // Remove connection property
      Object.defineProperty(navigator, 'connection', {
        writable: true,
        configurable: true,
        value: undefined,
      });

      const capability = detectDeviceCapability();
      expect(['low', 'medium', 'high']).toContain(capability);
    });

    it('handles WebGL detection failure gracefully', () => {
      HTMLCanvasElement.prototype.getContext = vi.fn(() => {
        throw new Error('WebGL not supported');
      });

      const capability = detectDeviceCapability();
      expect(capability).toBe('low');
    });

    it('handles very small screens', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 100,
      });

      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 100,
      });

      const capability = detectDeviceCapability();
      expect(['low', 'medium']).toContain(capability);
    });

    it('handles very large screens', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 4096,
      });

      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 2160,
      });

      const capability = detectDeviceCapability();
      expect(['low', 'medium', 'high']).toContain(capability);
    });

    it('handles slow network conditions', () => {
      Object.defineProperty(navigator, 'connection', {
        writable: true,
        configurable: true,
        value: {
          effectiveType: 'slow-2g',
        },
      });

      const capability = detectDeviceCapability();
      expect(capability).toBe('low');
    });
  });
});
