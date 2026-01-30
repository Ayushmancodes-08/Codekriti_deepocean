import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { ASSETS } from '@/config/assets';

const BackgroundMusic = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [hasInteracted, setHasInteracted] = useState(false);

    useEffect(() => {
        // Create audio instance
        const audio = new Audio(ASSETS.MUSIC_THEME);
        audio.loop = true;
        audio.volume = 0.4;
        audioRef.current = audio;

        // Try to verify if file exists
        audio.addEventListener('error', () => {
            console.warn("Audio file not found.");
        });

        return () => {
            audio.pause();
            audio.src = '';
        };
    }, []);

    // Handle initial user interaction
    useEffect(() => {
        const handleInteraction = () => {
            if (!hasInteracted && audioRef.current) {
                setHasInteracted(true);
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
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.volume = 0.4;
            audioRef.current.play().catch(e => console.log("Audio play failed:", e));
            setIsPlaying(true);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <button
                onClick={togglePlay}
                className={`group relative flex items-center justify-center gap-2 px-4 h-12 rounded-full border transition-all duration-300 ${isPlaying
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)] pr-5'
                    : 'bg-black/40 border-white/10 text-white/50 hover:border-cyan-400/50 hover:text-cyan-400'
                    }`}
            >
                {/* Icon */}
                {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}

                {/* Music Stick Visualizer */}
                {isPlaying && (
                    <div className="flex items-end gap-[3px] h-4">
                        <span className="w-1 bg-cyan-400 rounded-full animate-music-wave" style={{ animationDelay: '0s' }} />
                        <span className="w-1 bg-cyan-400 rounded-full animate-music-wave" style={{ animationDelay: '0.2s' }} />
                        <span className="w-1 bg-cyan-400 rounded-full animate-music-wave" style={{ animationDelay: '0.4s' }} />
                    </div>
                )}

                {/* Tooltip */}
                <span className="absolute right-full mr-4 px-2 py-1 bg-black/80 text-xs rounded text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10">
                    {isPlaying ? 'Mute' : 'Play Music'}
                </span>
            </button>
        </div>
    );
};

export default BackgroundMusic;
