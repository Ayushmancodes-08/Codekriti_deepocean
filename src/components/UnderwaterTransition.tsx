import { useRef, useMemo } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import foregroundRocks from '@/assets/foreground_rocks.png';
import coralMidground from '@/assets/coral_midground.png';
import underwaterMountains from '@/assets/underwater_mountains.png';

interface OceanElement {
    id: string;
    src: string;
    left: string;
    top: string;
    size: number;
    zIndex: number;
    parallaxSpeed: number;
    animationDelay: number;
    animationDuration: number;
    flipX?: boolean;
    rotation?: number;
    type: 'creature' | 'environment';
}

// Sub-component to safely use hooks inside map
const ParallaxOceanElement = ({ element, scrollYProgress }: { element: OceanElement; scrollYProgress: any }) => {
    // Determine parallax range based on speed - deeper/faster elements move more
    const rangeY = element.parallaxSpeed * 200; // Vertical movement
    const rangeX = (element.rotation || 0) * 5; // Horizontal drift based on rotation seed

    // Vertical Parallax
    const parallaxY = useTransform(
        scrollYProgress,
        [0, 1],
        ["-10%", `${rangeY}%`]
    );

    // Horizontal Parallax (Drift)
    const parallaxX = useTransform(
        scrollYProgress,
        [0, 1],
        ["0%", `${rangeX}%`]
    );

    // Rotational Parallax (tumbling effect for some items)
    const rotateParallax = useTransform(
        scrollYProgress,
        [0, 1],
        [0, element.type === 'environment' ? 5 : 15] // Creatures rotate more dynamically
    );

    // Dynamic blur based on depth
    const blurAmount = element.parallaxSpeed < 0.3 ? '1px' : '0px';

    return (
        <motion.div
            style={{
                left: element.left,
                top: element.top,
                y: parallaxY,
                x: parallaxX,
                rotate: rotateParallax,
                zIndex: element.zIndex,
                width: element.size,
                maxWidth: '60vw', // Responsive constraint for mobile
                filter: `blur(${blurAmount})`,
                transformOrigin: 'center center',
                willChange: 'transform',
            }}
            // Mobile Optimization: Scale down slightly on small screens via CSS/Tailwind
            className={`absolute ${element.type === 'creature' ? 'hover:scale-110 cursor-pointer' : ''} transition-transform duration-500 ease-out sm:scale-100 scale-75`}
        >
            <motion.div
                // Separate flip container to avoid conflict with rotation
                style={{ transform: `scaleX(${element.flipX ? -1 : 1})` }}
            >
                <motion.img
                    src={element.src}
                    alt=""
                    className="w-full h-auto drop-shadow-2xl"
                    style={{
                        // Waxy/Glossy look
                        filter: element.type === 'creature' ? 'drop-shadow(0 10px 15px rgba(0,20,50,0.4)) contrast(1.1) brightness(1.05)' : 'none',
                        animation: element.animationDuration > 0
                            ? `${element.type === 'creature' ? 'swim' : 'sway'} ${element.animationDuration}s ease-in-out ${element.animationDelay}s infinite alternate`
                            : 'none'
                    }}
                />
            </motion.div>
        </motion.div >
    );
};

const UnderwaterTransition = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // SMOOTH PHYSICS
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 80, // Slightly softer spring for fluid underwater feel
        damping: 25,
        restDelta: 0.001
    });

    // Parallax transforms using the SMOOTH progress
    const foregroundY = useTransform(smoothProgress, [0, 1], ["0%", "150%"]);
    const midAY = useTransform(smoothProgress, [0, 1], ["0%", "80%"]);
    const midBY = useTransform(smoothProgress, [0, 1], ["0%", "50%"]);
    const bgY = useTransform(smoothProgress, [0, 1], ["0%", "20%"]);

    // God rays fade out as we scroll
    const godRayOpacity = useTransform(smoothProgress, [0, 0.4], [1, 0]);

    // Enhanced "Waxy" Background Colors
    const bgColor = useTransform(
        smoothProgress,
        [0, 0.5, 1],
        ["#172a45", "#0a192f", "#020c1b"]
    );

    // structured ocean elements for "proper" positioning
    const oceanElements = useMemo<OceanElement[]>(() => {
        const elements: OceanElement[] = [];

        // --- 0. BASE FLOOR (Static Foundation) ---
        // Anchors that MOVE with parallax (increased speed from 0.05 to 0.4 for visible motion)
        elements.push(
            {
                id: 'base-stone-left',
                src: '/assets/ocean/sea_stones_cluster_1769969544640.png',
                left: '5%',
                top: '60%', // Start higher so it has room to move down
                size: 300,
                zIndex: 40,
                parallaxSpeed: 0.4, // Significant movement
                animationDelay: 0,
                animationDuration: 0,
                type: 'environment'
            },
            {
                id: 'base-stone-right',
                src: '/assets/ocean/rock_mossy_single_1769969645447.png',
                left: '65%',
                top: '55%', // Start higher 
                size: 350,
                zIndex: 38,
                parallaxSpeed: 0.5, // Even faster for depth variance
                animationDelay: 0,
                animationDuration: 0,
                type: 'environment',
                flipX: true
            },
            {
                id: 'base-coral-center',
                src: '/assets/ocean/coral_fan_seafan_1769969707382.png',
                left: '40%',
                top: '65%',
                size: 250,
                zIndex: 39,
                parallaxSpeed: 0.45,
                animationDelay: 2,
                animationDuration: 12,
                type: 'environment'
            }
        );

        // --- 1. FOREGROUND (Fast, Close, "Hero" Elements) ---
        // Placed in specific focal points to guide the eye
        const foregroundItems = [
            { src: '/assets/ocean/whale_humpback_1769969206274.png', left: '10%', top: '15%', size: 450, flipX: false },
            { src: '/assets/ocean/manta_ray_1769969274048.png', left: '55%', top: '25%', size: 350, flipX: true },
            { src: '/assets/ocean/sea_turtle_1769969240193.png', left: '80%', top: '45%', size: 200, flipX: true },
            { src: '/assets/ocean/fish_school_1769969295035.png', left: '5%', top: '65%', size: 250, flipX: false },
        ];

        foregroundItems.forEach((item, i) => {
            elements.push({
                id: `fore-${i}`,
                src: item.src,
                left: item.left,
                top: item.top,
                size: item.size,
                zIndex: 30,
                parallaxSpeed: 0.6, // Fast but controlled
                type: 'creature',
                flipX: item.flipX,
                rotation: (i % 2 === 0 ? 5 : -5),
                animationDelay: i * 1.5,
                animationDuration: 8 + i
            });
        });

        // --- 2. MIDGROUND (Medium speed, "Filler" Ecosystem) ---
        // Distributed in a grid-like pattern to avoid clumping
        const midGrid = [
            { x: '15%', y: '40%', src: '/assets/ocean/jellyfish_blue_1769969257533.png', size: 120, type: 'creature' },
            { x: '85%', y: '15%', src: '/assets/ocean/jellyfish_blue_1769969257533.png', size: 100, type: 'creature' },
            { x: '45%', y: '55%', src: '/assets/ocean/octopus_purple_1769969223447.png', size: 160, type: 'creature' },
            { x: '75%', y: '60%', src: '/assets/ocean/fish_blue_tang_1769969189595.png', size: 90, type: 'creature' },
            { x: '25%', y: '25%', src: '/assets/ocean/fish_clownfish_1769969172414.png', size: 80, type: 'creature' },
            { x: '65%', y: '35%', src: '/assets/ocean/kelp_seaweed_tall_1769969577936.png', size: 200, type: 'environment' },
            { x: '5%', y: '50%', src: '/assets/ocean/kelp_seaweed_tall_1769969577936.png', size: 180, type: 'environment' },
        ];

        midGrid.forEach((item, i) => {
            elements.push({
                id: `mid-${i}`,
                src: item.src,
                left: item.x,
                top: item.y,
                size: item.size,
                zIndex: 20,
                parallaxSpeed: 0.3, // Consistent mid-speed
                type: item.type as 'creature' | 'environment',
                animationDelay: i * 0.5,
                animationDuration: 6 + Math.random() * 4,
                flipX: Math.random() > 0.5,
                rotation: Math.random() * 10 - 5
            });
        });

        // --- 3. BACKGROUND (Slow, "Ambiance" Layer) ---
        // Placed to fill gaps without distracting
        const backGrid = [
            { x: '5%', y: '10%', src: '/assets/ocean/fish_school_1769969295035.png', size: 150 },
            { x: '80%', y: '5%', src: '/assets/ocean/fish_school_1769969295035.png', size: 150 },
            { x: '90%', y: '80%', src: '/assets/ocean/sea_grass_cluster_1769969611847.png', size: 110 },
            { x: '25%', y: '85%', src: '/assets/ocean/sea_grass_cluster_1769969611847.png', size: 100 },
            { x: '50%', y: '10%', src: '/assets/ocean/coral_fan_seafan_1769969707382.png', size: 140 },
        ];

        backGrid.forEach((item, i) => {
            elements.push({
                id: `back-${i}`,
                src: item.src,
                left: item.x,
                top: item.y,
                size: item.size,
                zIndex: 5,
                parallaxSpeed: 0.1, // Slow drift
                type: 'environment', // Treat varied schools as environment for motion
                animationDelay: i,
                animationDuration: 10,
                flipX: i % 2 === 0
            });
        });

        return elements;
    }, []);

    // Memoize bubbles
    const bubbles = useMemo(() => Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: Math.random() * 8,
        duration: 4 + Math.random() * 8,
        size: 3 + Math.random() * 10
    })), []);

    // Floating particles
    const particles = useMemo(() => Array.from({ length: 30 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: 1 + Math.random() * 3,
        delay: Math.random() * 5,
        duration: 8 + Math.random() * 10
    })), []);

    return (
        <motion.section
            ref={containerRef}
            className="relative w-full overflow-hidden"
            style={{
                backgroundColor: bgColor,
                minHeight: '140vh'
            }}
        >
            {/* 1. WAXY AQUATIC OVERLAY: Creates the 'dense water' feel */}
            <div className="absolute inset-0 z-30 pointer-events-none mix-blend-overlay">
                <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-blue-600/20 to-indigo-900/40 backdrop-blur-[1px]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.15),transparent_70%)]" />
            </div>

            {/* Darker overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-950/40 via-blue-900/60 to-slate-900/80 pointer-events-none z-5" />

            {/* God Rays Overlay */}
            <motion.div
                className="absolute inset-0 pointer-events-none z-10"
                style={{ opacity: godRayOpacity }}
            >
                <div className="absolute top-0 left-[15%] w-24 h-full bg-gradient-to-b from-cyan-300/30 via-cyan-400/10 to-transparent blur-2xl transform -skew-x-12" />
                <div className="absolute top-0 left-[35%] w-32 h-full bg-gradient-to-b from-blue-300/25 via-blue-400/8 to-transparent blur-2xl transform skew-x-6" />
                <div className="absolute top-0 left-1/2 w-28 h-full bg-gradient-to-b from-cyan-200/20 via-cyan-300/8 to-transparent blur-2xl transform -skew-x-6" />
                <div className="absolute top-0 right-[35%] w-36 h-full bg-gradient-to-b from-blue-200/25 via-blue-300/10 to-transparent blur-2xl transform skew-x-12" />
                <div className="absolute top-0 right-[15%] w-24 h-full bg-gradient-to-b from-cyan-300/30 via-cyan-400/10 to-transparent blur-2xl transform -skew-x-12" />
            </motion.div>

            {/* Floating Particles */}
            <div className="absolute inset-0 pointer-events-none z-15 overflow-hidden">
                {particles.map((particle) => (
                    <div
                        key={`particle-${particle.id}`}
                        className="absolute rounded-full bg-cyan-300/40"
                        style={{
                            left: particle.left,
                            top: particle.top,
                            width: particle.size,
                            height: particle.size,
                            animation: `float ${particle.duration}s ease-in-out ${particle.delay}s infinite alternate`,
                            boxShadow: '0 0 8px rgba(103, 232, 249, 0.6)'
                        }}
                    />
                ))}
            </div>

            {/* Rising Bubbles */}
            <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
                {bubbles.map((bubble) => (
                    <div
                        key={`bubble-${bubble.id}`}
                        className="absolute rounded-full bg-white/40 backdrop-blur-sm border border-white/20"
                        style={{
                            left: bubble.left,
                            width: bubble.size,
                            height: bubble.size,
                            animation: `floatUp ${bubble.duration}s linear ${bubble.delay}s infinite`,
                            boxShadow: '0 0 15px rgba(255,255,255,0.4), inset 0 0 5px rgba(255,255,255,0.3)'
                        }}
                    />
                ))}
            </div>

            {/* HD Ocean Creatures and Plants - Using Subcomponent to avoid hook errors */}
            {oceanElements.map((element) => (
                <ParallaxOceanElement
                    key={element.id}
                    element={element}
                    scrollYProgress={smoothProgress}
                />
            ))}

            {/* Layer 4: Background Mountains */}
            <motion.div
                className="absolute inset-0 flex items-end justify-center pointer-events-none z-5"
                style={{ y: bgY }}
            >
                <img
                    src={underwaterMountains}
                    alt=""
                    className="w-full max-w-none h-auto opacity-50 blur-[3px]"
                    style={{ transform: 'translateY(30%) scale(1.3)' }}
                />
            </motion.div>

            {/* Extra Background Layer */}
            <motion.div
                className="absolute inset-0 flex items-end justify-start pointer-events-none z-6"
                style={{ y: useTransform(scrollYProgress, [0, 1], ["0%", "15%"]) }}
            >
                <img
                    src={underwaterMountains}
                    alt=""
                    className="w-3/4 h-auto opacity-30 blur-[4px]"
                    style={{ transform: 'translateY(40%) translateX(-20%)' }}
                />
            </motion.div>

            {/* Layer 3: Midground B - Medium Coral */}
            <motion.div
                className="absolute inset-0 flex items-center justify-around pointer-events-none z-15"
                style={{ y: midBY }}
            >
                <img
                    src={coralMidground}
                    alt=""
                    className="w-72 md:w-96 lg:w-[28rem] h-auto opacity-80"
                    style={{ transform: 'translateX(-40%) translateY(20%)' }}
                />
                <img
                    src={coralMidground}
                    alt=""
                    className="w-64 md:w-80 lg:w-96 h-auto opacity-75"
                    style={{ transform: 'translateY(-15%)' }}
                />
                <img
                    src={coralMidground}
                    alt=""
                    className="w-72 md:w-96 lg:w-[28rem] h-auto opacity-80"
                    style={{ transform: 'translateX(40%) translateY(20%) scaleX(-1)' }}
                />
            </motion.div>

            {/* Layer 2: Midground A - Colorful Coral */}
            <motion.div
                className="absolute inset-0 flex items-center justify-between pointer-events-none z-20 px-0"
                style={{ y: midAY }}
            >
                <div className="flex flex-col gap-32">
                    <img
                        src={coralMidground}
                        alt=""
                        className="w-64 md:w-80 lg:w-[28rem] h-auto opacity-95"
                        style={{ transform: 'translateX(-10%)' }}
                    />
                    <img
                        src={coralMidground}
                        alt=""
                        className="w-56 md:w-72 lg:w-96 h-auto opacity-90"
                        style={{ transform: 'translateX(20%) scaleX(-1)' }}
                    />
                </div>

                <div className="flex flex-col gap-32">
                    <img
                        src={coralMidground}
                        alt=""
                        className="w-56 md:w-72 lg:w-96 h-auto opacity-90"
                        style={{ transform: 'translateX(-20%)' }}
                    />
                    <img
                        src={coralMidground}
                        alt=""
                        className="w-64 md:w-80 lg:w-[28rem] h-auto opacity-95"
                        style={{ transform: 'translateX(10%) scaleX(-1)' }}
                    />
                </div>
            </motion.div>

            {/* Layer 1: Foreground Rocks/Kelp */}
            <motion.div
                className="absolute inset-0 flex items-end justify-between pointer-events-none z-30"
                style={{ y: foregroundY }}
            >
                <div className="relative">
                    <img
                        src={foregroundRocks}
                        alt=""
                        className="w-96 md:w-[28rem] lg:w-[40rem] h-auto opacity-90 blur-[1px]"
                        style={{ transform: 'translateY(15%) translateX(-15%)' }}
                    />
                    <img
                        src={foregroundRocks}
                        alt=""
                        className="absolute bottom-0 left-20 w-80 md:w-96 lg:w-[32rem] h-auto opacity-70 blur-sm"
                        style={{ transform: 'translateY(20%) scaleX(-1)' }}
                    />
                </div>

                <div className="relative">
                    <img
                        src={foregroundRocks}
                        alt=""
                        className="w-96 md:w-[28rem] lg:w-[40rem] h-auto opacity-90 blur-[1px]"
                        style={{ transform: 'translateY(15%) translateX(15%) scaleX(-1)' }}
                    />
                    <img
                        src={foregroundRocks}
                        alt=""
                        className="absolute bottom-0 right-20 w-80 md:w-96 lg:w-[32rem] h-auto opacity-70 blur-sm"
                        style={{ transform: 'translateY(20%)' }}
                    />
                </div>
            </motion.div>

            {/* Additional decorative elements */}
            <div className="absolute inset-0 pointer-events-none z-25">
                {/* Bioluminescent spots */}
                <div className="absolute top-[20%] left-[15%] w-2 h-2 rounded-full bg-cyan-400 blur-sm animate-pulse" />
                <div className="absolute top-[35%] right-[25%] w-3 h-3 rounded-full bg-blue-400 blur-sm animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-[50%] left-[30%] w-2 h-2 rounded-full bg-cyan-300 blur-sm animate-pulse" style={{ animationDelay: '2s' }} />
                <div className="absolute top-[65%] right-[40%] w-3 h-3 rounded-full bg-blue-300 blur-sm animate-pulse" style={{ animationDelay: '1.5s' }} />
                <div className="absolute top-[75%] left-[50%] w-2 h-2 rounded-full bg-cyan-400 blur-sm animate-pulse" style={{ animationDelay: '0.5s' }} />
            </div>

            {/* CSS Animations */}
            <style>{`
        @keyframes floatUp {
          0% {
            transform: translateY(100vh) scale(0.5);
            opacity: 0;
          }
          10% {
            opacity: 0.6;
          }
          50% {
            opacity: 0.9;
          }
          90% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(-10vh) scale(1.2);
            opacity: 0;
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translate(0, 0);
          }
          25% {
            transform: translate(10px, -10px);
          }
          50% {
            transform: translate(-5px, -20px);
          }
          75% {
            transform: translate(-10px, -10px);
          }
        }

        @keyframes swim {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(15px, -5px) rotate(2deg);
          }
          50% {
            transform: translate(5px, -10px) rotate(-1deg);
          }
          75% {
            transform: translate(-5px, -5px) rotate(1deg);
          }
        }

        @keyframes sway {
          0%, 100% {
            transform: translateX(0) rotate(0deg);
          }
          50% {
            transform: translateX(5px) rotate(3deg);
          }
        }
      `}</style>
        </motion.section>
    );
};

export default UnderwaterTransition;
