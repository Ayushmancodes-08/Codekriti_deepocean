// PERFORMANCE: Imports commented out since Lenis is disabled
// import { useEffect } from 'react';
// import Lenis from 'lenis';

const SmoothScroll = ({ children }: { children: React.ReactNode }) => {
    // PERFORMANCE: Disabled Lenis smooth scroll for better performance
    // Using native browser scrolling instead
    /*
    useEffect(() => {
        // Initialize Lenis with optimized Webflow-like settings
        const lenis = new Lenis({
            duration: 0.8,    // Faster, snappier (was 1.2)
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Smooth easeOutExpo
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1.5,  // More responsive wheel (was 1)
            touchMultiplier: 2.5,  // Better touch responsiveness (was 2)
            infinite: false,
        });

        // Optimized RAF loop with cleanup
        let rafId: number;
        function raf(time: number) {
            lenis.raf(time);
            rafId = requestAnimationFrame(raf);
        }
        rafId = requestAnimationFrame(raf);

        // Initial check for hash on page load
        if (window.location.hash) {
            const target = document.querySelector(window.location.hash);
            if (target) {
                lenis.scrollTo(target as HTMLElement);
            }
        }

        // Handle scroll to for internal links
        const handleScrollTo = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const anchor = target.closest('a');

            if (anchor && anchor.hash && anchor.origin === window.location.origin) {
                e.preventDefault();
                const targetElement = document.querySelector(anchor.hash);
                if (targetElement) {
                    lenis.scrollTo(targetElement as HTMLElement);
                }
            }
        };

        document.addEventListener('click', handleScrollTo);

        return () => {
            cancelAnimationFrame(rafId);
            lenis.destroy();
            document.removeEventListener('click', handleScrollTo);
        };
    }, []);
    */

    return <>{children}</>;
};

export default SmoothScroll;
