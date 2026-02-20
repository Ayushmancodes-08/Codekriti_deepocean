import { useRef, useState, useEffect } from 'react';
import { Calendar, Trophy, Code, Rocket, Lightbulb, Puzzle, Target } from 'lucide-react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const HorizontalTimelineEvents = () => {
    // Container ref for the scroll wrapper
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const [maxScroll, setMaxScroll] = useState(0);

    const timelineData = [
        {
            date: 'Day 1',
            dateLabel: 'March 6, 2026',
            events: [
                {
                    id: 'innov-qualifier',
                    title: 'Innovation Challenge (Qualifier Round)',
                    time: '09:15 AM – 09:45 AM',
                    venue: 'Room 413B',
                    icon: <Lightbulb className="w-5 h-5" />,
                    side: 'top'
                },
                {
                    id: 'inauguration',
                    title: 'Inauguration Ceremony',
                    time: '10:00 AM – 10:15 AM',
                    venue: 'Room 110',
                    icon: <Trophy className="w-5 h-5" />,
                    side: 'bottom'
                },
                {
                    id: 'algo-code',
                    title: 'Algorithm to Code',
                    time: '10:30 AM – 12:00 PM',
                    venue: 'Room 525',
                    icon: <Code className="w-5 h-5" />,
                    side: 'top'
                },
                {
                    id: 'innov-final',
                    title: 'Innovation Challenge (Final Round)',
                    time: '12:00 PM – 01:00 PM',
                    venue: 'Room 117',
                    icon: <Lightbulb className="w-5 h-5" />,
                    side: 'bottom'
                },
                {
                    id: 'tech-maze',
                    title: 'Tech Maze',
                    time: '02:00 PM – 05:00 PM',
                    venue: 'Room 125, 413(B) & 117',
                    icon: <Puzzle className="w-5 h-5" />,
                    side: 'top'
                }
            ]
        },
        {
            date: 'Day 2',
            dateLabel: 'March 7, 2026',
            events: [
                {
                    id: 'dev-start',
                    title: 'DevXtreme (Start)',
                    time: '09:00 AM',
                    venue: 'Room 110',
                    icon: <Rocket className="w-5 h-5" />,
                    side: 'top'
                },
                {
                    id: 'designathon',
                    title: 'Designathon',
                    time: '11:00 AM – 01:00 PM',
                    venue: 'Room 413(B)',
                    icon: <Target className="w-5 h-5" />,
                    side: 'bottom'
                },
                {
                    id: 'dev-end',
                    title: 'DevXtreme (End)',
                    time: '05:00 PM',
                    venue: 'Room 110',
                    icon: <Rocket className="w-5 h-5" />,
                    side: 'top'
                },
                {
                    id: 'valedictory',
                    title: 'Valedictory Ceremony',
                    time: '05:00 PM – 05:30 PM',
                    venue: 'Room 110',
                    icon: <Trophy className="w-5 h-5" />,
                    side: 'bottom'
                }
            ]
        }
    ];

    // Track scroll progress of the container
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Smooth out the scroll progress
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    // Calculate the width of the content to scroll exactly to the end
    useEffect(() => {
        const updateWidth = () => {
            if (contentRef.current) {
                const width = contentRef.current.scrollWidth;
                const windowWidth = window.innerWidth;
                // Scroll enough to show the end, plus a little buffer
                setMaxScroll(width - windowWidth + 100);
            }
        };

        // Initial update
        updateWidth();
        // Update on resize
        window.addEventListener('resize', updateWidth);
        return () => window.removeEventListener('resize', updateWidth);
    }, [timelineData]); // timelineData is now defined before this effect

    const x = useTransform(smoothProgress, [0, 1], ["0px", `-${maxScroll}px`]);

    // Opacity for title
    const titleOpacity = useTransform(smoothProgress, [0, 0.1], [1, 0]);
    const titleScale = useTransform(smoothProgress, [0, 0.1], [1, 0.9]);
    const titleY = useTransform(smoothProgress, [0, 0.1], [0, -50]);

    return (
        <section
            id="schedule"
            ref={containerRef}
            className="relative bg-black/40"
            style={{ height: '450vh' }} // Increased height slightly to accommodate longer scroll
        >
            <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center">

                {/* Background Line */}
                <div className="absolute left-0 right-0 top-1/2 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent -translate-y-1/2 z-0" />

                {/* Introductory Title (Fades out) */}
                <motion.div
                    style={{ opacity: titleOpacity, scale: titleScale, y: titleY }}
                    className="absolute top-1/2 -translate-y-1/2 left-4 md:left-12 z-20 pointer-events-none text-left max-w-sm md:max-w-md"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-900/20 backdrop-blur-sm text-blue-300 text-xs font-bold tracking-widest uppercase mb-6">
                        <Trophy className="w-3 h-3" />
                        Schedule
                    </div>
                    <h2 className="font-display text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-400 drop-shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                            Event Timeline
                        </span>
                    </h2>
                    <p className="text-gray-400 max-w-sm text-base md:text-lg">
                        Scroll down to explore the complete schedule of events.
                    </p>
                </motion.div>

                {/* Horizontal Moving Content */}
                <motion.div
                    ref={contentRef}
                    style={{ x }}
                    className="flex items-center pl-[100vw] sm:pl-[45vw] md:pl-[35vw] pr-[15vw] gap-[8vw] md:gap-[10vw] h-full w-max" // Push start to right, w-max for proper width calc
                >
                    {timelineData.map((day) => (
                        <div key={day.date} className="flex gap-[8vw] items-center">
                            {/* Day Marker */}
                            <div className="relative flex-shrink-0">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
                                <div className="px-8 py-3 rounded-full bg-cyan-950/80 border border-cyan-500/50 backdrop-blur-md shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                                    <span className="text-2xl font-bold text-cyan-100 font-display tracking-wider whitespace-nowrap">{day.dateLabel}</span>
                                </div>
                            </div>

                            {/* Events for this day */}
                            {day.events.map((event) => (
                                <div key={event.id} className="relative flex-shrink-0 group">
                                    {/* Central Node on Line */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-black border-2 border-cyan-500 z-10 shadow-[0_0_10px_rgba(6,182,212,0.5)]" />

                                    {/* Connection Line */}
                                    <div
                                        className={`absolute left-1/2 -translate-x-1/2 w-[2px] bg-cyan-500/30 h-10 transition-all duration-300 ${event.side === 'top' ? 'bottom-1/2 origin-bottom' : 'top-1/2 origin-top'}`}
                                    />

                                    {/* Event Card */}
                                    <div
                                        className={`relative w-[420px] bg-black/30 border border-white/20 rounded-xl p-4 backdrop-blur-md ${event.side === 'top' ? '-translate-y-[calc(50%+40px)]' : 'translate-y-[calc(50%+40px)]'}`}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 rounded-xl opacity-30" />

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

                                            <h3 className="text-lg font-bold text-white mb-1 transition-colors">{event.title}</h3>

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

                    {/* End Marker */}
                    <div className="relative flex-shrink-0 flex items-center justify-center pr-[20vw]">
                        <div className="w-24 h-24 rounded-full border-4 border-cyan-500/30 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                            <Trophy className="w-10 h-10 text-cyan-400" />
                        </div>
                        <div className="absolute top-28 text-center w-60">
                            <div className="text-cyan-400 font-bold text-xl mb-1">That's Wrapped!</div>
                            <div className="text-gray-500 text-sm">See you at the event!</div>
                        </div>
                    </div>

                </motion.div>

                {/* Progress Bar */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-64 h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-cyan-500"
                        style={{ scaleX: smoothProgress, transformOrigin: 'left' }}
                    />
                </div>
            </div>
        </section>
    );
};

export default HorizontalTimelineEvents;
