import { useEffect, useRef, useState } from 'react';

/**
 * Hook for lazy loading images with Intersection Observer
 * Supports loading images only when they enter the viewport
 */
export function useLazyImage(options?: IntersectionObserverInit) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && ref.current) {
        // Start loading the image
        const img = ref.current;
        
        // Handle image load
        const handleLoad = () => {
          setIsLoaded(true);
          setIsError(false);
        };

        // Handle image error
        const handleError = () => {
          setIsError(true);
          setIsLoaded(false);
        };

        img.addEventListener('load', handleLoad);
        img.addEventListener('error', handleError);

        // Trigger the load by setting src if not already set
        if (img.dataset.src && !img.src) {
          img.src = img.dataset.src;
        }
        if (img.dataset.srcset && !img.srcSet) {
          img.srcSet = img.dataset.srcset;
        }

        // Stop observing this element
        observer.unobserve(img);

        return () => {
          img.removeEventListener('load', handleLoad);
          img.removeEventListener('error', handleError);
        };
      }
    }, {
      rootMargin: '50px', // Start loading 50px before entering viewport
      ...options,
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [options]);

  return { ref, isLoaded, isError };
}
