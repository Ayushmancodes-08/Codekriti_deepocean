import { useRef } from 'react';
import { Calendar, Users, Trophy, Code, Rocket, Lightbulb, Puzzle, Target } from 'lucide-react';
import OceanRegistrationModal from '@/components/registration/OceanRegistrationModal';
import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const HorizontalTimelineEvents = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [preSelectedEvent, setPreSelectedEvent] = useState<string | null>(null);

    // Container ref for the scroll wrapper
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const [maxScroll, setMaxScroll] = useState(0);

    const timelineData = [
        {
            date: 'March 6th',
            dateLabel: 'March 6, 2026',
            events: [
                {
                    id: 'algo-to-code',
                    title: 'Algo to Code',
                    time: '10:00 AM',
                    venue: 'PMEC ACADEMIC BLOCK - Lab Complex 1',
                    teamSize: 'Individual',
                    description: 'Competitive programming contest testing algorithmic thinking and coding efficiency.',
                    fee: '₹30',
                    category: 'Intra-College',
                    icon: <Code className="w-5 h-5" />,
                    side: 'top'
                },
                {
                    id: 'innovation-challenge',
                    title: 'Innovation Challenge',
                    time: '02:00 PM',
                    venue: 'PMEC ACADEMIC BLOCK - Design Studio',
                    teamSize: '2-3 Members',
                    description: 'Non-coding ideation event. Pitch your ideas and showcase innovation.',
                    fee: '₹60',
                    category: 'Intra-College',
                    icon: <Lightbulb className="w-5 h-5" />,
                    side: 'bottom'
                },
                {
                    id: 'techmaze',
                    title: 'Tech Maze',
                    time: '04:00 PM',
                    venue: 'PMEC ACADEMIC BLOCK - Central Courtyard',
                    teamSize: 'Team of 3',
                    description: 'Technical fun event with quizzes, puzzles, and rapid-fire challenges.',
                    fee: '₹90',
                    category: 'Intra-College',
                    icon: <Puzzle className="w-5 h-5" />,
                    side: 'top'
                }
            ]
        },
        {
            date: 'March 7th',
            dateLabel: 'March 7, 2026',
            events: [
                {
                    id: 'devxtreme',
                    title: 'DevXtreme',
                    time: '18 Hours',
                    venue: 'PMEC ACADEMIC BLOCK - Main Auditorium',
                    teamSize: 'Team of 3-5',
                    description: 'Overnight hackathon working on real-world problem statements.',
                    fee: '₹400 / ₹500',
                    category: 'Inter-College',
                    icon: <Rocket className="w-5 h-5" />,
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

    const handleRegisterClick = (eventId: string) => {
        setPreSelectedEvent(eventId);
        setIsModalOpen(true);
    };



    return (
        <section
            id="events"
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
                        Timeline
                    </div>
                    <h2 className="font-display text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-400 drop-shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                            Event Journey
                        </span>
                    </h2>
                    <p className="text-gray-400 max-w-sm text-base md:text-lg">
                        Scroll down to explore the timeline
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
                                        className={`relative w-[420px] bg-black/80 border border-white/10 rounded-xl p-4 backdrop-blur-xl ${event.side === 'top' ? '-translate-y-[calc(50%+40px)]' : 'translate-y-[calc(50%+40px)]'}`}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-600/5 rounded-xl opacity-50" />

                                        <div className="relative z-10">
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                                                    {event.icon}
                                                </div>
                                                <div className="text-right">
                                                    <div className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-gray-300 mb-1">
                                                        {event.fee}
                                                    </div>
                                                    <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                                                        {event.category}
                                                    </div>
                                                </div>
                                            </div>

                                            <h3 className="text-lg font-bold text-white mb-1 transition-colors">{event.title}</h3>
                                            <p className="text-gray-400 text-xs mb-3 line-clamp-2 leading-relaxed">{event.description}</p>

                                            <div className="grid grid-cols-2 gap-y-1 mb-3 text-xs text-gray-300">
                                                <div className="flex items-center">
                                                    <Calendar className="w-3 h-3 mr-1.5 text-cyan-500/70" />
                                                    <span className="truncate">{event.time}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <Target className="w-3 h-3 mr-1.5 text-cyan-500/70" />
                                                    <span className="truncate">{event.venue}</span>
                                                </div>
                                                <div className="flex items-center col-span-2">
                                                    <Users className="w-3 h-3 mr-1.5 text-cyan-500/70" />
                                                    {event.teamSize}
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => handleRegisterClick(event.id)}
                                                className="w-full py-2 rounded-lg bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 hover:bg-cyan-600/20 text-white font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2"
                                            >
                                                Register Now
                                                <Rocket className="w-3.5 h-3.5 ml-1" />
                                            </button>
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
                            <div className="text-gray-500 text-sm">Continue scrolling to register</div>
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

            <OceanRegistrationModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setPreSelectedEvent(null);
                }}
                preSelectedEventId={preSelectedEvent}
            />
        </section>
    );
};

export default HorizontalTimelineEvents;
