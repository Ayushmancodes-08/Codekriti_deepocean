import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BackgroundMusic = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true); // Start muted to respect browser policy
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [hasInteracted, setHasInteracted] = useState(false);

    useEffect(() => {
        // Create audio instance
        const audio = new Audio('/audio/theme-loop.mp3');
        audio.loop = true;
        audio.volume = 0.4; // Start at 40% volume
        audioRef.current = audio;

        // Try to verify if file exists (optional, mostly for dev feedback)
        audio.addEventListener('error', (e) => {
            console.warn("Audio file not found. Please add 'theme-loop.mp3' to /public/audio/");
        });

        return () => {
            audio.pause();
            audio.src = '';
        };
    }, []);

    // Handle initial user interaction to unlock audio
    useEffect(() => {
        const handleInteraction = () => {
            if (!hasInteracted && audioRef.current) {
                setHasInteracted(true);
                // Don't auto-play, just mark as ready. 
                // Let user strictly control via the button to avoid annoyance,
                // OR auto-play if that's the desired "immersive" effect.
                // Current config: Auto-play if not muted by default (but we start muted)
            }
        };

        window.addEventListener('click', handleInteraction);
        window.addEventListener('keydown', handleInteraction);
        return () => {
            window.removeEventListener('click', handleInteraction);
            window.removeEventListener('keydown', handleInteraction);
        };
    }, [hasInteracted]);

    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            // Fade out
            const fadeOut = setInterval(() => {
                if (audioRef.current!.volume > 0.05) {
                    audioRef.current!.volume -= 0.05;
                } else {
                    audioRef.current!.pause();
                    setIsPlaying(false);
                    setIsMuted(true);
                    clearInterval(fadeOut);
                }
            }, 50);
        } else {
            // Start playing / Fade in
            audioRef.current.volume = 0;
            audioRef.current.play().catch(e => console.log("Audio play failed:", e));
            setIsPlaying(true);
            setIsMuted(false);

            const fadeIn = setInterval(() => {
                if (audioRef.current!.volume < 0.4) {
                    audioRef.current!.volume += 0.05;
                } else {
                    clearInterval(fadeIn);
                }
            }, 50);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <motion.button
                onClick={togglePlay}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`group relative flex items-center justify-center w-12 h-12 rounded-full border transition-all duration-300 ${isPlaying
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)]'
                        : 'bg-black/40 border-white/10 text-white/50 hover:border-cyan-400/50 hover:text-cyan-400'
                    }`}
            >
                {/* Visualizer Ring Effect */}
                {isPlaying && (
                    <span className="absolute inset-0 rounded-full border border-cyan-400/30 animate-ping opacity-75" />
                )}

                {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}

                {/* Tooltip */}
                <span className="absolute right-full mr-4 px-2 py-1 bg-black/80 text-xs rounded text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10">
                    {isPlaying ? 'Mute Ambient' : 'Enable Audio'}
                </span>
            </motion.button>
        </div>
    );
};

export default BackgroundMusic;
