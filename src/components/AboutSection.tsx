
import { useRef, useState, useEffect } from 'react';
import Bubbles from './Bubbles';
import { Users, Calendar, Trophy, IndianRupee } from 'lucide-react';
import BrickBreaker from './BrickBreaker';



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
  const [ref, isInView] = useIntersectionObserver({ threshold: 0, rootMargin: '200px' });

  return (
    // Reduced vertical padding to minimize spacing
    <section ref={ref} className="relative min-h-screen py-8 sm:py-12 md:py-16 flex flex-col items-center justify-center overflow-hidden">
      <Bubbles />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start mb-10 md:mb-20">
          {/* 1. Intro Content */}
          <div className="text-left w-full">
            <span
              className={`inline-block px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-4 md:mb-6 transition-all duration-700 transform ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-5'}`}
            >
              The Mission
            </span>
            <h2
              className={`font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 md:mb-8 transition-all duration-700 delay-100 transform ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-5'}`}
            >
              About <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">CodeKriti 4.0</span>
            </h2>
            <p
              className={`font-body text-base md:text-lg text-foreground/70 mb-10 leading-relaxed transition-all duration-700 delay-200 transform ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-5'}`}
            >
              CodeKriti 4.0 explores the Digital Abyss - where technology meets the mysteries of the deep.
              Inspired by the resilience and brilliance of ocean life,
              we bring together the brightest minds to solve, create, and innovate.
            </p>

            {/* Stats - Left Aligned & Styled */}
            <div
              className={`grid grid-cols-2 gap-4 sm:gap-6 max-w-lg transition-all duration-700 delay-300 transform ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
            >
              {[
                { label: 'Year', value: '2026', icon: Calendar, color: 'text-cyan-400' },
                { label: 'Participants', value: '5000+', icon: Users, color: 'text-blue-400' },
                { label: 'Events', value: '4', icon: Trophy, color: 'text-purple-400' },
                { label: 'Prize Pool', value: '1L+', icon: IndianRupee, color: 'text-emerald-400' }
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="group p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-cyan-500/30 transition-all duration-300"
                >
                  <div className={`flex items-center gap-3 mb-2 ${stat.color}`}>
                    <stat.icon size={18} />
                    <span className="text-xs font-bold uppercase tracking-wider text-white/60">{stat.label}</span>
                  </div>
                  <span className="font-display text-2xl md:text-3xl font-bold text-white tracking-tight group-hover:scale-105 transition-transform inline-block">
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Right Column: Game Only */}
          <div className="w-full flex flex-col justify-center items-center h-full">
            <div
              className={`relative w-full aspect-square max-w-sm md:max-w-md transition-all duration-700 delay-500 transform ${isInView ? 'opacity-100 scale-100 translate-x-0' : 'opacity-0 scale-90 translate-x-5'}`}
            >
              <BrickBreaker />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


export default AboutSection;
