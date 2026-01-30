import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Bubbles from './Bubbles';
import { Waves, Zap, Diamond, Cpu, Users, Calendar, Trophy, IndianRupee } from 'lucide-react';
import BrickBreaker from './BrickBreaker';

const features = [
  {
    icon: <Waves className="w-8 h-8 text-cyan-400" />,
    title: 'Digital Abyss',
    description: 'Explore the deepest frontiers of technology where logic meets the fluid unknown.',
  },
  {
    icon: <Cpu className="w-8 h-8 text-purple-400" />,
    title: 'Bioluminescent AI',
    description: 'Neural networks inspired by the glowing organisms of the midnight zone.',
  },
  {
    icon: <Diamond className="w-8 h-8 text-blue-400" />,
    title: 'Cyan Synergy',
    description: 'Sustainable tech integrated with the ocean\'s natural rhythm and power.',
  },
  {
    icon: <Zap className="w-8 h-8 text-yellow-400" />,
    title: 'Code Currents',
    description: 'Harness the flow of data to drive innovations that reshape our world.',
  },
];

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" ref={ref} className="relative min-h-screen py-20 md:py-32 flex flex-col items-center justify-center overflow-hidden">
      <Bubbles />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-start mb-16 md:mb-20">
          {/* Content - Left Side */}
          <div className="text-left w-full">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-block px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-4 md:mb-6"
            >
              The Mission
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="font-display text-4xl md:text-6xl font-bold text-foreground mb-6 md:mb-8"
            >
              About <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">CodeKriti 4.0</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="font-body text-base md:text-lg text-foreground/70 mb-8 leading-relaxed max-w-xl"
            >
              CodeKriti 4.0 explores the Digital Abyss - where technology meets the mysteries of the deep.
              Inspired by the resilience and brilliance of ocean life,
              we bring together the brightest minds to solve, create, and innovate.
            </motion.p>

            {/* Stats Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="grid grid-cols-2 sm:flex flex-wrap gap-6 md:gap-8"
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-primary/80 mb-1">
                  <Calendar size={16} />
                  <span className="text-[10px] uppercase tracking-widest font-bold">Year</span>
                </div>
                <span className="font-display text-xl md:text-2xl font-bold text-white">2026</span>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-primary/80 mb-1">
                  <Users size={16} />
                  <span className="text-[10px] uppercase tracking-widest font-bold">Participants</span>
                </div>
                <span className="font-display text-xl md:text-2xl font-bold text-white">5000+</span>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-primary/80 mb-1">
                  <Trophy size={16} />
                  <span className="text-[10px] uppercase tracking-widest font-bold">Events</span>
                </div>
                <span className="font-display text-xl md:text-2xl font-bold text-white">4</span>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-primary/80 mb-1">
                  <IndianRupee size={16} />
                  <span className="text-[10px] uppercase tracking-widest font-bold">Prize Pool</span>
                </div>
                <span className="font-display text-xl md:text-2xl font-bold text-white">1L+</span>
              </div>
            </motion.div>
          </div>

          {/* Game - Right Side */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={isInView ? { opacity: 1, scale: 1, x: 0 } : {}}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex justify-center lg:justify-end w-full"
          >
            <div className="relative w-full aspect-square max-w-sm md:max-w-md">
              <BrickBreaker />
            </div>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ y: -10 }}
              className="glass-card rounded-2xl p-6 md:p-8 relative overflow-hidden group splash-effect"
            >
              <div className="mb-4 md:mb-6 transform group-hover:scale-110 transition-transform duration-500 bg-white/5 w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-primary/50 group-hover:bg-primary/10">
                {feature.icon}
              </div>
              <h3 className="font-display text-lg md:text-xl font-bold text-foreground mb-2 md:mb-3 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="font-body text-sm text-foreground/60 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};


export default AboutSection;
