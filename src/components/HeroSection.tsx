import CountdownTimer from './CountdownTimer';
import GlowingParticles from './GlowingParticles';
import { Play, Send, Download } from 'lucide-react';
import { usePerformanceTier } from '@/hooks/use-mobile';
import { smoothScrollTo } from '@/lib/smoothScroll';
import { TextReveal } from '@/components/ui/text-reveal';
import { motion, useScroll, useTransform, useSpring, MotionValue } from 'framer-motion';

/* ── tiny touch detection (runs once at module level — no hook) ── */
const IS_TOUCH = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

const ParallaxParticle = ({ index, left, top, delay, duration, scrollY }: {
    index: number; left: string; top: string; delay: string; duration: string; scrollY: MotionValue<number>;
}) => {
    const springScroll = useSpring(scrollY, { stiffness: 40, damping: 15 });
    const speed = (index % 4) * 0.3 + 0.1;
    const dirY  = index % 2 === 0 ? -1 : 0.5;
    const dirX  = (index % 3 - 1) * 0.5;
    const y = useTransform(springScroll, [0, 1000], [0, dirY * speed * 400]);
    const x = useTransform(springScroll, [0, 1000], [0, dirX * speed * 200]);
    const floatDuration = parseFloat(duration) || 5;
    const delaySec      = parseFloat(delay)    || 0;

    return (
        <motion.div style={{ left, top, y, x, opacity: index % 3 === 0 ? 0.3 : 0.5, scale: (index % 5) * 0.2 + 0.8, zIndex: 1 }} className="absolute">
            <motion.div
                animate={{ y: [0, -30, 0], scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: floatDuration, delay: delaySec, repeat: Infinity, ease: 'easeInOut' }}
                className={`rounded-full ${index % 2 === 0 ? 'bg-cyan-400' : 'bg-primary'} blur-[3px]`}
                style={{
                    width:  (index % 3 + 2) * 3 + 'px',
                    height: (index % 3 + 2) * 3 + 'px',
                    boxShadow: `0 0 ${10 + index}px ${index % 2 === 0 ? 'rgba(6,182,212,0.4)' : 'rgba(255,107,53,0.4)'}`,
                }}
            />
        </motion.div>
    );
};

const HeroSection = () => {
    const performanceTier = usePerformanceTier();
    const { scrollY } = useScroll();

    const particleCount = IS_TOUCH ? 0 : (performanceTier === 'low' ? 15 : 40);
    const decorCount    = IS_TOUCH ? 0 : (performanceTier === 'low' ? 6  : 20);

    return (
        <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden ray-effect">
            {particleCount > 0 && <GlowingParticles className="z-10" count={particleCount} />}

            <div className="container mx-auto px-4 sm:px-6 py-20 sm:py-28 md:py-36 relative z-20">
                <div className="text-center max-w-5xl mx-auto animate-fade-in-up">

                    {/* Eyebrow */}
                    <p
                        className="font-body text-sm sm:text-base md:text-lg text-cyan-300/90 font-bold tracking-[0.2em] uppercase mb-4 md:mb-6 animate-fade-in-up opacity-0 fill-mode-forwards drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                        style={{ animationDelay: '0.3s' }}
                    >
                        Descend into the Digital Depths
                    </p>

                    {/* Main title — clamp via responsive classes (no tailwind config needed) */}
                    <h1
                        className="font-display font-black text-white mb-6 md:mb-8 leading-[0.88] animate-fade-in-up opacity-0 fill-mode-forwards tracking-tighter drop-shadow-[0_4px_30px_rgba(0,217,255,0.25)]"
                        style={{
                            fontSize: 'clamp(2.6rem, 10vw, 9rem)',
                            animationDelay: '0.5s',
                        }}
                    >
                        CODEKRITI
                        <span
                            className="block mt-1 md:mt-3 text-transparent bg-clip-text bg-gradient-to-b from-cyan-200 via-cyan-400 to-blue-600 drop-shadow-[0_0_30px_rgba(6,182,212,0.6)] font-display italic transform -rotate-2"
                            style={{ fontSize: 'clamp(3rem, 12vw, 11rem)' }}
                        >
                            4.0
                        </span>
                    </h1>

                    {/* Description */}
                    <div
                        className="font-body text-sm sm:text-base md:text-lg text-blue-100/80 max-w-2xl mx-auto mb-10 md:mb-12 px-2 sm:px-4 leading-relaxed drop-shadow-md animate-fade-in-up opacity-0 fill-mode-forwards"
                        style={{ animationDelay: '0.7s' }}
                    >
                        <TextReveal
                            text="The pinnacle of innovation returns. Dive into the abyss of technology and creation where only the bravest master the digital depths."
                            className="inline-block"
                            delay={0.7}
                        />
                    </div>

                    {/* Countdown */}
                    <div
                        className="mb-10 md:mb-14 flex flex-col items-center animate-fade-in-up opacity-0 fill-mode-forwards"
                        style={{ animationDelay: '0.9s' }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-black/40 backdrop-blur-md mb-5 sm:mb-6 shadow-[0_0_15px_rgba(0,217,255,0.1)]">
                            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_#22d3ee]" />
                            <p className="font-body text-xs font-bold text-cyan-300 uppercase tracking-widest">Event Starts In</p>
                        </div>
                        <CountdownTimer />
                    </div>

                    {/* CTA Buttons */}
                    <div
                        className="flex flex-col sm:flex-row gap-3 sm:gap-5 justify-center items-center w-full max-w-xs sm:max-w-none mx-auto animate-fade-in-up opacity-0 fill-mode-forwards"
                        style={{ animationDelay: '1.1s' }}
                    >
                        {/* Primary CTA */}
                        <button
                            type="button"
                            onClick={() => {
                                if (window.innerWidth < 640) {
                                    const a = document.createElement('a');
                                    a.href = '/assets/Brochurecokekriti.pdf';
                                    a.download = 'CodeKriti_4_0_Brochure.pdf';
                                    document.body.appendChild(a);
                                    a.click();
                                    document.body.removeChild(a);
                                } else {
                                    smoothScrollTo('about', { duration: 350, easing: 'easeInOutQuart' });
                                }
                            }}
                            className="dive-in-btn group w-full sm:w-auto px-10 sm:px-12 py-3.5 md:py-4 rounded-full text-white font-display font-bold text-base md:text-lg uppercase tracking-wider flex items-center justify-center gap-3 cursor-pointer min-h-[48px] transition-transform duration-200 hover:scale-105 active:scale-95"
                        >
                            <span className="block sm:hidden">Brochure</span>
                            <span className="hidden sm:block">Dive In</span>
                            <span className="block sm:hidden"><Download className="w-4 h-4" aria-hidden="true" /></span>
                            <span className="hidden sm:block"><Send className="w-4 h-4 md:w-5 md:h-5 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300" aria-hidden="true" /></span>
                        </button>

                        {/* Secondary CTA */}
                        <button
                            type="button"
                            onClick={() => smoothScrollTo('events', { duration: 350, easing: 'easeInOutQuart' })}
                            className="group w-full sm:w-auto px-8 py-3.5 md:py-4 rounded-full text-white font-display font-bold text-base md:text-lg flex items-center justify-center gap-2 cursor-pointer min-h-[48px] transition-all duration-300 hover:scale-105 active:scale-95"
                            style={{
                                background:   'rgba(6,182,212,0.08)',
                                border:       '1.5px solid rgba(6,182,212,0.45)',
                            }}
                            onMouseEnter={e => {
                                (e.currentTarget as HTMLButtonElement).style.background   = 'rgba(6,182,212,0.18)';
                                (e.currentTarget as HTMLButtonElement).style.borderColor  = 'rgba(6,182,212,0.9)';
                                (e.currentTarget as HTMLButtonElement).style.boxShadow   = '0 0 22px rgba(6,182,212,0.22)';
                            }}
                            onMouseLeave={e => {
                                (e.currentTarget as HTMLButtonElement).style.background   = 'rgba(6,182,212,0.08)';
                                (e.currentTarget as HTMLButtonElement).style.borderColor  = 'rgba(6,182,212,0.45)';
                                (e.currentTarget as HTMLButtonElement).style.boxShadow   = 'none';
                            }}
                        >
                            <Play className="w-4 h-4 text-cyan-400 fill-cyan-400/20 group-hover:fill-cyan-400/50 transition-all duration-200" aria-hidden="true" />
                            Explore Events
                        </button>
                    </div>
                </div>
            </div>

            {/* Parallax background particles — skipped on touch devices */}
            {decorCount > 0 && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {[...Array(decorCount)].map((_, i) => (
                        <ParallaxParticle
                            key={i}
                            index={i}
                            left={`${(i * 17) % 100}%`}
                            top={`${(i * 23) % 100}%`}
                            delay={`${(i * 0.4) % 3}s`}
                            duration={`${5 + (i % 5)}s`}
                            scrollY={scrollY}
                        />
                    ))}
                </div>
            )}
        </section>
    );
};

export default HeroSection;
