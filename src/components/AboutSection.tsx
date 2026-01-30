
import { useRef, useState, useEffect } from 'react';
import Bubbles from './Bubbles';
import { Waves, Cpu, Users, Calendar, Trophy, IndianRupee } from 'lucide-react';
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
];

// Reuse the simple hook (in a real app, move to hooks/useIntersectionObserver.ts)
const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsIntersecting(true);
        observer.disconnect();
      }
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) observer.disconnect();
    };
  }, []);

  return [ref, isIntersecting] as const;
};

const AboutSection = () => {
  const [ref, isInView] = useIntersectionObserver({ threshold: 0.1 });

  return (
    <section id="about" ref={ref} className="relative min-h-screen py-20 md:py-32 flex flex-col items-center justify-center overflow-hidden">
      <Bubbles />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-start mb-16 md:mb-20">
          {/* Content - Left Side */}
          <div className="text-left w-full">
            <span
              className={`inline-block px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-4 md:mb-6 transition-all duration-700 transform ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-5'}`}
            >
              The Mission
            </span>
            <h2
              className={`font-display text-4xl md:text-6xl font-bold text-foreground mb-6 md:mb-8 transition-all duration-700 delay-100 transform ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-5'}`}
            >
              About <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">CodeKriti 4.0</span>
            </h2>
            <p
              className={`font-body text-base md:text-lg text-foreground/70 mb-8 leading-relaxed max-w-xl transition-all duration-700 delay-200 transform ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-5'}`}
            >
              CodeKriti 4.0 explores the Digital Abyss - where technology meets the mysteries of the deep.
              Inspired by the resilience and brilliance of ocean life,
              we bring together the brightest minds to solve, create, and innovate.
            </p>

            {/* Stats Row */}
            <div
              className={`grid grid-cols-2 sm:flex flex-wrap gap-6 md:gap-8 transition-all duration-700 delay-300 transform ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
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
            </div>
          </div>

          {/* Game - Right Side */}
          <div
            className={`flex justify-center lg:justify-end w-full transition-all duration-700 delay-500 transform ${isInView ? 'opacity-100 scale-100 translate-x-0' : 'opacity-0 scale-90 translate-x-5'}`}
          >
            <div className="relative w-full aspect-square max-w-sm md:max-w-md">
              <BrickBreaker />
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`glass-card rounded-2xl p-6 md:p-8 relative overflow-hidden group splash-effect transition-all duration-700 hover:-translate-y-2 transform ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${index * 100}ms` }}
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};


export default AboutSection;
