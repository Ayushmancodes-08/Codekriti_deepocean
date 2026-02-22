import { useRef, useState, useEffect } from 'react';
import { Calendar, Users, Target, Code, Rocket, Lightbulb, Puzzle, Palette, FileText, Clock, MapPin, Phone } from 'lucide-react';
import OceanRegistrationModal from '@/components/registration/OceanRegistrationModal';
import { ASSETS } from '@/config/assets';

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

// Per-event gradient accent configs — toned-down intensity
const EVENT_THEMES = {
    devxtreme: { from: 'from-red-500/10', to: 'to-orange-500/5', border: 'hover:border-red-500/40', glow: 'hover:shadow-[0_0_24px_rgba(239,68,68,0.12)]', badge: 'bg-red-500/10 text-red-300/80 border-red-500/20', bar: 'from-red-500 to-orange-400', iconBg: 'bg-red-500/10', iconColor: 'text-red-400', pillFrom: 'from-red-500/20', pillTo: 'to-orange-500/10' },
    designathon: { from: 'from-purple-500/10', to: 'to-pink-500/5', border: 'hover:border-purple-500/40', glow: 'hover:shadow-[0_0_24px_rgba(168,85,247,0.12)]', badge: 'bg-purple-500/10 text-purple-300/80 border-purple-500/20', bar: 'from-purple-500 to-pink-400', iconBg: 'bg-purple-500/10', iconColor: 'text-purple-400', pillFrom: 'from-purple-500/20', pillTo: 'to-pink-500/10' },
    techmaze: { from: 'from-green-500/10', to: 'to-emerald-500/5', border: 'hover:border-green-500/40', glow: 'hover:shadow-[0_0_24px_rgba(34,197,94,0.12)]', badge: 'bg-green-500/10 text-green-300/80 border-green-500/20', bar: 'from-green-500 to-emerald-400', iconBg: 'bg-green-500/10', iconColor: 'text-green-400', pillFrom: 'from-green-500/20', pillTo: 'to-emerald-500/10' },
    'innovation-challenge': { from: 'from-yellow-500/10', to: 'to-amber-500/5', border: 'hover:border-yellow-500/40', glow: 'hover:shadow-[0_0_24px_rgba(234,179,8,0.12)]', badge: 'bg-yellow-500/10 text-yellow-300/80 border-yellow-500/20', bar: 'from-yellow-500 to-amber-400', iconBg: 'bg-yellow-500/10', iconColor: 'text-yellow-400', pillFrom: 'from-yellow-500/20', pillTo: 'to-amber-500/10' },
    'algo-to-code': { from: 'from-cyan-500/10', to: 'to-blue-500/5', border: 'hover:border-cyan-500/40', glow: 'hover:shadow-[0_0_24px_rgba(6,182,212,0.12)]', badge: 'bg-cyan-500/10 text-cyan-300/80 border-cyan-500/20', bar: 'from-cyan-500 to-blue-400', iconBg: 'bg-cyan-500/10', iconColor: 'text-cyan-400', pillFrom: 'from-cyan-500/20', pillTo: 'to-blue-500/10' },
};

const events = [
    {
        id: 'devxtreme',
        title: 'DevXtreme',
        date: 'March 7, 2026',
        time: '8 Hours',
        venue: 'Main Auditorium',
        teamSize: 'Team of 3–5',
        image: ASSETS.DEVXTREME_POSTER || 'https://images.unsplash.com/photo-1504384308090-c54be3855833?q=80&w=800&auto=format&fit=crop',
        description: 'The ultimate 8-hour hackathon. Build, deploy, and win against the best in the field.',
        prize: '₹500',
        category: 'Hackathon',
        rulebook_url: '/assets/Devxtreme.pdf',
        icon: <Rocket className="w-4 h-4" />,
        contacts: [
            { name: 'Debasish Sahu', phone: '+91 78468 03607' },
            { name: 'Omkar Padhy', phone: '+91 891 739 3805' },
        ],
    },
    {
        id: 'designathon',
        title: 'Designathon',
        date: 'March 7, 2026',
        time: '11:00 AM',
        venue: 'Design Studio',
        teamSize: 'Individual',
        image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=800&auto=format&fit=crop',
        description: 'UI/UX design challenge. Create stunning interfaces and unforgettable user experiences.',
        prize: '₹60',
        category: 'Design',
        rulebook_url: '/assets/Designathon.pdf',
        icon: <Palette className="w-4 h-4" />,
        contacts: [
            { name: 'Subhashree Panda', phone: '+91 63708 40502' },
            { name: 'Anisha Parida', phone: '+91 7653 915 538' },
        ],
    },
    {
        id: 'techmaze',
        title: 'Tech Maze',
        date: 'March 6, 2026',
        time: '02:00 PM',
        venue: 'Central Courtyard',
        teamSize: 'Team of 3',
        image: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=800&auto=format&fit=crop',
        description: 'Navigate through a series of technical puzzles and rapid-fire quizzes under pressure.',
        prize: '₹90',
        category: 'Quiz',
        rulebook_url: '/assets/TechMaze.pdf',
        icon: <Puzzle className="w-4 h-4" />,
        contacts: [
            { name: 'Subhashree Panda', phone: '+91 63708 40502' },
            { name: 'Anisha Parida', phone: '+91 7653 915 538' },
        ],
    },
    {
        id: 'innovation-challenge',
        title: 'Innovation Challenge',
        date: 'March 6, 2026',
        time: '09:00 AM',
        venue: 'Seminar Hall',
        teamSize: 'Team of 2',
        image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop',
        description: 'Pitch your innovative ideas and solutions to real-world problems before a live jury.',
        prize: '₹60',
        category: 'Pitch',
        rulebook_url: '/assets/Innovation Challenge.pdf',
        icon: <Lightbulb className="w-4 h-4" />,
        contacts: [
            { name: 'Bikash Ranjan Hota', phone: '+91 70086 60169' },
            { name: 'Sarthak Mishra', phone: '+91 63700 98590' },
        ],
    },
    {
        id: 'algo-to-code',
        title: 'Algo to Code',
        date: 'March 6, 2026',
        time: '10:00 AM',
        venue: 'Lab Complex 1',
        teamSize: 'Individual',
        image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=800&auto=format&fit=crop',
        description: 'Competitive programming contest testing algorithmic thinking and raw coding efficiency.',
        prize: '₹30',
        category: 'Coding',
        rulebook_url: '/assets/AlgotoCode.pdf',
        icon: <Code className="w-4 h-4" />,
        contacts: [
            { name: 'Debasish Sahu', phone: '+91 78468 03607' },
            { name: 'Omkar Padhy', phone: '+91 891 739 3805' },
        ],
    },
];

type EventTheme = typeof EVENT_THEMES[keyof typeof EVENT_THEMES];
type EventItem = typeof events[number];

const EventCard = ({
    event,
    theme,
    index,
    isSectionVisible,
    handleRegisterClick,
}: {
    event: EventItem;
    theme: EventTheme;
    index: number;
    isSectionVisible: boolean;
    handleRegisterClick: (id: string) => void;
}) => (
    <div
        className={`
            group relative flex flex-col rounded-2xl overflow-hidden h-full
            border border-white/8 bg-gradient-to-b ${theme.from} ${theme.to}
            backdrop-blur-md
            transition-all duration-500 ease-out
            ${theme.border} ${theme.glow}
            hover:-translate-y-1
            ${isSectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
        `}
        style={{ transitionDelay: `${index * 80}ms` }}
    >
        {/* Top accent bar */}
        <div className={`absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r ${theme.bar} opacity-50 group-hover:opacity-90 transition-opacity duration-300`} />

        {/* Image */}
        <div className="relative h-44 sm:h-48 overflow-hidden flex-shrink-0">
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent z-10" />
            <div className={`absolute inset-0 bg-gradient-to-br ${theme.pillFrom} ${theme.pillTo} opacity-20 z-10 mix-blend-overlay`} />
            <img
                src={event.image}
                alt={`${event.title} event`}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
            />
            {/* Category badge — no prize here */}
            <div className={`absolute top-3 left-3 z-20 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-bold uppercase tracking-wider backdrop-blur-sm ${theme.badge}`}>
                <span className={theme.iconColor}>{event.icon}</span>
                {event.category}
            </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 flex flex-col flex-grow">
            <h3 className="font-display text-lg sm:text-xl font-bold text-white mb-1.5 leading-tight">
                {event.title}
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 mb-4 leading-relaxed line-clamp-2 flex-grow">
                {event.description}
            </p>

            {/* Meta grid */}
            <div className="grid grid-cols-2 gap-x-3 gap-y-2 mb-3 text-xs text-gray-300">
                <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-cyan-500 flex-shrink-0" />
                    <span className="truncate">{event.date}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-cyan-500 flex-shrink-0" />
                    <span className="truncate">{event.time}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-cyan-500 flex-shrink-0" />
                    <span className="truncate">{event.teamSize}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-cyan-500 flex-shrink-0" />
                    <span className="truncate">{event.venue}</span>
                </div>
            </div>

            {/* Contact numbers */}
            <div className={`rounded-xl border border-white/8 bg-white/3 px-3 py-2.5 mb-4 space-y-1.5`}>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Event Contacts</p>
                {event.contacts.map((c) => (
                    <a
                        key={c.phone}
                        href={`tel:${c.phone.replace(/\s/g, '')}`}
                        className="flex items-center gap-2 group/c"
                    >
                        <Phone className={`w-3 h-3 flex-shrink-0 ${theme.iconColor} opacity-70 group-hover/c:opacity-100 transition-opacity`} />
                        <span className="text-xs text-gray-400 group-hover/c:text-white transition-colors leading-none">
                            <span className="font-semibold text-gray-300">{c.name}</span>
                            <span className="mx-1 text-gray-600">·</span>
                            <span>{c.phone}</span>
                        </span>
                    </a>
                ))}
            </div>

            {/* Divider */}
            <div className={`h-px bg-gradient-to-r ${theme.bar} opacity-15 mb-3`} />

            {/* CTA row */}
            <div className="flex gap-2 mt-auto">
                <button
                    onClick={() => handleRegisterClick(event.id)}
                    className={`
                        flex-1 py-2.5 rounded-xl font-display font-semibold text-sm
                        bg-gradient-to-r ${theme.pillFrom} ${theme.pillTo}
                        border border-white/10 hover:border-white/20
                        text-white transition-all duration-300
                        hover:brightness-125 active:scale-95
                        flex items-center justify-center gap-2
                        min-h-[42px]
                    `}
                    aria-label={`Register for ${event.title}`}
                >
                    <Rocket className="w-3.5 h-3.5" aria-hidden="true" />
                    Register
                </button>
                <a
                    href={event.rulebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Download Rulebook"
                    className="w-11 h-11 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-gray-400 hover:text-white transition-all duration-300 active:scale-95 flex-shrink-0"
                >
                    <FileText className="w-4 h-4" />
                </a>
            </div>
        </div>

        {/* Bottom glow on hover */}
        <div className={`absolute bottom-0 inset-x-0 h-0.5 bg-gradient-to-r ${theme.bar} opacity-0 group-hover:opacity-40 transition-opacity duration-500`} />
    </div>
);

const EventCardsSection = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [preSelectedEvent, setPreSelectedEvent] = useState<string | null>(null);
    const [sectionRef, isSectionVisible] = useIntersectionObserver({ threshold: 0.05, rootMargin: '0px' });

    const handleRegisterClick = (eventId: string) => {
        setPreSelectedEvent(eventId);
        setIsModalOpen(true);
    };

    return (
        <section
            id="events"
            ref={sectionRef}
            className="relative py-16 sm:py-20 md:py-24 bg-black/20 backdrop-blur-sm overflow-hidden"
        >
            {/* Subtle background glow blobs */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* Section header */}
                <div className={`text-center mb-10 sm:mb-14 transition-all duration-700 ${isSectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-900/20 backdrop-blur-sm text-cyan-300 text-xs font-bold tracking-widest uppercase mb-4">
                        <Target className="w-3 h-3" />
                        Event Highlights
                    </div>
                    <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 leading-tight">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-300">
                            Featured Events
                        </span>
                    </h2>
                    <p className="font-body text-gray-400 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
                        Five distinct challenges. One arena. Prove your mastery in the digital deep.
                    </p>
                </div>

                {/* 
                    Row 1: 3 cards (full 3-col on lg+, 2-col on sm, 1-col on mobile)
                    Row 2: 2 cards centered — on lg they sit under cols 1 & 2 of row 1
                           so we use offset via justify-center + max-w
                */}
                {/* Row 1 — cards 0,1,2 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mb-5 sm:mb-6">
                    {events.slice(0, 3).map((event, index) => {
                        const theme = EVENT_THEMES[event.id as keyof typeof EVENT_THEMES];
                        return (
                            <EventCard key={event.id} event={event} theme={theme} index={index} isSectionVisible={isSectionVisible} handleRegisterClick={handleRegisterClick} />
                        );
                    })}
                </div>
                {/* Row 2 — 2 cards perfectly centered under the middle of the 3 above */}
                <div className="flex flex-col sm:flex-row gap-5 sm:gap-6 justify-center">
                    {events.slice(3).map((event, index) => {
                        const theme = EVENT_THEMES[event.id as keyof typeof EVENT_THEMES];
                        return (
                            <div key={event.id} className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]">
                                <EventCard event={event} theme={theme} index={index + 3} isSectionVisible={isSectionVisible} handleRegisterClick={handleRegisterClick} />
                            </div>
                        );
                    })}
                </div>
            </div>

            <OceanRegistrationModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setPreSelectedEvent(null); }}
                preSelectedEventId={preSelectedEvent}
            />
        </section>
    );
};

export default EventCardsSection;
