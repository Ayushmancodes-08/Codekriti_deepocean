import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flag, Mic, Code, Utensils, Gamepad2, Sparkles, Coffee, Anchor, Lightbulb, Trophy } from 'lucide-react';
import submarineShip from '@/assets/submarine_ship.png';
import oceanBg from '@/assets/ocean_background.png';

gsap.registerPlugin(ScrollTrigger);

interface ScheduleEvent {
    id: string;
    time: string;
    title: string;
    description: string;
    icon: JSX.Element;
    pathX: number;
    pathY: number;
}

const day1Events: ScheduleEvent[] = [
    { id: '1', time: '09:00 AM', title: 'The Descent', description: 'Registration & Check-in', icon: <Flag className="w-5 h-5" />, pathX: 0, pathY: 0 },
    { id: '2', time: '10:30 AM', title: 'Sonar Ping', description: 'Opening Ceremony', icon: <Mic className="w-5 h-5" />, pathX: 14, pathY: -60 },
    { id: '3', time: '11:00 AM', title: 'Dive Start', description: 'Hacking Begins', icon: <Code className="w-5 h-5" />, pathX: 28, pathY: 60 },
    { id: '4', time: '01:30 PM', title: 'Refuel', description: 'Lunch Break', icon: <Utensils className="w-5 h-5" />, pathX: 42, pathY: -60 },
    { id: '5', time: '05:00 PM', title: 'Currents', description: 'Gaming Hour', icon: <Gamepad2 className="w-5 h-5" />, pathX: 56, pathY: 60 },
    { id: '6', time: '09:00 PM', title: 'Abysseast', description: 'Dinner Time', icon: <Utensils className="w-5 h-5" />, pathX: 70, pathY: -60 },
    { id: '7', time: '12:00 AM', title: 'Midnight Glow', description: 'Surprise Event', icon: <Sparkles className="w-5 h-5" />, pathX: 84, pathY: 0 },
];

const day2Events: ScheduleEvent[] = [
    { id: '8', time: '08:00 AM', title: 'Morning Tide', description: 'Breakfast', icon: <Coffee className="w-5 h-5" />, pathX: 0, pathY: 0 },
    { id: '9', time: '11:00 AM', title: 'Surface Breach', description: 'Coding Ends', icon: <Anchor className="w-5 h-5" />, pathX: 20, pathY: -60 },
    { id: '10', time: '12:00 PM', title: 'Judgement', description: 'Project Demos', icon: <Lightbulb className="w-5 h-5" />, pathX: 40, pathY: 60 },
    { id: '11', time: '02:00 PM', title: 'Last Feast', description: 'Farewell Lunch', icon: <Utensils className="w-5 h-5" />, pathX: 60, pathY: -60 },
    { id: '12', time: '04:00 PM', title: 'Ascension', description: 'Prize Distribution', icon: <Trophy className="w-5 h-5" />, pathX: 80, pathY: 0 },
];

const ScheduleSection = () => {
    const [activeDay, setActiveDay] = useState<1 | 2>(1);
    const sectionRef = useRef<HTMLDivElement>(null);
    const timelineRef = useRef<HTMLDivElement>(null);
    const shipRef = useRef<HTMLImageElement>(null);
    const pathRef = useRef<SVGPathElement>(null);
    const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

    const currentEvents = activeDay === 1 ? day1Events : day2Events;

    useEffect(() => {
        if (!sectionRef.current || !timelineRef.current || !shipRef.current) return;

        const section = sectionRef.current;
        const timeline = timelineRef.current;
        const ship = shipRef.current;

        const timelineWidth = timeline.scrollWidth - window.innerWidth;
        const scrollDistance = timelineWidth * 0.95;

        // Kill any existing ScrollTrigger instances first
        if (scrollTriggerRef.current) {
            scrollTriggerRef.current.kill(true);
            scrollTriggerRef.current = null;
        }

        scrollTriggerRef.current = ScrollTrigger.create({
            trigger: section,
            start: 'top top',
            end: () => `+=${window.innerHeight * 2.2}`,
            pin: true,
            scrub: 1,
            onUpdate: (self) => {
                const progress = self.progress;

                // Check if elements still exist before animating
                if (!timeline || !ship) return;

                gsap.to(timeline, {
                    x: -progress * scrollDistance,
                    duration: 0.1,
                    ease: 'none'
                });

                const totalEvents = currentEvents.length;
                const eventIndex = Math.floor(progress * (totalEvents - 1));
                const nextEventIndex = Math.min(eventIndex + 1, totalEvents - 1);
                const localProgress = (progress * (totalEvents - 1)) - eventIndex;

                const currentEvent = currentEvents[eventIndex];
                const nextEvent = currentEvents[nextEventIndex];

                const shipX = currentEvent.pathX + (nextEvent.pathX - currentEvent.pathX) * localProgress;
                const shipY = currentEvent.pathY + (nextEvent.pathY - currentEvent.pathY) * localProgress;

                gsap.to(ship, {
                    x: `${shipX}vw`,
                    y: shipY,
                    duration: 0.1,
                    ease: 'none'
                });
            }
        });

        return () => {
            // Proper cleanup
            if (scrollTriggerRef.current) {
                scrollTriggerRef.current.kill(true);
                scrollTriggerRef.current = null;
            }
            // Kill any remaining GSAP animations on these elements
            gsap.killTweensOf([timeline, ship]);
        };
    }, [currentEvents]);

    const handleDayChange = (day: 1 | 2) => {
        setActiveDay(day);
        // Give React time to update before refreshing ScrollTrigger
        requestAnimationFrame(() => {
            setTimeout(() => {
                ScrollTrigger.refresh();
            }, 100);
        });
    };

    // Generate SVG path string for connecting all nodes
    const generatePath = () => {
        let pathString = `M 0 ${currentEvents[0].pathY}`;

        for (let i = 1; i < currentEvents.length; i++) {
            const prev = currentEvents[i - 1];
            const curr = currentEvents[i];
            const distance = (curr.pathX - prev.pathX);
            const controlPoint1X = prev.pathX + distance * 0.3;
            const controlPoint2X = curr.pathX - distance * 0.3;

            pathString += ` C ${controlPoint1X} ${prev.pathY}, ${controlPoint2X} ${curr.pathY}, ${curr.pathX} ${curr.pathY}`;
        }

        return pathString;
    };

    return (
        <section
            ref={sectionRef}
            id="schedule"
            className="relative w-full overflow-hidden"
            style={{
                backgroundImage: `url(${oceanBg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed'
            }}
        >
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60 pointer-events-none" />

            <div className="relative z-10 min-h-screen flex flex-col">

                {/* Header & Day Selector */}
                <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-12 md:pt-16 pb-8">
                    <div className="text-center mb-8">
                        <span className="inline-block text-cyan-400 text-xs md:text-sm font-bold uppercase tracking-widest mb-3 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">
                            Your Journey Awaits
                        </span>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6 drop-shadow-lg">
                            Expedition <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500">Timeline</span>
                        </h2>

                        <div className="inline-flex bg-black/70 backdrop-blur-xl rounded-full p-1.5 border border-cyan-500/30 shadow-lg shadow-cyan-500/20">
                            <button
                                onClick={() => handleDayChange(1)}
                                className={`relative px-6 sm:px-8 md:px-10 py-2.5 md:py-3 rounded-full text-sm md:text-base font-bold uppercase tracking-wider transition-all duration-300 ${activeDay === 1
                                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-black shadow-lg shadow-cyan-500/50'
                                    : 'text-cyan-300 hover:text-white'
                                    }`}
                            >
                                Day 1
                            </button>
                            <button
                                onClick={() => handleDayChange(2)}
                                className={`relative px-6 sm:px-8 md:px-10 py-2.5 md:py-3 rounded-full text-sm md:text-base font-bold uppercase tracking-wider transition-all duration-300 ${activeDay === 2
                                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-black shadow-lg shadow-cyan-500/50'
                                    : 'text-cyan-300 hover:text-white'
                                    }`}
                            >
                                Day 2
                            </button>
                        </div>
                    </div>
                </div>

                {/* Horizontal Timeline Container */}
                <div className="relative flex-1 flex items-center overflow-hidden">

                    {/* Spaceship */}
                    <img
                        ref={shipRef}
                        src={submarineShip}
                        alt="Voyage Ship"
                        className="absolute left-[10vw] top-1/2 -translate-y-1/2 w-32 sm:w-40 md:w-52 lg:w-64 z-40 pointer-events-none drop-shadow-[0_0_30px_rgba(6,182,212,0.8)]"
                        style={{ willChange: 'transform' }}
                    />

                    {/* Timeline Track */}
                    <div ref={timelineRef} className="relative flex items-center pl-[40vw] pr-[15vw]" style={{ willChange: 'transform' }}>

                        {/* SVG Path Overlay - The "Map Road" */}
                        <svg
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[400px] pointer-events-none z-10"
                            viewBox="0 0 100 200"
                            preserveAspectRatio="none"
                            style={{ transform: 'translateY(-50%)' }}
                        >
                            <defs>
                                <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="rgba(6, 182, 212, 0.3)" />
                                    <stop offset="50%" stopColor="rgba(6, 182, 212, 0.8)" />
                                    <stop offset="100%" stopColor="rgba(6, 182, 212, 0.3)" />
                                </linearGradient>
                                <filter id="glow">
                                    <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                                    <feMerge>
                                        <feMergeNode in="coloredBlur" />
                                        <feMergeNode in="SourceGraphic" />
                                    </feMerge>
                                </filter>
                            </defs>

                            {/* Animated dashed path */}
                            <path
                                ref={pathRef}
                                d={generatePath()}
                                fill="none"
                                stroke="url(#pathGradient)"
                                strokeWidth="0.4"
                                strokeDasharray="2 1"
                                filter="url(#glow)"
                                className="animate-[dash_20s_linear_infinite]"
                            />

                            {/* Solid glow path underneath */}
                            <path
                                d={generatePath()}
                                fill="none"
                                stroke="rgba(6, 182, 212, 0.2)"
                                strokeWidth="0.8"
                                filter="url(#glow)"
                            />
                        </svg>

                        {/* Event Nodes */}
                        {currentEvents.map((event, index) => (
                            <div
                                key={event.id}
                                className="relative flex-shrink-0"
                                style={{
                                    marginRight: index < currentEvents.length - 1 ? `${(currentEvents[index + 1].pathX - event.pathX) * 0.9}vw` : '0',
                                    transform: `translateY(${event.pathY}px)`
                                }}
                            >
                                {/* Connection Line Segment */}
                                {index < currentEvents.length - 1 && (
                                    <div className="absolute left-full top-1/2 w-full h-1 -translate-y-1/2 pointer-events-none z-0">
                                        <div className="w-full h-full bg-gradient-to-r from-cyan-500/40 via-cyan-400/60 to-cyan-500/40 blur-sm" />
                                    </div>
                                )}

                                {/* Node Container */}
                                <div className="flex flex-col items-center relative z-20">

                                    {/* Glowing Node */}
                                    <div className="relative group mb-4">
                                        {/* Outer glow rings */}
                                        <div className="absolute -inset-4 rounded-full bg-cyan-500/20 animate-pulse blur-xl" />
                                        <div className="absolute -inset-2 rounded-full bg-cyan-400/30 animate-ping opacity-75" style={{ animationDuration: '3s' }} />

                                        {/* Main node */}
                                        <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 border-4 border-cyan-300 shadow-[0_0_30px_rgba(6,182,212,0.8)] flex items-center justify-center cursor-pointer hover:scale-110 transition-all duration-300 group-hover:shadow-[0_0_50px_rgba(6,182,212,1)]">
                                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 to-transparent" />
                                            <div className="relative text-white z-10">
                                                {event.icon}
                                            </div>

                                            {/* Node number badge */}
                                            <div className="absolute -top-2 -right-2 w-6 h-6 md:w-7 md:h-7 rounded-full bg-black border-2 border-cyan-400 flex items-center justify-center text-[10px] md:text-xs font-bold text-cyan-400">
                                                {index + 1}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Event Card */}
                                    <div className="w-64 md:w-80 p-4 md:p-6 rounded-2xl border-2 border-cyan-500/50 bg-black/90 backdrop-blur-lg text-center hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all duration-300 relative overflow-hidden group">
                                        {/* Card inner glow */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                        {/* Time badge */}
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 border-2 border-cyan-400 rounded-full shadow-lg">
                                            <span className="text-[10px] md:text-xs font-bold text-white uppercase tracking-wider">
                                                {event.time}
                                            </span>
                                        </div>

                                        <div className="relative z-10 mt-3">
                                            <h3 className="text-xl md:text-2xl font-display font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                                                {event.title}
                                            </h3>
                                            <p className="text-sm md:text-base text-cyan-200/80">
                                                {event.description}
                                            </p>
                                        </div>

                                        {/* Corner decorations */}
                                        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400 opacity-50" />
                                        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400 opacity-50" />
                                        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-400 opacity-50" />
                                        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-400 opacity-50" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Scroll Hint */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-40 animate-bounce">
                    <span className="text-[10px] md:text-xs text-cyan-300 uppercase tracking-widest opacity-70 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">
                        Scroll to Navigate
                    </span>
                    <div className="w-1 h-8 rounded-full bg-gradient-to-b from-cyan-400 to-transparent shadow-[0_0_15px_rgba(6,182,212,0.8)]" />
                </div>
            </div>

            <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -10;
          }
        }
      `}</style>
        </section>
    );
};

export default ScheduleSection;
