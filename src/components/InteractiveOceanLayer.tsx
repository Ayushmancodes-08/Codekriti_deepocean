import { useRef, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// Ocean element type definitions
interface OceanElement {
    id: string;
    type: 'creature' | 'environment';
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
}

const InteractiveOceanLayer = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // Generate randomized ocean elements with realistic distribution
    const oceanElements = useMemo<OceanElement[]>(() => {
        const elements: OceanElement[] = [];

        // Seafloor elements (slowest parallax - bottom layer)
        const seafloorElements = [
            { src: '/artifacts/sea_stones_cluster_1769969544640.png', baseSize: 120, count: 2 },
            { src: '/artifacts/octopus_wrapped_stone_1769969561487.png', baseSize: 180, count: 1 },
            { src: '/artifacts/rock_mossy_single_1769969645447.png', baseSize: 100, count: 2 },
        ];

        seafloorElements.forEach(({ src, baseSize, count }) => {
            for (let i = 0; i < count; i++) {
                elements.push({
                    id: `seafloor-${src}-${i}`,
                    type: 'environment',
                    src,
                    left: `${Math.random() * 90 + 5}%`,
                    top: `${Math.random() * 30 + 60}%`, // Bottom third
                    size: baseSize + Math.random() * 40,
                    zIndex: 5,
                    parallaxSpeed: 0.15,
                    animationDelay: Math.random() * 3,
                    animationDuration: 0, // Static elements
                    flipX: Math.random() > 0.5,
                });
            }
        });

        // Bottom vegetation (slow parallax)
        const bottomVegetation = [
            { src: '/artifacts/sea_grass_cluster_1769969611847.png', baseSize: 80, count: 4 },
            { src: '/artifacts/anemone_colorful_1769969629357.png', baseSize: 60, count: 3 },
            { src: '/artifacts/coral_pink_branching_1769969596186.png', baseSize: 70, count: 2 },
        ];

        bottomVegetation.forEach(({ src, baseSize, count }) => {
            for (let i = 0; i < count; i++) {
                elements.push({
                    id: `vegetation-${src}-${i}`,
                    type: 'environment',
                    src,
                    left: `${Math.random() * 90 + 5}%`,
                    top: `${Math.random() * 40 + 50}%`, // Lower half
                    size: baseSize + Math.random() * 30,
                    zIndex: 10,
                    parallaxSpeed: 0.3,
                    animationDelay: Math.random() * 4,
                    animationDuration: 8 + Math.random() * 4, // Gentle swaying
                });
            }
        });

        // Midground elements (medium parallax)
        const midgroundElements = [
            { src: '/artifacts/kelp_seaweed_tall_1769969577936.png', baseSize: 140, count: 3 },
            { src: '/artifacts/coral_fan_seafan_1769969707382.png', baseSize: 90, count: 2 },
            { src: '/artifacts/fish_blue_tang_1769969189595.png', baseSize: 60, count: 2 },
            { src: '/artifacts/fish_clownfish_1769969172414.png', baseSize: 50, count: 3 },
            { src: '/artifacts/octopus_purple_1769969223447.png', baseSize: 100, count: 1 },
        ];

        midgroundElements.forEach(({ src, baseSize, count }) => {
            for (let i = 0; i < count; i++) {
                const isCreature = src.includes('fish') || src.includes('octopus');
                elements.push({
                    id: `midground-${src}-${i}`,
                    type: isCreature ? 'creature' : 'environment',
                    src,
                    left: `${Math.random() * 85 + 5}%`,
                    top: `${Math.random() * 60 + 20}%`, // Middle section
                    size: baseSize + Math.random() * 30,
                    zIndex: 20,
                    parallaxSpeed: 0.5,
                    animationDelay: Math.random() * 5,
                    animationDuration: isCreature ? 6 + Math.random() * 4 : 10 + Math.random() * 5,
                    flipX: Math.random() > 0.5,
                    rotation: Math.random() * 20 - 10,
                });
            }
        });

        // Foreground elements (fast parallax)
        const foregroundElements = [
            { src: '/artifacts/whale_humpback_1769969206274.png', baseSize: 200, count: 1 },
            { src: '/artifacts/manta_ray_1769969274048.png', baseSize: 150, count: 1 },
            { src: '/artifacts/sea_turtle_1769969240193.png', baseSize: 120, count: 2 },
            { src: '/artifacts/jellyfish_blue_1769969257533.png', baseSize: 80, count: 2 },
            { src: '/artifacts/fish_school_1769969295035.png', baseSize: 70, count: 3 },
        ];

        foregroundElements.forEach(({ src, baseSize, count }) => {
            for (let i = 0; i < count; i++) {
                elements.push({
                    id: `foreground-${src}-${i}`,
                    type: 'creature',
                    src,
                    left: `${Math.random() * 80 + 10}%`,
                    top: `${Math.random() * 70 + 10}%`, // Spread across
                    size: baseSize + Math.random() * 50,
                    zIndex: 30,
                    parallaxSpeed: 0.8,
                    animationDelay: Math.random() * 6,
                    animationDuration: 8 + Math.random() * 6,
                    flipX: Math.random() > 0.5,
                    rotation: Math.random() * 15 - 7.5,
                });
            }
        });

        return elements;
    }, []);

    // Background gradient animation
    const bgColor = useTransform(
        scrollYProgress,
        [0, 0.5, 1],
        ["#1e3a8a", "#0c4a6e", "#082f49"]
    );

    return (
        <motion.section
            ref={containerRef}
            className="relative w-full overflow-hidden"
            style={{
                backgroundColor: bgColor,
                minHeight: '100vh'
            }}
        >
            {/* Depth gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-900/30 via-blue-950/50 to-slate-950/70 pointer-events-none z-1" />

            {/* Animated water caustics */}
            <div className="absolute inset-0 pointer-events-none z-2 opacity-20">
                <div className="absolute w-full h-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,200,255,0.3),transparent)] animate-pulse" />
            </div>

            {/* Ocean elements */}
            {oceanElements.map((element) => {
                const parallaxY = useTransform(
                    scrollYProgress,
                    [0, 1],
                    ["0%", `${element.parallaxSpeed * 100}%`]
                );

                return (
                    <motion.div
                        key={element.id}
                        className={`absolute ${element.type === 'creature' ? 'hover:scale-110 cursor-pointer' : ''} transition-transform duration-300`}
                        style={{
                            left: element.left,
                            top: element.top,
                            y: parallaxY,
                            zIndex: element.zIndex,
                            width: element.size,
                            transform: `scaleX(${element.flipX ? -1 : 1}) rotate(${element.rotation || 0}deg)`,
                            willChange: 'transform',
                        }}
                    >
                        <motion.img
                            src={element.src}
                            alt=""
                            className="w-full h-auto"
                            style={{
                                filter: 'none',
                                animation: element.animationDuration > 0
                                    ? `${element.type === 'creature' ? 'swim' : 'sway'} ${element.animationDuration}s ease-in-out ${element.animationDelay}s infinite alternate`
                                    : 'none'
                            }}
                            whileHover={element.type === 'creature' ? {
                                scale: 1.05,
                                filter: 'brightness(1.2)',
                            } : undefined}
                        />
                    </motion.div>
                );
            })}

            {/* CSS Animations */}
            <style>{`
        @keyframes swim {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(10px, -5px) rotate(2deg);
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

export default InteractiveOceanLayer;
