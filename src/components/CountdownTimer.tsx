import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TARGET_DATE = new Date('2026-03-06T17:00:00');

const calculateTimeLeft = () => {
    const difference = TARGET_DATE.getTime() - new Date().getTime();
    const isExpired   = difference <= 0;
    const absDiff     = Math.abs(difference);
    return {
        isExpired,
        days:    Math.floor(absDiff / (1000 * 60 * 60 * 24)),
        hours:   Math.floor((absDiff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((absDiff / 1000 / 60) % 60),
        seconds: Math.floor((absDiff / 1000) % 60),
    };
};

const CountdownTimer = () => {
    const [state, setState]       = useState(calculateTimeLeft);
    const [prevState, setPrevState] = useState(calculateTimeLeft);

    useEffect(() => {
        const timer = setInterval(() => {
            const next = calculateTimeLeft();
            setState(prev => { setPrevState(prev); return next; });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const units = [
        { label: state.isExpired ? 'Days Since'  : 'Days',    value: state.days,    prev: prevState.days },
        { label: state.isExpired ? 'Hours Since' : 'Hours',   value: state.hours,   prev: prevState.hours },
        { label: state.isExpired ? 'Mins Since'  : 'Minutes', value: state.minutes, prev: prevState.minutes },
        { label: state.isExpired ? 'Secs Since'  : 'Seconds', value: state.seconds, prev: prevState.seconds },
    ];

    return (
        <div className="flex flex-col items-center gap-5">
            {state.isExpired && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="px-4 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-widest animate-pulse"
                >
                    Event is Live
                </motion.div>
            )}

            {/* Responsive row — sizes driven by clamp() so no custom breakpoints needed */}
            <div className="flex items-center justify-center gap-3 sm:gap-5 md:gap-8 lg:gap-12 w-full">
                {units.map((unit, index) => (
                    <div key={unit.label} className="relative flex flex-col items-center">
                        <FlipCard value={unit.value} prevValue={unit.prev} />
                        <span
                            className="font-display font-bold text-cyan-400/80 uppercase tracking-[0.15em] whitespace-nowrap text-center mt-2 sm:mt-3"
                            style={{ fontSize: 'clamp(0.55rem, 1.4vw, 0.75rem)' }}
                        >
                            {unit.label}
                        </span>
                        {index < units.length - 1 && (
                            <div className="absolute -right-1.5 sm:-right-2.5 md:-right-4 lg:-right-6 top-[38%] -translate-y-1/2 flex flex-col gap-1.5 sm:gap-2">
                                <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-cyan-500/50 shadow-[0_0_6px_rgba(6,182,212,0.8)]" />
                                <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-cyan-500/50 shadow-[0_0_6px_rgba(6,182,212,0.8)]" />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

interface FlipCardProps { value: number; prevValue: number; }

const FlipCard = ({ value, prevValue }: FlipCardProps) => {
    const hasChanged      = value !== prevValue;
    const display         = value.toString().padStart(2, '0');
    const prevDisplay     = prevValue.toString().padStart(2, '0');

    /*
     * Card dimensions driven by clamp() — no custom Tailwind breakpoints needed.
     * Width:   clamp(48px, 10vw, 128px)
     * Height:  clamp(64px, 13vw, 160px)
     * Font:    clamp(1.25rem, 4vw, 4.5rem)
     */
    const cardStyle: React.CSSProperties = {
        width:  'clamp(48px, 10vw, 128px)',
        height: 'clamp(64px, 13vw, 160px)',
    };
    const fontStyle: React.CSSProperties = {
        fontSize: 'clamp(1.25rem, 4vw, 4.5rem)',
    };

    return (
        <div
            className="relative perspective-1000 group"
            style={cardStyle}
        >
            {/* Static background card */}
            <div className="absolute inset-0 rounded-xl bg-black/40 backdrop-blur-md overflow-hidden border border-white/10 shadow-2xl transition-all duration-300 group-hover:border-cyan-500/30 group-hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]">
                {/* Top half */}
                <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/5 to-transparent overflow-hidden flex items-end justify-center">
                    <span className="font-display font-bold text-white tracking-tighter tabular-nums translate-y-[52%]" style={fontStyle}>
                        {display}
                    </span>
                </div>
                {/* Bottom half */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-black/40 overflow-hidden flex items-start justify-center">
                    <span className="font-display font-bold text-foreground tabular-nums -translate-y-[52%]" style={fontStyle}>
                        {display}
                    </span>
                </div>
                {/* Centre line */}
                <div className="absolute inset-x-0 top-1/2 h-px bg-primary/20 z-10" />
                <div className="absolute inset-0 opacity-30 pointer-events-none mix-blend-screen"
                    style={{ boxShadow: 'inset 0 0 30px hsl(190 100% 50% / 0.15)' }} />
            </div>

            {/* Flip top */}
            <AnimatePresence mode="popLayout">
                {hasChanged && (
                    <motion.div
                        key={`flip-${value}`}
                        initial={{ rotateX: 0 }}
                        animate={{ rotateX: -90 }}
                        transition={{ duration: 0.4, ease: 'easeIn' }}
                        className="absolute inset-x-0 top-0 h-1/2 rounded-t-xl overflow-hidden origin-bottom z-20"
                        style={{ backfaceVisibility: 'hidden' }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40 flex items-end justify-center border-t border-x border-primary/20">
                            <span className="font-display font-bold text-foreground tabular-nums translate-y-[52%]" style={fontStyle}>
                                {prevDisplay}
                            </span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Flip bottom */}
            <AnimatePresence mode="popLayout">
                {hasChanged && (
                    <motion.div
                        key={`flip-bottom-${value}`}
                        initial={{ rotateX: 90 }}
                        animate={{ rotateX: 0 }}
                        transition={{ duration: 0.4, ease: 'easeOut', delay: 0.2 }}
                        className="absolute inset-x-0 bottom-0 h-1/2 rounded-b-xl overflow-hidden origin-top z-30"
                        style={{ backfaceVisibility: 'hidden' }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/40 flex items-start justify-center border-b border-x border-primary/20">
                            <span className="font-display font-bold text-foreground tabular-nums -translate-y-[52%]" style={fontStyle}>
                                {display}
                            </span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-2 h-2 sm:w-3 sm:h-3 border-t-2 border-l-2 border-cyan-500/50 rounded-tl-lg" />
            <div className="absolute top-0 right-0 w-2 h-2 sm:w-3 sm:h-3 border-t-2 border-r-2 border-cyan-500/50 rounded-tr-lg" />
            <div className="absolute bottom-0 left-0 w-2 h-2 sm:w-3 sm:h-3 border-b-2 border-l-2 border-cyan-500/50 rounded-bl-lg" />
            <div className="absolute bottom-0 right-0 w-2 h-2 sm:w-3 sm:h-3 border-b-2 border-r-2 border-cyan-500/50 rounded-br-lg" />
        </div>
    );
};

export default CountdownTimer;
