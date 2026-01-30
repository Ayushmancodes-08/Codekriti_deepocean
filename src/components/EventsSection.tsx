import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Calendar, Users, Trophy, Target, Code, Rocket, Lightbulb, Puzzle } from 'lucide-react';
import OceanRegistrationModal from '@/components/registration/OceanRegistrationModal';

const EventsSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [preSelectedEvent, setPreSelectedEvent] = useState<string | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const handleRegisterClick = (eventId: string) => {
    setPreSelectedEvent(eventId);
    setIsModalOpen(true);
  };


  const events = [
    {
      id: 'algotocode',
      title: 'Algo-to-Code',
      date: 'March 15, 2026',
      time: '10:00 AM',
      venue: 'Lab Complex 1',
      teamSize: 'Individual',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2670&auto=format&fit=crop',
      description: 'Transform algorithms into elegant code. Solve complex algorithmic challenges and optimize your solutions.',
      prize: '₹25,000',
      icon: <Code className="w-5 h-5 text-cyan-400" />
    },
    {
      id: 'techmaze',
      title: 'TechMaze',
      date: 'March 15, 2026',
      time: '02:00 PM',
      venue: 'Central Courtyard',
      teamSize: 'Team of 3',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2670&auto=format&fit=crop',
      description: 'Navigate through complex technological puzzles and logical labyrinths in a treasure hunt format.',
      prize: '₹15,000',
      icon: <Puzzle className="w-5 h-5 text-cyan-400" />
    },
    {
      id: 'designathon',
      title: 'Designathon',
      date: 'March 16, 2026',
      time: '09:00 AM',
      venue: 'Design Studio',
      teamSize: '1-2 Members',
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=2664&auto=format&fit=crop',
      description: 'Craft beautiful, intuitive interfaces. 24-hour UI/UX challenge to solve real-world problems.',
      prize: '₹20,000',
      icon: <Lightbulb className="w-5 h-5 text-cyan-400" />
    },
    {
      id: 'devxtreme',
      title: 'DevXtreme',
      date: 'March 14-16, 2026',
      time: '48 Hours',
      venue: 'Main Auditorium',
      teamSize: 'Team of 2-4',
      image: '/images/devxtreme-poster.png',
      description: '48 hours of pure creation. Build the next big thing from AI agents to Blockchain dApps.',
      prize: '₹50,000',
      icon: <Rocket className="w-5 h-5 text-cyan-400" />
    }
  ];

  return (
    <section id="events" ref={ref} className="relative min-h-screen py-24 overflow-hidden bg-black/40">



      <div className="container mx-auto px-6 relative z-10">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-900/20 backdrop-blur-sm text-blue-300 text-xs font-bold tracking-widest uppercase mb-6"
          >
            <Target className="w-3 h-3" />
            Choose Your Path
          </motion.div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-400 drop-shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              Expeditions
            </span>
          </h2>
          <p className="font-body text-gray-400 max-w-2xl mx-auto text-lg">
            Four legendary events await the brave. Choose your mission and prove your worth.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-8"
          >
            {events.map((event) => (
              <motion.div
                key={event.id}
                layoutId={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 * events.indexOf(event), ease: [0.25, 0.46, 0.45, 0.94] }}
                whileHover={{ y: -8, transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] } }}
                className="group relative bg-black/40 border border-white/10 rounded-2xl overflow-hidden hover:border-cyan-500/50 transition-all duration-300 flex flex-col md:flex-row"
              >
                {/* Image Container - Left Side on Desktop */}
                <div className="relative h-56 md:h-auto md:w-2/5 overflow-hidden bg-gray-900">
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black via-transparent to-transparent z-10" />
                  <img
                    src={event.image}
                    alt={event.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 z-20 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-2">
                    {event.icon}
                  </div>
                </div>

                {/* Content - Right Side */}
                <div className="p-5 md:p-6 md:w-3/5 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-sm text-gray-400 mb-4 md:mb-6 line-clamp-2">
                      {event.description}
                    </p>

                    <div className="space-y-2 mb-6">
                      <div className="flex items-center text-sm text-gray-300">
                        <Calendar className="w-4 h-4 mr-3 text-cyan-500 shrink-0" />
                        {event.date} • {event.time}
                      </div>
                      <div className="flex items-center text-sm text-gray-300">
                        <Target className="w-4 h-4 mr-3 text-cyan-500 shrink-0" />
                        {event.venue}
                      </div>
                      <div className="flex items-center text-sm text-gray-300">
                        <Users className="w-4 h-4 mr-3 text-cyan-500 shrink-0" />
                        {event.teamSize}
                      </div>
                      <div className="flex items-center text-sm text-gray-300">
                        <Trophy className="w-4 h-4 mr-3 text-yellow-500 shrink-0" />
                        Prize: <span className="text-yellow-400 font-bold ml-1">{event.prize}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRegisterClick(event.id)}
                    className="w-full py-3 md:py-3 rounded-xl bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/50 text-white font-bold transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:scale-[1.02] active:scale-95 touch-manipulation"
                  >
                    Register Now
                    <Rocket className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Registration Modal */}
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

export default EventsSection;