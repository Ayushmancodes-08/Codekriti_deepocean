import { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';

interface CursorState {
    isHovering: boolean;
    isClicking: boolean;
    hoverType: 'default' | 'button' | 'link' | 'text';
}

interface TrailParticle {
    id: number;
    x: number;
    y: number;
}

interface Ripple {
    id: number;
    x: number;
    y: number;
}

/**
 * Custom Cursor Component
 * Beautiful ocean-themed cursor with smooth animations and interactive states
 * Linked strictly to the website's dark-blue and cyan theme
 */
const CustomCursor = () => {
    const [cursorState, setCursorState] = useState<CursorState>({
        isHovering: false,
        isClicking: false,
        hoverType: 'default',
    });
    const [isVisible, setIsVisible] = useState(false);
    const cursorRef = useRef<HTMLDivElement>(null);
    const [trail, setTrail] = useState<TrailParticle[]>([]);
    const [ripples, setRipples] = useState<Ripple[]>([]);

    // Use motion values for smooth cursor tracking
    const cursorX = useMotionValue(0);
    const cursorY = useMotionValue(0);

    // Spring config for smooth following - "underwater" feel
    const springConfig = { damping: 25, stiffness: 350 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    // Hide on mobile/touch devices
    const [isTouchDevice, setIsTouchDevice] = useState(false);

    useEffect(() => {
        // Detect touch device
        const checkTouch = () => {
            setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
        };
        checkTouch();

        if (isTouchDevice) return;

        const addTrailParticle = (x: number, y: number) => {
            setTrail(prev => {
                const newTrail = [...prev, { id: Date.now() + Math.random(), x, y }];
                if (newTrail.length > 8) newTrail.shift(); // Limit trail length
                return newTrail;
            });
        };

        const updateCursorPosition = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
            if (!isVisible) setIsVisible(true);

            // Add trail particle occasionally for bubble effect
            if (Math.random() > 0.7) {
                addTrailParticle(e.clientX, e.clientY);
            }
        };

        const handleMouseDown = (e: MouseEvent) => {
            setCursorState(prev => ({ ...prev, isClicking: true }));

            // Add sonar ripple
            const newRipple = { id: Date.now(), x: e.clientX, y: e.clientY };
            setRipples(prev => [...prev, newRipple]);

            setTimeout(() => {
                setRipples(prev => prev.filter(r => r.id !== newRipple.id));
            }, 1000);
        };

        const handleMouseUp = () => {
            setCursorState(prev => ({ ...prev, isClicking: false }));
        };

        const handleMouseEnter = () => setIsVisible(true);
        const handleMouseLeave = () => setIsVisible(false);

        // Detect hoverable elements
        const handleElementHover = (e: MouseEvent) => {
            const target = e.target as HTMLElement;

            // Selectors based on your actual components
            const isButton = target.closest('button, .video-scrub-container, [role="button"], .dive-in-btn');
            const isLink = target.closest('a, [role="link"]');
            const isInteractive = target.closest('input, textarea, select');

            // Check for text selection/hover (optional, kept minimal)
            // const isText = target.closest('p, h1, h2, h3, h4, h5, h6');

            if (isButton) {
                setCursorState(prev => ({ ...prev, isHovering: true, hoverType: 'button' }));
            } else if (isLink) {
                setCursorState(prev => ({ ...prev, isHovering: true, hoverType: 'link' }));
            } else if (isInteractive) {
                setCursorState(prev => ({ ...prev, isHovering: true, hoverType: 'text' }));
            } else {
                setCursorState(prev => ({ ...prev, isHovering: false, hoverType: 'default' }));
            }
        };

        window.addEventListener('mousemove', updateCursorPosition);
        window.addEventListener('mousemove', handleElementHover);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        document.body.addEventListener('mouseenter', handleMouseEnter);
        document.body.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            window.removeEventListener('mousemove', updateCursorPosition);
            window.removeEventListener('mousemove', handleElementHover);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            document.body.removeEventListener('mouseenter', handleMouseEnter);
            document.body.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [isTouchDevice, isVisible, cursorX, cursorY]);

    // Don't render on touch devices
    if (isTouchDevice) return null;

    const getCursorSize = () => {
        if (cursorState.isClicking) return 12;
        if (cursorState.hoverType === 'button') return 64;
        if (cursorState.hoverType === 'link') return 48;
        return 20;
    };

    const getCursorColor = () => {
        if (cursorState.hoverType === 'button') return 'rgba(0, 217, 255, 0.4)'; // #00D9FF (Cyan)
        if (cursorState.hoverType === 'link') return 'rgba(0, 217, 255, 0.2)';   // Cyan but lighter
        return 'rgba(255, 255, 255, 0.1)';
    };

    const getBorderColor = () => {
        if (cursorState.hoverType === 'button') return '#00D9FF'; // #00D9FF (Cyan)
        if (cursorState.hoverType === 'link') return '#00D9FF';
        return 'rgba(255, 255, 255, 0.4)';
    };

    return (
        <>
            {/* Sonar Ripples */}
            <AnimatePresence>
                {ripples.map((ripple) => (
                    <motion.div
                        key={ripple.id}
                        initial={{ width: 0, height: 0, opacity: 0.8, borderWidth: 2 }}
                        animate={{ width: 300, height: 300, opacity: 0, borderWidth: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="fixed pointer-events-none rounded-full z-[9990]"
                        style={{
                            left: ripple.x,
                            top: ripple.y,
                            transform: 'translate(-50%, -50%)',
                            borderColor: '#00D9FF',
                            borderStyle: 'solid',
                            background: 'radial-gradient(circle, rgba(0,217,255,0.1) 0%, rgba(0,0,0,0) 70%)',
                            // We need to use x and y from style to center properly with fixed position if we don't use translate
                            // But here we use 'translate(-50%, -50%)' in transform which works with fixed left/top.
                            // Note: framer motion transform prop overrides style transform.
                            // So we should put x: '-50%', y: '-50%' in animate if possible, or use x/y instead of left/top.
                            // Let's stick to left/top + CSS transform for simplicity if it works.
                            // Actually, better to use x and y in style with negative margins or x/y offset.
                            x: "-50%",
                            y: "-50%",
                        }}
                    />
                ))}
            </AnimatePresence>

            {/* Bubble Trail */}
            <AnimatePresence>
                {trail.map((t) => (
                    <motion.div
                        key={t.id}
                        initial={{ opacity: 0.5, scale: 0.5 }}
                        animate={{ opacity: 0, scale: 0, y: -20 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8 }}
                        className="fixed pointer-events-none rounded-full bg-cyan-400/30 z-[9998]"
                        style={{
                            left: t.x,
                            top: t.y,
                            width: 4,
                            height: 4,
                        }}
                    />
                ))}
            </AnimatePresence>

            {/* Main cursor ring */}
            <motion.div
                ref={cursorRef}
                className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-screen"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                }}
            >
                <motion.div
                    className="rounded-full flex items-center justify-center backdrop-blur-[1px]"
                    animate={{
                        width: getCursorSize(),
                        height: getCursorSize(),
                        x: -getCursorSize() / 2,
                        y: -getCursorSize() / 2,
                        backgroundColor: getCursorColor(),
                        border: `1px solid ${getBorderColor()}`,
                        opacity: isVisible ? 1 : 0,
                    }}
                    transition={{
                        type: 'spring',
                        damping: 25,
                        stiffness: 300,
                    }}
                >
                    {/* Hover text indicators */}
                    {cursorState.hoverType === 'button' && !cursorState.isClicking && (
                        <motion.span
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            className="text-[10px] font-bold text-white uppercase tracking-widest drop-shadow-[0_0_5px_rgba(0,217,255,0.8)]"
                        >
                            OPEN
                        </motion.span>
                    )}
                    {cursorState.hoverType === 'link' && !cursorState.isClicking && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_10px_#00D9FF]"
                        />
                    )}
                </motion.div>
            </motion.div>

            {/* Center dot */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                }}
                animate={{
                    width: 6,
                    height: 6,
                    marginLeft: -3,
                    marginTop: -3,
                    opacity: isVisible && !cursorState.isHovering ? 1 : 0,
                }}
                transition={{
                    type: 'spring',
                    damping: 30,
                    stiffness: 400,
                }}
            />

            {/* Hide default cursor globally */}
            <style>{`
        * {
          cursor: none !important;
        }
        /* Restore cursor for touch devices just in case */
        @media (hover: none) and (pointer: coarse) {
            * {
                cursor: auto !important;
            }
        }
      `}</style>
        </>
    );
};

export default CustomCursor;
