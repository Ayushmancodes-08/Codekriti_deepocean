import { useRef, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import foregroundRocks from '@/assets/foreground_rocks.png';
import coralMidground from '@/assets/coral_midground.png';
import underwaterMountains from '@/assets/underwater_mountains.png';

const UnderwaterTransition = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // Parallax transforms - different speeds for depth
    const foregroundY = useTransform(scrollYProgress, [0, 1], ["0%", "150%"]);
    const midAY = useTransform(scrollYProgress, [0, 1], ["0%", "80%"]);
    const midBY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

    // God rays fade out as we scroll
    const godRayOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    // Background color transition (surface → deep → abyss)
    const bgColor = useTransform(
        scrollYProgress,
        [0, 0.5, 1],
        ["#1E40AF", "#0C4A6E", "#0F172A"]
    );

    // Memoize bubbles - MORE bubbles (50 instead of 20)
    const bubbles = useMemo(() => Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: Math.random() * 8,
        duration: 4 + Math.random() * 8,
        size: 3 + Math.random() * 10
    })), []);

    // Floating particles for extra atmosphere
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
                minHeight: '120vh' // Increased from 100vh
            }}
        >
            {/* Darker overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-950/40 via-blue-900/60 to-slate-900/80 pointer-events-none z-5" />

            {/* God Rays Overlay - MORE rays */}
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

            {/* Rising Bubbles - INCREASED count */}
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

            {/* Layer 4: Background Mountains (Slowest - 20%) - MULTIPLE instances */}
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

            {/* Layer 3: Midground B - Medium Coral (50%) - MORE instances */}
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

            {/* Layer 2: Midground A - Colorful Coral (80%) - MORE instances */}
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

            {/* Layer 1: Foreground Rocks/Kelp (Fastest - 150%) - ENHANCED */}
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
      `}</style>
        </motion.section>
    );
};

export default UnderwaterTransition;
