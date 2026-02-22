import { useRef, useState, useEffect } from 'react';
import { Calendar, Trophy, Code, Rocket, Lightbulb, Puzzle, Palette } from 'lucide-react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const timelineData = [
    {
        date: 'Day 1',
        dateLabel: 'March 6, 2026',
        events: [
            {
                id: 'innov-qualifier',
                title: 'Innovation Challenge (Qualifier)',
                time: '09:15 AM – 09:45 AM',
                venue: 'Room 413B',
                icon: <Lightbulb className="w-5 h-5" />,
                side: 'top' as const,
            },
            {
                id: 'inauguration',
                title: 'Inauguration Ceremony',
                time: '10:00 AM – 10:15 AM',
                venue: 'Room 413A',
                icon: <Trophy className="w-5 h-5" />,
                side: 'bottom' as const,
            },
            {
                id: 'algo-code',
                title: 'Algorithm to Code',
                time: '10:30 AM – 12:00 PM',
                venue: 'Room 525',
                icon: <Code className="w-5 h-5" />,
                side: 'top' as const,
            },
            {
                id: 'innov-final',
                title: 'Innovation Challenge (Final)',
                time: '12:00 PM – 01:00 PM',
                venue: 'Room 117',
                icon: <Lightbulb className="w-5 h-5" />,
                side: 'bottom' as const,
            },
            {
                id: 'tech-maze',
                title: 'Tech Maze',
                time: '02:00 PM – 05:00 PM',
                venue: 'Room 125, 413B & 117',
                icon: <Puzzle className="w-5 h-5" />,
                side: 'top' as const,
            },
        ],
    },
    {
        date: 'Day 2',
        dateLabel: 'March 7, 2026',
        events: [
            {
                id: 'dev-start',
                title: 'DevXtreme (Start)',
                time: '09:00 AM',
                venue: 'Room 413B',
                icon: <Rocket className="w-5 h-5" />,
                side: 'top' as const,
            },
            {
                id: 'designathon',
                title: 'Designathon',
                time: '11:00 AM – 01:00 PM',
                venue: 'Room 413B',
                icon: <Palette className="w-5 h-5" />,
                side: 'bottom' as const,
            },
            {
                id: 'dev-end',
                title: 'DevXtreme (End)',
                time: '05:00 PM',
                venue: 'Room 413A',
                icon: <Rocket className="w-5 h-5" />,
                side: 'top' as const,
            },
            {
                id: 'valedictory',
                title: 'Valedictory Ceremony',
                time: '05:00 PM – 05:30 PM',
                venue: 'Room 413A',
                icon: <Trophy className="w-5 h-5" />,
                side: 'bottom' as const,
            },
        ],
    },
];

/* ─────────────────────────────────────────────────────────────
   MOBILE — pure vertical timeline, no scroll-jacking at all
   ───────────────────────────────────────────────────────────── */
const MobileTimeline = () => (
    <section id="schedule" className="relative py-16 px-4 bg-black/40 overflow-x-hidden">
        {/* Header */}
        <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-900/20 backdrop-blur-sm text-blue-300 text-xs font-bold tracking-widest uppercase mb-4">
                <Trophy className="w-3 h-3" />
                Schedule
            </div>
            <h2 className="font-display text-3xl font-bold text-white mb-2">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-400">
                    Event Timeline
                </span>
            </h2>
            <p className="text-gray-400 text-sm max-w-xs mx-auto">
                Complete schedule for both days of CodeKriti 4.0
            </p>
        </div>

        <div className="max-w-lg mx-auto space-y-10">
            {timelineData.map((day) => (
                <div key={day.date}>
                    {/* Day header */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-cyan-500/40" />
                        <div className="px-5 py-2 rounded-full bg-cyan-950/80 border border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
                            <span className="text-sm font-bold text-cyan-100 font-display tracking-wider whitespace-nowrap">
                                {day.dateLabel}
                            </span>
                        </div>
                        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-cyan-500/40" />
                    </div>

                    {/* Events */}
                    <div className="relative pl-8">
                        {/* vertical spine */}
                        <div className="absolute left-3 top-0 bottom-0 w-px bg-cyan-500/20" />

                        <div className="space-y-4">
                            {day.events.map((event) => (
                                <div key={event.id} className="relative">
                                    {/* dot on spine */}
                                    <div className="absolute -left-5 top-4 w-3 h-3 rounded-full bg-black border-2 border-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]" />

                                    <div className="bg-black/30 border border-white/10 rounded-xl p-4 backdrop-blur-sm hover:border-cyan-500/30 transition-colors duration-300">
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex-shrink-0">
                                                {event.icon}
                                            </div>
                                            <div className="text-right">
                                                <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider leading-tight">
                                                    {event.venue}
                                                </div>
                                            </div>
                                        </div>
                                        <h3 className="text-sm font-bold text-white mb-1 leading-snug">{event.title}</h3>
                                        <div className="flex items-center text-xs text-gray-400">
                                            <Calendar className="w-3 h-3 mr-1.5 text-cyan-500/70 flex-shrink-0" />
                                            <span>{event.time}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}

            {/* End marker */}
            <div className="flex flex-col items-center py-6">
                <div className="w-14 h-14 rounded-full border-2 border-cyan-500/40 flex items-center justify-center bg-black/50">
                    <Trophy className="w-6 h-6 text-cyan-400" />
                </div>
                <div className="mt-3 text-center">
                    <div className="text-cyan-400 font-bold text-base mb-0.5">That's a Wrap!</div>
                    <div className="text-gray-500 text-xs">See you at the event!</div>
                </div>
            </div>
        </div>
    </section>
);

/* ─────────────────────────────────────────────────────────────
   DESKTOP — sticky horizontal scroll (unchanged algorithm)
   ───────────────────────────────────────────────────────────── */
const DesktopTimeline = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [maxScroll, setMaxScroll] = useState(0);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end'],
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
    });

    useEffect(() => {
        const measure = () => {
            if (contentRef.current) {
                const w = contentRef.current.scrollWidth;
                setMaxScroll(Math.max(0, w - window.innerWidth));
            }
        };
        measure();
        const t1 = setTimeout(measure, 300);
        const t2 = setTimeout(measure, 800);
        window.addEventListener('resize', measure);
        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            window.removeEventListener('resize', measure);
        };
    }, []);

    const x = useTransform(smoothProgress, [0, 1], ['0px', `-${maxScroll}px`]);
    const titleOpacity = useTransform(smoothProgress, [0, 0.12], [1, 0]);
    const titleScale = useTransform(smoothProgress, [0, 0.12], [1, 0.9]);
    const titleY = useTransform(smoothProgress, [0, 0.12], [0, -50]);

    return (
        <section
            id="schedule"
            ref={containerRef}
            className="relative bg-black/40"
            style={{ height: `calc(100vh + ${maxScroll}px)` }}
        >
            <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center">
                {/* Background Line */}
                <div className="absolute left-0 right-0 top-1/2 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent -translate-y-1/2 z-0 pointer-events-none" />

                {/* Intro Title */}
                <motion.div
                    style={{ opacity: titleOpacity, scale: titleScale, y: titleY }}
                    className="absolute top-1/2 -translate-y-1/2 left-12 z-20 pointer-events-none text-left max-w-md"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-900/20 backdrop-blur-sm text-blue-300 text-xs font-bold tracking-widest uppercase mb-6">
                        <Trophy className="w-3 h-3" />
                        Schedule
                    </div>
                    <h2 className="font-display text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-400 drop-shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                            Event Timeline
                        </span>
                    </h2>
                    <p className="text-gray-400 text-base lg:text-lg">
                        Scroll down to explore the complete schedule.
                    </p>
                </motion.div>

                {/* Horizontal track */}
                <motion.div
                    ref={contentRef}
                    style={{ x }}
                    className="flex items-center pl-[40vw] pr-[15vw] gap-[8vw] h-full w-max"
                >
                    {timelineData.map((day) => (
                        <div key={day.date} className="flex gap-[7vw] items-center">
                            {/* Day marker */}
                            <div className="relative flex-shrink-0">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
                                <div className="px-8 py-3 rounded-full bg-cyan-950/80 border border-cyan-500/50 backdrop-blur-md shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                                    <span className="text-2xl font-bold text-cyan-100 font-display tracking-wider whitespace-nowrap">
                                        {day.dateLabel}
                                    </span>
                                </div>
                            </div>

                            {/* Events */}
                            {day.events.map((event) => (
                                <div key={event.id} className="relative flex-shrink-0 group">
                                    {/* Node */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-black border-2 border-cyan-500 z-10 shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                                    {/* Stem */}
                                    <div className={`absolute left-1/2 -translate-x-1/2 w-[2px] bg-cyan-500/30 h-10 ${event.side === 'top' ? 'bottom-1/2 origin-bottom' : 'top-1/2 origin-top'}`} />
                                    {/* Card */}
                                    <div className={`relative w-[380px] bg-black/30 border border-white/20 rounded-xl p-4 backdrop-blur-md hover:border-cyan-500/40 transition-colors duration-300 ${event.side === 'top' ? '-translate-y-[calc(50%+40px)]' : 'translate-y-[calc(50%+40px)]'}`}>
                                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/8 to-blue-600/8 rounded-xl opacity-100" />
                                        <div className="relative z-10">
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                                                    {event.icon}
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                                                        {event.venue}
                                                    </div>
                                                </div>
                                            </div>
                                            <h3 className="text-base font-bold text-white mb-1">{event.title}</h3>
                                            <div className="flex items-center text-sm text-gray-300 mt-2">
                                                <Calendar className="w-3 h-3 mr-1.5 text-cyan-500/70" />
                                                <span className="truncate">{event.time}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}

                    {/* End marker */}
                    <div className="relative flex-shrink-0 flex flex-col items-center justify-center pr-[10vw]">
                        <div className="w-20 h-20 rounded-full border-4 border-cyan-500/30 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                            <Trophy className="w-9 h-9 text-cyan-400" />
                        </div>
                        <div className="mt-4 text-center w-48">
                            <div className="text-cyan-400 font-bold text-lg mb-1">That's a Wrap!</div>
                            <div className="text-gray-500 text-sm">See you at the event!</div>
                        </div>
                    </div>
                </motion.div>

                {/* Progress bar */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-48 h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-cyan-500"
                        style={{ scaleX: smoothProgress, transformOrigin: 'left' }}
                    />
                </div>
            </div>
        </section>
    );
};

/* ─────────────────────────────────────────────────────────────
   Root: renders mobile or desktop variant based on viewport
   ───────────────────────────────────────────────────────────── */
const HorizontalTimelineEvents = () => {
    const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

    useEffect(() => {
        const mq = window.matchMedia('(max-width: 767px)');
        const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
        mq.addEventListener('change', handler);
        setIsMobile(mq.matches);
        return () => mq.removeEventListener('change', handler);
    }, []);

    return isMobile ? <MobileTimeline /> : <DesktopTimeline />;
};

export default HorizontalTimelineEvents;
