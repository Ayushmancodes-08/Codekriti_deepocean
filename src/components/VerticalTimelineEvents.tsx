import { Calendar, Users, Trophy, Code, Rocket, Lightbulb, Puzzle, Target } from 'lucide-react';
import OceanRegistrationModal from '@/components/registration/OceanRegistrationModal';
import { useState } from 'react';
import { motion } from 'framer-motion';

const VerticalTimelineEvents = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [preSelectedEvent, setPreSelectedEvent] = useState<string | null>(null);

    const handleRegisterClick = (eventId: string) => {
        setPreSelectedEvent(eventId);
        setIsModalOpen(true);
    };

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
                    side: 'left'
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
                    side: 'right'
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
                    side: 'left'
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
                    side: 'right'
                }
            ]
        }
    ];

    return (
        <section id="events" className="relative py-24 bg-black/40 overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-900/20 backdrop-blur-sm text-blue-300 text-xs font-bold tracking-widest uppercase mb-6">
                        <Trophy className="w-3 h-3" />
                        Choose Your Path
                    </div>
                    <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-400 drop-shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                            Event Timeline
                        </span>
                    </h2>
                    <p className="font-body text-gray-400 max-w-2xl mx-auto text-lg">
                        Two days of innovation, competition, and technological excellence.
                    </p>
                </motion.div>

                <div className="relative max-w-5xl mx-auto">
                    {/* Central Line */}
                    <motion.div
                        initial={{ height: 0 }}
                        whileInView={{ height: '100%' }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-500/0 via-cyan-500/50 to-cyan-500/0 transform -translate-x-1/2 hidden md:block"
                    />

                    <div className="space-y-24">
                        {timelineData.map((day) => (
                            <div key={day.date} className="relative">
                                {/* Date Header */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5 }}
                                    className="flex justify-center mb-12 relative z-10"
                                >
                                    <div className="bg-cyan-950/80 border border-cyan-500/50 px-6 py-2 rounded-full backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                                        <span className="text-cyan-400 font-bold font-display tracking-wider">{day.dateLabel}</span>
                                    </div>
                                </motion.div>

                                <div className="space-y-12">
                                    {day.events.map((event) => (
                                        <div key={event.id} className={`relative flex items-center ${event.side === 'left' ? 'md:flex-row' : 'md:flex-row-reverse'} flex-col gap-8 md:gap-0`}>

                                            {/* Content Side */}
                                            <div className="w-full md:w-1/2 flex justify-center md:justify-end px-4">
                                                <motion.div
                                                    initial={{ opacity: 0, x: event.side === 'left' ? -50 : 50 }}
                                                    whileInView={{ opacity: 1, x: 0 }}
                                                    viewport={{ once: true, margin: "-100px" }}
                                                    transition={{ duration: 0.6, delay: 0.2 }}
                                                    className={`relative w-full max-w-md bg-black/60 border border-white/10 rounded-2xl p-6 hover:border-cyan-500/50 transition-all duration-300 group hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] ${event.side === 'left' ? 'md:mr-12' : 'md:ml-12'}`}
                                                >

                                                    {/* Branch Connector (Desktop) */}
                                                    <motion.div
                                                        initial={{ scaleX: 0 }}
                                                        whileInView={{ scaleX: 1 }}
                                                        viewport={{ once: true }}
                                                        transition={{ duration: 0.5, delay: 0.5 }}
                                                        style={{ transformOrigin: event.side === 'left' ? 'right' : 'left' }}
                                                        className={`hidden md:block absolute top-1/2 -translate-y-1/2 w-12 h-[2px] bg-cyan-500/30 ${event.side === 'left' ? '-right-12' : '-left-12'}`}
                                                    >
                                                        <motion.div
                                                            initial={{ scale: 0 }}
                                                            whileInView={{ scale: 1 }}
                                                            viewport={{ once: true }}
                                                            transition={{ duration: 0.3, delay: 1 }}
                                                            className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-cyan-500 ${event.side === 'left' ? '-right-1.5' : '-left-1.5'} shadow-[0_0_10px_rgba(6,182,212,0.8)]`}
                                                        />
                                                    </motion.div>

                                                    {/* Mobile Connector */}
                                                    <div className="md:hidden absolute -top-8 left-1/2 -translate-x-1/2 w-[2px] h-8 bg-cyan-500/30">
                                                        <div className="absolute top-0 -translate-x-1/2 w-3 h-3 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
                                                    </div>

                                                    <div className="flex items-start justify-between mb-4">
                                                        <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 group-hover:scale-110 transition-transform duration-300">
                                                            {event.icon}
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-gray-300 mb-1">
                                                                {event.fee}
                                                            </div>
                                                            <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                                                                {event.category}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">{event.title}</h3>
                                                    <p className="text-gray-400 text-sm mb-6 line-clamp-2">{event.description}</p>

                                                    <div className="grid grid-cols-2 gap-y-2 mb-6 text-sm text-gray-300">
                                                        <div className="flex items-center">
                                                            <Calendar className="w-4 h-4 mr-2 text-cyan-500/70" />
                                                            {event.time}
                                                        </div>
                                                        <div className="flex items-center">
                                                            <Target className="w-4 h-4 mr-2 text-cyan-500/70" />
                                                            {event.venue}
                                                        </div>
                                                        <div className="flex items-center col-span-2">
                                                            <Users className="w-4 h-4 mr-2 text-cyan-500/70" />
                                                            {event.teamSize}
                                                        </div>
                                                    </div>

                                                    <button
                                                        onClick={() => handleRegisterClick(event.id)}
                                                        className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 hover:border-cyan-500/60 text-white font-semibold transition-all duration-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] flex items-center justify-center gap-2 group/btn"
                                                    >
                                                        Register Now
                                                        <Rocket className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                                    </button>
                                                </motion.div>
                                            </div>

                                            {/* Center Point (Desktop) */}
                                            <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center justify-center">
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    whileInView={{ scale: 1 }}
                                                    viewport={{ once: true }}
                                                    transition={{ duration: 0.4, delay: 0.8 }}
                                                    className="w-4 h-4 bg-black border-2 border-cyan-500 rounded-full z-10 shadow-[0_0_15px_rgba(6,182,212,0.5)]"
                                                />
                                            </div>

                                            {/* Empty Space for alignment */}
                                            <div className="hidden md:block w-1/2" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
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

export default VerticalTimelineEvents;
