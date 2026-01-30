import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TetrisLoading from './ui/tetris-loader';
import { Waves } from 'lucide-react';

export default function WebsiteLoader({ onFinish }: { onFinish: () => void }) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Simulate loading progress
        const timer = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(timer);
                    setTimeout(onFinish, 800); // Short delay after 100% before finishing
                    return 100;
                }
                // Random progress increments for realism
                const increment = Math.random() * 5 + 1;
                return Math.min(prev + increment, 100);
            });
        }, 150);

        return () => clearInterval(timer);
    }, [onFinish]);

    return (
        <motion.div
            className="fixed inset-0 z-[100] bg-[#0a192f] flex flex-col items-center justify-center overflow-hidden"
            exit={{ opacity: 0, y: -50, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }}
        >
            {/* Deep Sea Background Effects */}
            <div className="absolute inset-0 z-0">
                <div
                    className="absolute inset-0 opacity-30"
                    style={{
                        backgroundImage: `url('/images/sea-rock-texture.png')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a192f] via-transparent to-[#0a192f] opacity-90" />

                {/* Animated Bubbles/Particles */}
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full bg-cyan-400/20 blur-sm"
                        style={{
                            width: Math.random() * 10 + 4,
                            height: Math.random() * 10 + 4,
                            left: `${Math.random() * 100}%`,
                            bottom: '-20px',
                        }}
                        animate={{
                            y: -1200, // Move up screen
                            x: [0, Math.sin(i) * 50, 0], // Slight wave motion
                            opacity: [0, 0.5, 0],
                        }}
                        transition={{
                            duration: Math.random() * 10 + 10,
                            repeat: Infinity,
                            delay: Math.random() * 5,
                            ease: "linear"
                        }}
                    />
                ))}
            </div>

            {/* Main Content */}
            <div className="relative z-10 w-full max-w-md flex flex-col items-center justify-center gap-10">

                {/* Tetris Loader with Glow */}
                <div className="relative flex items-center justify-center">
                    <div className="absolute inset-0 bg-cyan-500/20 blur-3xl rounded-full scale-150 animate-pulse pointer-events-none" />
                    <TetrisLoading size="lg" speed="fast" showLoadingText={false} />
                </div>

                {/* Text and Progress */}
                <div className="w-full flex flex-col items-center space-y-5">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3 justify-center"
                    >
                        <Waves className="w-6 h-6 text-cyan-400 animate-pulse" />
                        <h1 className="font-display text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent tracking-wider">
                            DEEP DIVE
                        </h1>
                    </motion.div>

                    {/* Progress Bar */}
                    <div className="w-64 h-1.5 bg-blue-900/50 rounded-full overflow-hidden border border-white/5 relative shadow-inner">
                        <motion.div
                            className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500"
                            style={{ width: `${progress}%` }}
                            animate={{
                                boxShadow: ['0 0 10px rgba(6,182,212,0.5)', '0 0 20px rgba(6,182,212,0.8)', '0 0 10px rgba(6,182,212,0.5)']
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                    </div>

                    <div className="font-mono text-cyan-400/60 text-xs tracking-[0.2em]">
                        {Math.round(progress)}% INITIALIZING SYSTEMS
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
