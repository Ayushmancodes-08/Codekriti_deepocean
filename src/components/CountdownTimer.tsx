import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const TARGET_DATE = new Date('2025-03-03T09:00:00');

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [prevTimeLeft, setPrevTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = (): TimeLeft => {
      const difference = TARGET_DATE.getTime() - new Date().getTime();

      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      const newTime = calculateTimeLeft();
      setPrevTimeLeft((prevState) => {
        setTimeLeft(newTime);
        return prevState;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []); // Empty dependency array - timer interval handles its own updates

  const timeUnits = [
    { label: 'Days', value: timeLeft.days, prev: prevTimeLeft.days },
    { label: 'Hours', value: timeLeft.hours, prev: prevTimeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes, prev: prevTimeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds, prev: prevTimeLeft.seconds },
  ];

  return (
    <div className="flex items-center justify-center gap-4 md:gap-12">
      {timeUnits.map((unit, index) => (
        <div key={unit.label} className="flex flex-col items-center">
          <FlipCard value={unit.value} prevValue={unit.prev} />
          <span className="mt-6 font-display text-xs md:text-sm uppercase tracking-[0.2em] text-cyan-400/80 font-bold">
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

      {/* Flip animation - bottom flipping up */}
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

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-500/50 rounded-tl-lg" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-500/50 rounded-tr-lg" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-500/50 rounded-bl-lg" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-500/50 rounded-br-lg" />
    </div>
  );
};

export default CountdownTimer;
