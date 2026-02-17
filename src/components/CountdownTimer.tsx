import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';



const TARGET_DATE = new Date('2026-03-06T17:00:00');

const calculateTimeLeft = () => {
  const difference = TARGET_DATE.getTime() - new Date().getTime();
  const isExpired = difference <= 0;
  const absDiff = Math.abs(difference);

  return {
    isExpired,
    days: Math.floor(absDiff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((absDiff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((absDiff / 1000 / 60) % 60),
    seconds: Math.floor((absDiff / 1000) % 60),
  };
};

const CountdownTimer = () => {
  const [state, setState] = useState(calculateTimeLeft());
  const [prevState, setPrevState] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      const nextState = calculateTimeLeft();
      setState(prev => {
        setPrevState(prev);
        return nextState;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const timeUnits = [
    { label: state.isExpired ? 'Days Since' : 'Days', value: state.days, prev: prevState.days },
    { label: state.isExpired ? 'Hours Since' : 'Hours', value: state.hours, prev: prevState.hours },
    { label: state.isExpired ? 'Mins Since' : 'Minutes', value: state.minutes, prev: prevState.minutes },
    { label: state.isExpired ? 'Secs Since' : 'Seconds', value: state.seconds, prev: prevState.seconds },
  ];

  return (
    <div className="flex flex-col items-center gap-8">
      {state.isExpired && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-widest animate-pulse"
        >
          Event is Live
        </motion.div>
      )}
      <div className="flex items-center justify-center gap-4 md:gap-12">
        {timeUnits.map((unit, index) => (
          <div key={unit.label} className="relative flex flex-col items-center">
            <FlipCard value={unit.value} prevValue={unit.prev} />
            <span className="mt-6 font-display text-[10px] md:text-sm uppercase tracking-[0.2em] text-cyan-400/80 font-bold whitespace-nowrap text-center">
              {unit.label}
            </span>
            {index < timeUnits.length - 1 && (
              <div className="absolute -right-2 md:-right-6 top-[35%] -translate-y-1/2 hidden sm:flex flex-col gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/50 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/50 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

interface FlipCardProps {
  value: number;
  prevValue: number;
}

const FlipCard = ({ value, prevValue }: FlipCardProps) => {
  const hasChanged = value !== prevValue;
  const displayValue = value.toString().padStart(2, '0');
  const prevDisplayValue = prevValue.toString().padStart(2, '0');

  return (
    <div className="relative w-16 h-24 md:w-32 md:h-40 perspective-1000 group">
      {/* Static background card */}
      <div className="absolute inset-0 rounded-xl bg-black/40 backdrop-blur-md overflow-hidden border border-white/10 shadow-2xl transition-all duration-300 group-hover:border-cyan-500/30 group-hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]">
        {/* Top half */}
        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/5 to-transparent overflow-hidden flex items-end justify-center">
          <span className="font-display text-4xl md:text-7xl font-bold text-white translate-y-[52%] tracking-tighter">
            {displayValue}
          </span>
        </div>

        {/* Bottom half */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-black/40 overflow-hidden flex items-start justify-center">
          <span className="font-display text-4xl md:text-7xl font-bold text-foreground -translate-y-[52%]">
            {displayValue}
          </span>
        </div>

        {/* Center line */}
        <div className="absolute inset-x-0 top-1/2 h-px bg-primary/20 z-10" />

        {/* Glow effect */}
        <div className="absolute inset-0 opacity-30 pointer-events-none mix-blend-screen"
          style={{
            boxShadow: 'inset 0 0 30px hsl(190 100% 50% / 0.15)',
          }}
        />
      </div>

      {/* Flip animation - top flipping down */}
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
              <span className="font-display text-4xl md:text-7xl font-bold text-foreground translate-y-[52%]">
                {prevDisplayValue}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Flip animation - bottom flipping up */}
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
              <span className="font-display text-4xl md:text-7xl font-bold text-foreground -translate-y-[52%]">
                {displayValue}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-500/50 rounded-tl-lg" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-500/50 rounded-tr-lg" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-500/50 rounded-bl-lg" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-500/50 rounded-br-lg" />
    </div>
  );
};

export default CountdownTimer;
