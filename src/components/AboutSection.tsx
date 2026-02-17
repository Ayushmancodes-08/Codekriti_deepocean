
import { useRef, useState, useEffect } from 'react';
import Bubbles from './Bubbles';
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

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">
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
              className={`font-body text-base md:text-lg text-foreground/70 leading-relaxed transition-all duration-700 delay-200 transform ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-5'}`}
            >
              CodeKriti 4.0 explores the Digital Abyss - where technology meets the mysteries of the deep.
              Inspired by the resilience and brilliance of ocean life,
              we bring together the brightest minds to solve, create, and innovate.
            </p>
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
