/**
 * Smooth scroll utility with Webflow-style easing
 * Uses easeInOutQuart for premium feel
 */

// Easing functions
export const easings = {
    // Standard smooth easing
    easeInOutQuart: (x: number): number => {
        return x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;
    },

    // More dramatic easing
    easeInOutQuint: (x: number): number => {
        return x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2;
    },

    // Subtle elastic bounce at end
    easeOutBack: (x: number): number => {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
    },

    // Smooth and natural
    easeInOutCubic: (x: number): number => {
        return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    },
};

export type EasingType = keyof typeof easings;

interface SmoothScrollOptions {
    duration?: number;
    easing?: EasingType;
    offset?: number;
    onComplete?: () => void;
}

/**
 * Smoothly scroll to an element by ID with Webflow-style animation
 */
export const smoothScrollTo = (
    elementId: string,
    options: SmoothScrollOptions = {}
): void => {
    const {
        duration = 350,
        easing = 'easeInOutQuart',
        offset = 0,
        onComplete,
    } = options;

    const element = document.getElementById(elementId);
    if (!element) {
        console.warn(`Element with id "${elementId}" not found`);
        return;
    }

    const start = window.scrollY;
    const target = element.getBoundingClientRect().top + window.scrollY + offset;
    const distance = target - start;
    const startTime = performance.now();
    const easingFn = easings[easing];

    let animationId: number;

    const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easingFn(progress);

        window.scrollTo(0, start + distance * easedProgress);

        if (progress < 1) {
            animationId = requestAnimationFrame(animate);
        } else if (onComplete) {
            onComplete();
        }
    };

    // Cancel any existing animation
    if (animationId!) {
        cancelAnimationFrame(animationId);
    }

    animationId = requestAnimationFrame(animate);
};

/**
 * Smoothly scroll to top of page
 */
export const smoothScrollToTop = (options: SmoothScrollOptions = {}): void => {
    const { duration = 800, easing = 'easeInOutQuart', onComplete } = options;

    const start = window.scrollY;
    const startTime = performance.now();
    const easingFn = easings[easing];

    const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easingFn(progress);

        window.scrollTo(0, start * (1 - easedProgress));

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else if (onComplete) {
            onComplete();
        }
    };

    requestAnimationFrame(animate);
};

/**
 * Initialize smooth scroll for all anchor links
 */
export const initSmoothScroll = (options: SmoothScrollOptions = {}): (() => void) => {
    const handleClick = (e: Event) => {
        const target = e.target as HTMLAnchorElement;
        const href = target.getAttribute('href');

        if (href?.startsWith('#') && href.length > 1) {
            e.preventDefault();
            smoothScrollTo(href.slice(1), options);
        }
    };

    document.addEventListener('click', handleClick);

    return () => document.removeEventListener('click', handleClick);
};

export default smoothScrollTo;
