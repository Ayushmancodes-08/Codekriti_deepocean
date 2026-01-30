import { motion } from 'framer-motion';
import CountdownTimer from './CountdownTimer';
import GlowingParticles from './GlowingParticles';
import { Play, Send } from 'lucide-react';
import { usePerformanceTier } from '@/hooks/use-mobile';
import { smoothScrollTo } from '@/lib/smoothScroll';
import { TextReveal } from '@/components/ui/text-reveal';


const HeroSection = () => {
  // Get performance tier for animation optimization
  const performanceTier = usePerformanceTier();

  // Reduce animation complexity on lower-end devices
  const animationDuration = performanceTier === 'high' ? 0.8 : 0.5;
  const staggerDelay = performanceTier === 'high' ? 0.3 : 0.15;
  const enableAnimations = performanceTier !== 'low';

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden ray-effect">
      {/* Glowing Particles - Performance-aware */}
      <GlowingParticles className="z-10" count={performanceTier === 'low' ? 15 : 40} />

      <div className="container mx-auto px-6 py-24 md:py-32 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="text-center max-w-5xl mx-auto"
        >
          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="font-body text-sm md:text-xl text-primary/90 font-medium tracking-widest uppercase mb-4 md:mb-6 text-center w-full"
          >
            Descend into the Digital Depths
          </motion.p>

          {/* Main Title */}
          <motion.h1
            initial={enableAnimations ? { opacity: 0, y: 30 } : { opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: staggerDelay, duration: animationDuration }}
            className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-9xl font-black text-foreground mb-6 md:mb-8 leading-tight text-center w-full"
          >
            CODEKRITI
            <span className="block text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]">
              4.0
            </span>
          </motion.h1>

          {/* Description */}
          <div className="font-body text-base md:text-xl text-foreground/70 max-w-2xl mx-auto mb-8 md:mb-10 text-center px-4">
            <TextReveal
              text="The pinnacle of innovation returns. Dive into the abyss of technology and creation where only the bravest master the digital depths."
              className="inline-block"
              delay={staggerDelay * 2}
            />
          </div>

          {/* Countdown Timer */}
          <motion.div
            initial={enableAnimations ? { opacity: 0, scale: 0.9 } : { opacity: 1, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: staggerDelay * 3, duration: animationDuration }}
            className="mb-10 md:mb-12 text-center w-full flex flex-col items-center"
          >
            <div className="inline-block px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/30 backdrop-blur-sm mb-6">
              <p className="font-body text-xs text-cyan-400 uppercase tracking-widest flex items-center justify-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                Event Starts In
              </p>
            </div>
            <CountdownTimer />
          </motion.div>

          {/* CTA Buttons - Stack on mobile */}
          <motion.div
            initial={enableAnimations ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: staggerDelay * 4, duration: animationDuration }}
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center w-full max-w-md sm:max-w-none mx-auto"
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
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
          onClick={() => smoothScrollTo('events', { duration: 1000 })}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-2"
          >
            <span className="font-body text-xs text-foreground/50 uppercase tracking-widest">
              Scroll to Dive
            </span>
            <div className="w-6 h-10 rounded-full border-2 border-primary/50 flex justify-center pt-2">
              <motion.div
                animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-primary"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-primary/40"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}
      </div>
    </section >
  );
};

export default HeroSection;
