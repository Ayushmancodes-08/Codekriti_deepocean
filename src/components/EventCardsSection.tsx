import { useRef, useState, useEffect } from 'react';
import { Calendar, Users, Trophy, Target, Code, Rocket, Lightbulb, Puzzle, Palette, FileText } from 'lucide-react';
import OceanRegistrationModal from '@/components/registration/OceanRegistrationModal';
import { ASSETS } from '@/config/assets';

// Simple hook for intersection observer
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

const EventCardsSection = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [preSelectedEvent, setPreSelectedEvent] = useState<string | null>(null);

    const [sectionRef, isSectionVisible] = useIntersectionObserver({ threshold: 0.1, rootMargin: '0px' });

    const handleRegisterClick = (eventId: string) => {
        setPreSelectedEvent(eventId);
        setIsModalOpen(true);
    };

    const events = [
        {
            id: 'algo-to-code',
            title: 'Algo to Code',
            date: 'March 6, 2026',
            time: '10:00 AM',
            venue: 'PMEC ACADEMIC BLOCK - Lab Complex 1',
            teamSize: 'Individual',
            image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=2669&auto=format&fit=crop', // Coding/Laptop
            description: 'Competitive programming contest testing algorithmic thinking and coding efficiency.',
            prize: '₹30',
            category: 'Intra-College',
            rulebook_url: '/assets/AlgotoCode.pdf',
            icon: <Code className="w-5 h-5 text-cyan-400" />
        },
        {
            id: 'designathon',
            title: 'Designathon',
            date: 'March 6, 2026',
            time: '11:00 AM',
            venue: 'PMEC ACADEMIC BLOCK - Design Studio',
            teamSize: 'Individual',
            image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=2664&auto=format&fit=crop', // Design/Creative
            description: 'UI/UX Design challenge. Create stunning interfaces and user experiences.',
            prize: '₹60',
            category: 'Intra-College',
            rulebook_url: '/assets/Designathon.pdf',
            icon: <Palette className="w-5 h-5 text-purple-400" />
        },
        {
            id: 'innovation-challenge',
            title: 'Innovation Challenge',
            date: 'March 6, 2026',
            time: '09:00 AM',
            venue: 'PMEC ACADEMIC BLOCK - Seminar Hall',
            teamSize: 'Team of 2',
            image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2670&auto=format&fit=crop', // Group/Brainstorming
            description: 'Pitch your innovative ideas and solutions to real-world problems.',
            prize: '₹60',
            category: 'Intra-College',
            rulebook_url: '/assets/Innovation Challenge.pdf',
            icon: <Lightbulb className="w-5 h-5 text-yellow-400" />
        },
        {
            id: 'techmaze',
            title: 'Tech Maze',
            date: 'March 6, 2026',
            time: '02:00 PM',
            venue: 'PMEC ACADEMIC BLOCK - Central Courtyard',
            teamSize: 'Team of 3',
            image: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=2670&auto=format&fit=crop', // Tech/Abstract
            description: 'Navigate through a series of technical puzzles and rapid-fire quizzes.',
            prize: '₹90',
            category: 'Intra-College',
            rulebook_url: '/assets/TechMaze.pdf',
            icon: <Puzzle className="w-5 h-5 text-green-400" />
        },
        {
            id: 'devxtreme',
            title: 'DevXtreme',
            date: 'March 7, 2026',
            time: '8 Hours',
            venue: 'PMEC ACADEMIC BLOCK - Main Auditorium',
            teamSize: 'Team of 3-5',
            image: ASSETS.DEVXTREME_POSTER || 'https://images.unsplash.com/photo-1504384308090-c54be3855833?q=80&w=2662&auto=format&fit=crop', // Hackathon
            description: 'The ultimate 8-hour hackathon. Build, Deploy, Win.',
            prize: '₹500',
            category: 'Inter-College',
            rulebook_url: '/assets/Devxtreme.pdf',
            icon: <Rocket className="w-5 h-5 text-red-400" />
        }
    ];

    return (
        <section id="events" ref={sectionRef} className="relative py-20 bg-black/20 backdrop-blur-sm">
            <div className="container mx-auto px-4 sm:px-6 relative z-10">

                <div className={`text-center mb-12 transition-all duration-1000 transform ${isSectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-900/20 backdrop-blur-sm text-cyan-300 text-xs font-bold tracking-widest uppercase mb-4">
                        <Target className="w-3 h-3" />
                        Event Highlights
                    </div>
                    <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                            Featured Events
                        </span>
                    </h2>
                    <p className="font-body text-gray-400 max-w-2xl mx-auto">
                        Discover the challenges that await you in the deep ocean of technology.
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-8">
                    {events.map((event, index) => (
                        <div
                            key={event.id}
                            className={`w-full md:w-[calc(50%-2rem)] lg:w-[calc(33.33%-2rem)] group relative bg-gray-900/50 border border-white/10 rounded-xl overflow-hidden hover:border-cyan-500/50 transition-all duration-500 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] flex flex-col ${isSectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                            style={{ transitionDelay: `${index * 100}ms` }}
                        >
                            {/* Image */}
                            <div className="relative h-48 overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent z-10" />
                                <img
                                    src={event.image}
                                    alt={event.title}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute top-3 left-3 z-20 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-2">
                                    {event.icon}
                                    <span className="text-xs font-bold text-white uppercase tracking-wider">{event.category}</span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-5 flex flex-col flex-grow">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-display text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                                        {event.title}
                                    </h3>
                                </div>

                                <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                                    {event.description}
                                </p>

                                <div className="space-y-2 mb-6 text-sm text-gray-300">
                                    <div className="flex items-center">
                                        <Calendar className="w-4 h-4 mr-2 text-cyan-500" />
                                        {event.date}
                                    </div>
                                    <div className="flex items-center">
                                        <Users className="w-4 h-4 mr-2 text-cyan-500" />
                                        {event.teamSize}
                                    </div>
                                    <div className="flex items-center">
                                        <Trophy className="w-4 h-4 mr-2 text-yellow-500" />
                                        Entry: <span className="text-yellow-400 font-bold ml-1">{event.prize}</span>
                                    </div>
                                </div>

                                <div className="mt-auto flex gap-3">
                                    <button
                                        onClick={() => handleRegisterClick(event.id)}
                                        className="flex-1 py-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-500/60 text-cyan-300 font-semibold transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                                    >
                                        Register
                                        <Rocket className="w-4 h-4" />
                                    </button>
                                    <a
                                        href={event.rulebook_url || '#'}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-gray-400 hover:text-white transition-all duration-300 flex items-center justify-center group/btn relative"
                                        title="Download Rulebook"
                                    >
                                        <FileText className="w-4 h-4" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
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

export default EventCardsSection;
