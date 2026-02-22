import { useRef, useState, useEffect } from 'react';
import Bubbles from './Bubbles';
import BrickBreaker from './BrickBreaker';
import { Users, Calendar, Trophy, Zap } from 'lucide-react';

const useIntersectionObserver = (options = {}) => {
    const [isIntersecting, setIsIntersecting] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) { setIsIntersecting(true); observer.disconnect(); }
        }, options);
        if (ref.current) observer.observe(ref.current);
        return () => { if (ref.current) observer.disconnect(); };
    }, []);
    return [ref, isIntersecting] as const;
};

const stats = [
    { icon: <Users   className="w-5 h-5" />, value: '500+',  label: 'Participants' },
    { icon: <Trophy  className="w-5 h-5" />, value: '₹10K+', label: 'Prize Pool'    },
    { icon: <Calendar className="w-5 h-5"/>, value: '2',     label: 'Days'         },
    { icon: <Zap     className="w-5 h-5" />, value: '5',     label: 'Events'       },
];

const AboutSection = () => {
    const [ref, isInView] = useIntersectionObserver({ threshold: 0, rootMargin: '200px' });

    return (
        <section
            ref={ref}
            id="about"
            className="relative py-12 sm:py-16 md:py-20 flex flex-col items-center justify-center overflow-hidden"
        >
            <Bubbles />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">

                {/* Main content grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-14 items-center">

                    {/* Left — text */}
                    <div className="text-left w-full">
                        <span
                            className={`inline-block px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-4 md:mb-5 transition-all duration-700 ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-5'}`}
                        >
                            The Mission
                        </span>

                        <h2
                            className={`font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 md:mb-6 leading-tight transition-all duration-700 delay-100 ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-5'}`}
                        >
                            About <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
                                CodeKriti 4.0
                            </span>
                        </h2>

                        <p
                            className={`font-body text-sm sm:text-base md:text-lg text-foreground/70 leading-relaxed mb-6 md:mb-8 transition-all duration-700 delay-200 ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-5'}`}
                        >
                            CodeKriti 4.0 explores the Digital Abyss — where technology meets the mysteries of the deep.
                            Inspired by the resilience and brilliance of ocean life,
                            we bring together the brightest minds to solve, create, and innovate.
                        </p>

                        {/* Stats row */}
                        <div
                            className={`grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-3 transition-all duration-700 delay-300 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                        >
                            {stats.map((stat, i) => (
                                <div
                                    key={stat.label}
                                    className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-white/5 border border-white/8 hover:border-cyan-500/30 hover:bg-cyan-950/20 transition-all duration-300 group"
                                    style={{ transitionDelay: `${300 + i * 60}ms` }}
                                >
                                    <span className="text-cyan-400 group-hover:scale-110 transition-transform duration-300">
                                        {stat.icon}
                                    </span>
                                    <span className="font-display font-bold text-white text-lg sm:text-xl leading-none">
                                        {stat.value}
                                    </span>
                                    <span className="font-body text-gray-400 text-[10px] sm:text-xs uppercase tracking-wider">
                                        {stat.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right — BrickBreaker game */}
                    <div className="w-full flex flex-col justify-center items-center">
                        <div
                            className={`relative w-full aspect-square max-w-[320px] sm:max-w-[360px] md:max-w-[400px] transition-all duration-700 delay-500 ${isInView ? 'opacity-100 scale-100 translate-x-0' : 'opacity-0 scale-90 translate-x-5'}`}
                            aria-label="Interactive Brick Breaker mini-game"
                            role="img"
                        >
                            <BrickBreaker />
                        </div>
                        <p className="mt-3 text-xs text-gray-500 font-body text-center select-none">
                            Touch / click to play
                        </p>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default AboutSection;
