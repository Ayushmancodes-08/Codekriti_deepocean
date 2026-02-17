import { useEffect } from 'react';
import Lenis from 'lenis';

const SmoothScroll = ({ children }: { children: React.ReactNode }) => {
    useEffect(() => {
        // Initialize Lenis with optimized storytelling settings
        const lenis = new Lenis({
            duration: 0.5,    // Snappier instant feel
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Smooth easeOutExpo
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1.2,  // Responsive but not too fast
            touchMultiplier: 2.0,  // Good touch responsiveness
            infinite: false,
        });

        // Optimized RAF loop with cleanup
        let rafId: number;
        function raf(time: number) {
            lenis.raf(time);
            rafId = requestAnimationFrame(raf);
        }
        rafId = requestAnimationFrame(raf);

        // Expose lenis globally so modals can stop/start it
        (window as any).__lenis = lenis;

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
            (window as any).__lenis = null;
            document.removeEventListener('click', handleScrollTo);
        };
    }, []);

    return <>{children}</>;
};

export default SmoothScroll;
