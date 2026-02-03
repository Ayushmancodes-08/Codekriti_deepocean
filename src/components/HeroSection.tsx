import CountdownTimer from './CountdownTimer';
import GlowingParticles from './GlowingParticles';
import { Play, Send } from 'lucide-react';
import { usePerformanceTier } from '@/hooks/use-mobile';
import { smoothScrollTo } from '@/lib/smoothScroll';
import { TextReveal } from '@/components/ui/text-reveal';
import { motion, useScroll, useTransform, useSpring, MotionValue } from 'framer-motion';

const ParallaxParticle = ({ index, left, top, delay, duration, scrollY }: { index: number, left: string, top: string, delay: string, duration: string, scrollY: MotionValue<number> }) => {
  // 1. Smooth Physics Parallax
  const springScroll = useSpring(scrollY, { stiffness: 40, damping: 15 });

  // 2. Varying speeds and directions (some move up, some down, some drift sideways)
  const speed = (index % 4) * 0.3 + 0.1;
  const directionY = index % 2 === 0 ? -1 : 0.5;
  const directionX = (index % 3 - 1) * 0.5;

  const y = useTransform(springScroll, [0, 1000], [0, directionY * speed * 400]);
  const x = useTransform(springScroll, [0, 1000], [0, directionX * speed * 200]);

  // 3. Ambient Animation variables
  const floatDuration = parseFloat(duration) || 5;
  const delaySec = parseFloat(delay) || 0;

  return (
    <motion.div
      style={{
        left,
        top,
        y, // Physics scroll Y
        x, // Physics scroll X
        opacity: (index % 3 === 0) ? 0.3 : 0.5,
        scale: (index % 5) * 0.2 + 0.8,
        zIndex: 1
      }}
      className="absolute"
    >
      {/* Inner div for ambient float (Up/Down + Glow) - Optimized shadow */}
      <motion.div
        animate={{
          y: [0, -30, 0],
          scale: [1, 1.2, 1],
          opacity: [0.7, 1, 0.7]
        }}
        transition={{
          duration: floatDuration,
          delay: delaySec,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className={`rounded-full ${index % 2 === 0 ? 'bg-cyan-400' : 'bg-primary'} blur-[3px]`}
        style={{
          width: (index % 3 + 2) * 3 + 'px',
          height: (index % 3 + 2) * 3 + 'px',
          // Static shadow instead of dynamic if possible, or kept minimal
          boxShadow: `0 0 ${10 + index}px ${index % 2 === 0 ? 'rgba(6,182,212,0.4)' : 'rgba(255,107,53,0.4)'}`
        }}
      />
    </motion.div>
  );
};

const HeroSection = () => {
  // Get performance tier for animation optimization
  const performanceTier = usePerformanceTier();
  const { scrollY } = useScroll(); // Use single scroll listener

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden ray-effect">
      <GlowingParticles className="z-10" count={performanceTier === 'low' ? 15 : 40} />

      {/* Reduced padding for mobile to minimize blank space */}
      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-24 md:py-32 relative z-20">
        <div
          className="text-center max-w-5xl mx-auto animate-fade-in-up"
        >
          {/* Subtitle */}
          <p
            className="font-body text-base sm:text-lg md:text-xl text-cyan-300/90 font-bold tracking-[0.2em] uppercase mb-4 md:mb-6 text-center w-full animate-fade-in-up delay-100 opacity-0 fill-mode-forwards drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
            style={{ animationDelay: '0.3s' }}
          >
            Descend into the Digital Depths
          </p>

          {/* Main Title */}
          <h1
            className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white mb-6 md:mb-8 leading-[0.9] text-center w-full animate-fade-in-up opacity-0 fill-mode-forwards tracking-tighter drop-shadow-[0_4px_30px_rgba(0,217,255,0.25)]"
            style={{ animationDelay: '0.5s' }}
          >
            CODEKRITI
            <span className="block mt-1 md:mt-4 text-7xl sm:text-8xl md:text-9xl text-center text-transparent bg-clip-text bg-gradient-to-b from-cyan-200 via-cyan-400 to-blue-600 drop-shadow-[0_0_30px_rgba(6,182,212,0.6)] font-display italic transform -rotate-2">
              4.0
            </span>
          </h1>

          {/* Description */}
          <div className="font-body text-lg md:text-xl text-blue-100/90 max-w-2xl mx-auto mb-10 md:mb-12 text-center px-6 leading-relaxed drop-shadow-md animate-fade-in-up opacity-0 fill-mode-forwards" style={{ animationDelay: '0.7s' }}>
            <TextReveal
              text="The pinnacle of innovation returns. Dive into the abyss of technology and creation where only the bravest master the digital depths."
              className="inline-block"
              delay={0.7}
            />
          </div>

          {/* Countdown Timer */}
          <div
            className="mb-10 md:mb-12 text-center w-full flex flex-col items-center animate-fade-in-up opacity-0 fill-mode-forwards"
            style={{ animationDelay: '0.9s' }}
          >
            <div className="inline-block px-4 py-1.5 rounded-full border border-cyan-500/30 bg-black/40 backdrop-blur-md mb-6 shadow-[0_0_15px_rgba(0,217,255,0.1)]">
              <p className="font-body text-xs font-bold text-cyan-300 uppercase tracking-widest flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_#22d3ee]" />
                Event Starts In
              </p>
            </div>
            <CountdownTimer />
          </div>

          {/* CTA Buttons - Stack on mobile */}
          <div
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center w-full max-w-md sm:max-w-none mx-auto animate-fade-in-up opacity-0 fill-mode-forwards"
            style={{ animationDelay: '1.1s' }}
          >
            {/* Dive In Button - Primary CTA */}
            <button
              type="button"
              onClick={() => smoothScrollTo('events', { duration: 1200, easing: 'easeInOutQuart' })}
              className="dive-in-btn group w-full sm:w-auto px-12 py-4 md:py-5 rounded-full text-white font-display font-bold text-lg md:text-xl uppercase tracking-wider flex items-center justify-center gap-3 cursor-pointer">
              <span>Dive In</span>
              <Send className="w-5 h-5 md:w-6 md:h-6 text-white transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
            </button>

            {/* Explore Events Button - Secondary CTA */}
            <button
              type="button"
              onClick={() => smoothScrollTo('events', { duration: 1200, easing: 'easeInOutQuart' })}
              className="group relative w-full sm:w-auto px-8 py-3.5 md:py-4 rounded-full text-white font-display font-bold text-base md:text-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer hover:scale-105"
              style={{
                background: 'rgba(6, 182, 212, 0.1)',
                border: '2px solid rgba(6, 182, 212, 0.5)',
                outline: 'none',
              }}
              onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.currentTarget.style.background = 'rgba(6, 182, 212, 0.2)';
                e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 1)';
                e.currentTarget.style.boxShadow = '0 0 20px rgba(6, 182, 212, 0.25)';
              }}
              onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.currentTarget.style.background = 'rgba(6, 182, 212, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.5)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <Play className="w-4 h-4 md:w-5 md:h-5 text-cyan-400 fill-cyan-400/20 group-hover:fill-cyan-400/40 transition-all duration-200" />
              <span>Explore Events</span>
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer animate-fade-in opacity-0 fill-mode-forwards"
          style={{ animationDelay: '2s' }}
          onClick={() => smoothScrollTo('events', { duration: 1000 })}
        >
          <div
            className="flex flex-col items-center gap-2 animate-bounce-slow"
          >
            <span className="font-body text-xs text-foreground/50 uppercase tracking-widest">
              Scroll to Dive
            </span>
            <div className="w-6 h-10 rounded-full border-2 border-primary/50 flex justify-center pt-2">
              <div
                className="w-1.5 h-1.5 rounded-full bg-primary animate-scroll-dot"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Floating decorative elements with Parallax */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Increased particle count for a lively, dense atmosphere */}
        {[...Array(20)].map((_, i) => (
          <ParallaxParticle
            key={i}
            index={i}
            // Deterministic "random" positions based on index
            left={`${(i * 17) % 100}%`}
            top={`${(i * 23) % 100}%`}
            delay={`${(i * 0.4) % 3}s`}
            duration={`${5 + (i % 5)}s`}
            scrollY={scrollY}
          />
        ))}
      </div>
    </section >
  );
};

export default HeroSection;
