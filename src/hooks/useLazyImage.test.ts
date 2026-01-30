import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useLazyImage } from './useLazyImage';

describe('useLazyImage Hook', () => {
  beforeEach(() => {
    // Mock IntersectionObserver
    global.IntersectionObserver = vi.fn((callback) => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    })) as any;
  });

  it('should initialize with correct state', () => {
    const { result } = renderHook(() => useLazyImage());
    
    expect(result.current.isLoaded).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(result.current.ref).toBeDefined();
  });

  it('should return a ref object', () => {
    const { result } = renderHook(() => useLazyImage());
    
    expect(result.current.ref).toHaveProperty('current');
  });

  it('should accept custom IntersectionObserver options', () => {
    const options = { rootMargin: '100px' };
    const { result } = renderHook(() => useLazyImage(options));
    
    expect(result.current.ref).toBeDefined();
  });

  it('should set up IntersectionObserver on mount', () => {
    const observeMock = vi.fn();
    global.IntersectionObserver = vi.fn(() => ({
      observe: observeMock,
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    })) as any;

    renderHook(() => useLazyImage());
    
    expect(global.IntersectionObserver).toHaveBeenCalled();
  });

  it('should have default rootMargin of 50px', () => {
    const constructorMock = vi.fn(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));
    global.IntersectionObserver = constructorMock as any;

    renderHook(() => useLazyImage());
    
    const callArgs = constructorMock.mock.calls[0][1];
    expect(callArgs.rootMargin).toBe('50px');
  });

  it('should override default rootMargin with custom options', () => {
    const constructorMock = vi.fn(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));
    global.IntersectionObserver = constructorMock as any;

    renderHook(() => useLazyImage({ rootMargin: '100px' }));
    
    const callArgs = constructorMock.mock.calls[0][1];
    expect(callArgs.rootMargin).toBe('100px');
  });
});
