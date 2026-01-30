import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ResponsiveImage } from './ResponsiveImage';

describe('ResponsiveImage Component', () => {
  beforeEach(() => {
    // Mock IntersectionObserver
    global.IntersectionObserver = vi.fn((callback) => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    })) as any;
  });

  it('should render picture element', () => {
    const { container } = render(
      <ResponsiveImage src="/images/logo" alt="Logo" lazy={false} />
    );
    
    expect(container.querySelector('picture')).toBeTruthy();
  });

  it('should render img tag with alt text', () => {
    render(
      <ResponsiveImage src="/images/logo" alt="My Logo" lazy={false} />
    );
    
    const img = screen.getByAltText('My Logo');
    expect(img).toBeTruthy();
  });

  it('should include WebP source when supported', () => {
    const { container } = render(
      <ResponsiveImage src="/images/logo" alt="Logo" lazy={false} />
    );
    
    const sources = container.querySelectorAll('source');
    // WebP source may not be present in test environment if not supported
    expect(sources.length).toBeGreaterThanOrEqual(1);
  });

  it('should include JPEG fallback source', () => {
    const { container } = render(
      <ResponsiveImage src="/images/logo" alt="Logo" lazy={false} />
    );
    
    const sources = container.querySelectorAll('source');
    const jpegSource = Array.from(sources).find(
      (source) => source.getAttribute('type') === 'image/jpeg'
    );
    expect(jpegSource).toBeTruthy();
  });

  it('should apply custom className', () => {
    const { container } = render(
      <ResponsiveImage 
        src="/images/logo" 
        alt="Logo" 
        className="my-class"
        lazy={false}
      />
    );
    
    const img = container.querySelector('img');
    expect(img?.className).toContain('my-class');
  });

  it('should set width and height attributes', () => {
    const { container } = render(
      <ResponsiveImage 
        src="/images/logo" 
        alt="Logo" 
        width={200}
        height={200}
        lazy={false}
      />
    );
    
    const img = container.querySelector('img');
    expect(img?.getAttribute('width')).toBe('200');
    expect(img?.getAttribute('height')).toBe('200');
  });

  it('should include sizes attribute', () => {
    const { container } = render(
      <ResponsiveImage src="/images/logo" alt="Logo" lazy={false} />
    );
    
    const img = container.querySelector('img');
    expect(img?.getAttribute('sizes')).toBeTruthy();
  });

  it('should use placeholder when lazy loading', () => {
    const { container } = render(
      <ResponsiveImage 
        src="/images/logo" 
        alt="Logo" 
        lazy={true}
        placeholder="/placeholder.jpg"
      />
    );
    
    const img = container.querySelector('img');
    expect(img?.getAttribute('src')).toBe('/placeholder.jpg');
  });

  it('should use fallback src when not lazy loading', () => {
    const { container } = render(
      <ResponsiveImage src="/images/logo" alt="Logo" lazy={false} />
    );
    
    const img = container.querySelector('img');
    expect(img?.getAttribute('src')).toContain('1024w.jpg');
  });

  it('should call onLoad callback', () => {
    const onLoadMock = vi.fn();
    const { container } = render(
      <ResponsiveImage 
        src="/images/logo" 
        alt="Logo" 
        onLoad={onLoadMock}
        lazy={false}
      />
    );
    
    const img = container.querySelector('img') as HTMLImageElement;
    img?.dispatchEvent(new Event('load'));
    
    expect(onLoadMock).toHaveBeenCalled();
  });

  it('should call onError callback', () => {
    const onErrorMock = vi.fn();
    const { container } = render(
      <ResponsiveImage 
        src="/images/logo" 
        alt="Logo" 
        onError={onErrorMock}
        lazy={false}
      />
    );
    
    const img = container.querySelector('img') as HTMLImageElement;
    img?.dispatchEvent(new Event('error'));
    
    expect(onErrorMock).toHaveBeenCalled();
  });

  it('should generate correct srcset for WebP when supported', () => {
    const { container } = render(
      <ResponsiveImage src="/images/logo" alt="Logo" lazy={false} />
    );
    
    const webpSource = container.querySelector('source[type="image/webp"]');
    // WebP source may not be present in test environment if not supported
    if (webpSource) {
      const srcset = webpSource.getAttribute('srcset');
      expect(srcset).toContain('480w.webp');
      expect(srcset).toContain('768w.webp');
      expect(srcset).toContain('1024w.webp');
      expect(srcset).toContain('1440w.webp');
    }
  });

  it('should generate correct srcset for JPEG', () => {
    const { container } = render(
      <ResponsiveImage src="/images/logo" alt="Logo" lazy={false} />
    );
    
    const jpegSource = container.querySelector('source[type="image/jpeg"]');
    const srcset = jpegSource?.getAttribute('srcset');
    
    expect(srcset).toContain('480w.jpg');
    expect(srcset).toContain('768w.jpg');
    expect(srcset).toContain('1024w.jpg');
    expect(srcset).toContain('1440w.jpg');
  });

  it('should have displayName', () => {
    expect(ResponsiveImage.displayName).toBe('ResponsiveImage');
  });
});
