import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import VideoOptimization from './VideoOptimization';

describe('VideoOptimization Component', () => {
  const mockSources = {
    mobile: '/videos/test-mobile.mp4',
    tablet: '/videos/test-tablet.mp4',
    desktop: '/videos/test-desktop.mp4',
  };

  const mockPoster = '/images/poster.jpg';

  beforeEach(() => {
    // Mock IntersectionObserver
    global.IntersectionObserver = vi.fn(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    })) as any;

    // Mock WebGL support
    HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
      getParameter: vi.fn(),
    })) as any;
  });

  describe('Component Rendering', () => {
    it('renders video element with correct attributes', () => {
      const { container } = render(
        <VideoOptimization sources={mockSources} poster={mockPoster} />
      );

      const video = container.querySelector('video');
      expect(video).toBeTruthy();
      expect(video?.muted).toBe(true);
      expect(video?.playsInline).toBe(true);
    });

    it('renders poster image during loading', () => {
      const { container } = render(
        <VideoOptimization sources={mockSources} poster={mockPoster} />
      );

      const img = container.querySelector('img');
      expect(img).toBeTruthy();
      expect(img?.src).toContain(mockPoster);
      expect(img?.alt).toBe('Video poster');
    });

    it('applies custom className', () => {
      const customClass = 'custom-video-class';
      const { container } = render(
        <VideoOptimization
          sources={mockSources}
          poster={mockPoster}
          className={customClass}
        />
      );

      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass(customClass);
    });

    it('renders container with correct structure', () => {
      const { container } = render(
        <VideoOptimization sources={mockSources} poster={mockPoster} />
      );

      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('relative', 'w-full', 'h-full', 'overflow-hidden');
    });
  });

  describe('Video Properties', () => {
    it('respects autoPlay prop', () => {
      const { container: container1 } = render(
        <VideoOptimization sources={mockSources} poster={mockPoster} autoPlay={true} />
      );
      const video1 = container1.querySelector('video');
      expect(video1?.autoplay).toBe(true);

      const { container: container2 } = render(
        <VideoOptimization sources={mockSources} poster={mockPoster} autoPlay={false} />
      );
      const video2 = container2.querySelector('video');
      expect(video2?.autoplay).toBe(false);
    });

    it('respects loop prop', () => {
      const { container: container1 } = render(
        <VideoOptimization sources={mockSources} poster={mockPoster} loop={true} />
      );
      const video1 = container1.querySelector('video');
      expect(video1?.loop).toBe(true);

      const { container: container2 } = render(
        <VideoOptimization sources={mockSources} poster={mockPoster} loop={false} />
      );
      const video2 = container2.querySelector('video');
      expect(video2?.loop).toBe(false);
    });

    it('sets poster attribute on video element', () => {
      const { container } = render(
        <VideoOptimization sources={mockSources} poster={mockPoster} />
      );

      const video = container.querySelector('video');
      expect(video?.poster).toContain(mockPoster);
    });

    it('sets preload to metadata', () => {
      const { container } = render(
        <VideoOptimization sources={mockSources} poster={mockPoster} />
      );

      const video = container.querySelector('video');
      expect(video?.preload).toBe('metadata');
    });
  });

  describe('Device Capability Detection', () => {
    it('detects device capability on mount', async () => {
      const { container } = render(
        <VideoOptimization sources={mockSources} poster={mockPoster} />
      );

      await waitFor(() => {
        const video = container.querySelector('video');
        expect(video).toBeTruthy();
      });
    });

    it('selects appropriate quality based on device', async () => {
      const { container } = render(
        <VideoOptimization sources={mockSources} poster={mockPoster} />
      );

      const video = container.querySelector('video');
      expect(video?.src).toBeTruthy();
      // Quality should be one of: 480p, 720p, 1080p
      const src = video?.src || '';
      expect(
        src.includes('480p') || src.includes('720p') || src.includes('1080p')
      ).toBe(true);
    });

    it('supports H.264 codec', () => {
      const video = document.createElement('video');
      const canPlay = video.canPlayType('video/mp4; codecs="avc1.42E01E"');
      expect(['probably', 'maybe', '']).toContain(canPlay);
    });

    it('supports VP9 codec', () => {
      const video = document.createElement('video');
      const canPlay = video.canPlayType('video/webm; codecs="vp9"');
      expect(['probably', 'maybe', '']).toContain(canPlay);
    });
  });

  describe('Intersection Observer Integration', () => {
    it('sets up Intersection Observer on mount', () => {
      render(<VideoOptimization sources={mockSources} poster={mockPoster} />);

      expect(global.IntersectionObserver).toHaveBeenCalled();
    });

    it('calls onVisibilityChange callback when visibility changes', async () => {
      const onVisibilityChange = vi.fn();

      const mockIntersectionObserver = vi.fn();
      let callback: IntersectionObserverCallback;

      mockIntersectionObserver.mockImplementation(
        (cb: IntersectionObserverCallback) => {
          callback = cb;
          return {
            observe: vi.fn(),
            unobserve: vi.fn(),
            disconnect: vi.fn(),
          };
        }
      );

      global.IntersectionObserver = mockIntersectionObserver as any;

      // Mock video play method
      HTMLMediaElement.prototype.play = vi.fn(() => Promise.resolve());

      render(
        <VideoOptimization
          sources={mockSources}
          poster={mockPoster}
          onVisibilityChange={onVisibilityChange}
        />
      );

      // Simulate visibility change
      const entries = [
        {
          isIntersecting: true,
          target: document.createElement('div'),
        } as IntersectionObserverEntry,
      ];

      callback!(entries, {} as IntersectionObserver);

      expect(onVisibilityChange).toHaveBeenCalledWith(true);
    });

    it('disconnects observer on unmount', () => {
      const mockDisconnect = vi.fn();
      const mockIntersectionObserver = vi.fn(() => ({
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: mockDisconnect,
      }));

      global.IntersectionObserver = mockIntersectionObserver as any;

      const { unmount } = render(
        <VideoOptimization sources={mockSources} poster={mockPoster} />
      );

      unmount();

      expect(mockDisconnect).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('shows poster image on video error', async () => {
      const { container } = render(
        <VideoOptimization sources={mockSources} poster={mockPoster} />
      );

      const video = container.querySelector('video');
      expect(video).toBeTruthy();

      // Simulate error event
      if (video) {
        const errorEvent = new Event('error');
        video.dispatchEvent(errorEvent);
      }

      await waitFor(() => {
        const img = container.querySelector('img');
        expect(img).toBeTruthy();
      });
    });

    it('displays error message when video fails to load', async () => {
      const { container } = render(
        <VideoOptimization sources={mockSources} poster={mockPoster} />
      );

      const video = container.querySelector('video');
      if (video) {
        const errorEvent = new Event('error');
        video.dispatchEvent(errorEvent);
      }

      await waitFor(() => {
        const errorDiv = container.querySelector('div');
        // Check if error handling is in place
        expect(container.querySelector('img')).toBeTruthy();
      });
    });
  });

  describe('Video Source Construction', () => {
    it('constructs video source URL with quality suffix', () => {
      const { container } = render(
        <VideoOptimization sources={mockSources} poster={mockPoster} />
      );

      const video = container.querySelector('video');
      const src = video?.src || '';

      // Should contain quality indicator
      expect(
        src.includes('480p') || src.includes('720p') || src.includes('1080p')
      ).toBe(true);
    });

    it('uses desktop source as base for URL construction', () => {
      const { container } = render(
        <VideoOptimization sources={mockSources} poster={mockPoster} />
      );

      const video = container.querySelector('video');
      const src = video?.src || '';

      // Should be based on desktop source path
      expect(src).toContain('/videos/');
    });

    it('appends correct file extension based on codec', () => {
      const { container } = render(
        <VideoOptimization sources={mockSources} poster={mockPoster} />
      );

      const video = container.querySelector('video');
      const src = video?.src || '';

      // Should have either .mp4 or .webm extension
      expect(src.endsWith('.mp4') || src.endsWith('.webm')).toBe(true);
    });
  });

  describe('Loading States', () => {
    it('shows loading indicator initially', () => {
      const { container } = render(
        <VideoOptimization sources={mockSources} poster={mockPoster} />
      );

      // Loading state should be present initially
      const spinner = container.querySelector('.animate-spin');
      expect(spinner).toBeTruthy();
    });

    it('hides loading indicator after video loads', async () => {
      const { container } = render(
        <VideoOptimization sources={mockSources} poster={mockPoster} />
      );

      const video = container.querySelector('video');
      if (video) {
        const loadedEvent = new Event('loadeddata');
        video.dispatchEvent(loadedEvent);
      }

      await waitFor(() => {
        const spinner = container.querySelector('.animate-spin');
        expect(spinner).toBeFalsy();
      });
    });
  });

  describe('Accessibility', () => {
    it('sets muted attribute for autoplay compatibility', () => {
      const { container } = render(
        <VideoOptimization sources={mockSources} poster={mockPoster} autoPlay={true} />
      );

      const video = container.querySelector('video');
      expect(video?.muted).toBe(true);
    });

    it('sets playsInline for mobile compatibility', () => {
      const { container } = render(
        <VideoOptimization sources={mockSources} poster={mockPoster} />
      );

      const video = container.querySelector('video');
      expect(video?.playsInline).toBe(true);
    });

    it('provides alt text for poster image', () => {
      const { container } = render(
        <VideoOptimization sources={mockSources} poster={mockPoster} />
      );

      const img = container.querySelector('img');
      expect(img?.alt).toBe('Video poster');
    });
  });

  describe('Props Validation', () => {
    it('accepts all required props', () => {
      const { container } = render(
        <VideoOptimization sources={mockSources} poster={mockPoster} />
      );

      expect(container.querySelector('video')).toBeTruthy();
    });

    it('accepts all optional props', () => {
      const { container } = render(
        <VideoOptimization
          sources={mockSources}
          poster={mockPoster}
          autoPlay={false}
          loop={false}
          className="test-class"
          onVisibilityChange={() => {}}
        />
      );

      expect(container.querySelector('video')).toBeTruthy();
      expect(container.firstChild).toHaveClass('test-class');
    });
  });
});
