import { useRef, useState, useEffect } from 'react';
import { Calendar, Users, Trophy, Target, Code, Rocket, Lightbulb, Puzzle, Palette } from 'lucide-react';
import OceanRegistrationModal from '@/components/registration/OceanRegistrationModal';
import { ASSETS } from '@/config/assets';

// Simple hook for intersection observer to replace framer-motion's useInView
const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsIntersecting(true);
        // Once visible, we disconnect to keep it visible (mimic once: true)
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

const EventsSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [preSelectedEvent, setPreSelectedEvent] = useState<string | null>(null);

  const [sectionRef, isSectionVisible] = useIntersectionObserver({ threshold: 0, rootMargin: '200px' });

  const handleRegisterClick = (eventId: string) => {
    setPreSelectedEvent(eventId);
    setIsModalOpen(true);
  };


  const events = [
    {
      id: 'devxtreme',
      title: 'DevXtreme',
      date: 'March 7, 2026',
      time: '8 Hours',
      venue: 'PMEC ACADEMIC BLOCK - Main Auditorium',
      teamSize: 'Team of 3-5',
      image: ASSETS.DEVXTREME_POSTER,
      description: '8-hour hackathon working on real-world problem statements.',
      prize: '₹400 / ₹500',
      category: 'Inter-College',
      icon: <Rocket className="w-5 h-5 text-cyan-400" />
    },
    {
      id: 'designathon',
      title: 'Designathon',
      date: 'March 7, 2026',
      time: '11:00 AM',
      venue: 'PMEC ACADEMIC BLOCK - Design Studio',
      teamSize: 'Individual',
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=800&auto=format&fit=crop',
      description: 'UI/UX Design competition for creative designers.',
      prize: '₹60',
      category: 'Inter-College',
      icon: <Palette className="w-5 h-5 text-cyan-400" />
    },
    {
      id: 'techmaze',
      title: 'Tech Maze',
      date: 'March 6, 2026',
      time: '02:00 PM',
      venue: 'PMEC ACADEMIC BLOCK - Central Courtyard',
      teamSize: 'Team of 3',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop',
      description: 'Technical fun event with quizzes, puzzles, and rapid-fire challenges.',
      prize: '₹90',
      category: 'Inter-College',
      icon: <Puzzle className="w-5 h-5 text-cyan-400" />
    },
    {
      id: 'innovation-challenge',
      title: 'Innovation Challenge',
      date: 'March 6, 2026',
      time: '09:00 AM',
      venue: 'PMEC ACADEMIC BLOCK - Design Studio',
      teamSize: 'Team of 2',
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=800&auto=format&fit=crop',
      description: 'Non-coding ideation event. Pitch your ideas and showcase innovation.',
      prize: '₹60',
      category: 'Inter-College',
      icon: <Lightbulb className="w-5 h-5 text-cyan-400" />
    },
    {
      id: 'algo-to-code',
      title: 'Algo to Code',
      date: 'March 6, 2026',
      time: '10:00 AM',
      venue: 'PMEC ACADEMIC BLOCK - Lab Complex 1',
      teamSize: 'Individual',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop',
      description: 'Competitive programming contest testing algorithmic thinking and coding efficiency.',
      prize: '₹30',
      category: 'Inter-College',
      icon: <Code className="w-5 h-5 text-cyan-400" />
    }
  ];

  return (
    // Reduced py-24 to py-12 for mobile
    <section id="events" ref={sectionRef} className="relative min-h-screen py-12 md:py-24 overflow-hidden bg-black/40">

      <div className="container mx-auto px-4 sm:px-6 relative z-10">

        <div className={`text-center mb-10 md:mb-16 transition-all duration-1000 transform ${isSectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-900/20 backdrop-blur-sm text-blue-300 text-xs font-bold tracking-widest uppercase mb-6">
            <Target className="w-3 h-3" />
            Choose Your Path
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-400 drop-shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              Expeditions
            </span>
          </h2>
          <p className="font-body text-gray-400 max-w-2xl mx-auto text-lg">
            Four legendary events await the brave. Choose your mission and prove your worth.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">

          <div
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 transition-all duration-1000 delay-200 transform ${isSectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            {events.map((event) => (
              <div
                key={event.id}
                className={`group relative bg-black/40 border border-white/10 rounded-2xl overflow-hidden hover:border-cyan-500/50 transition-all duration-300 flex flex-col hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]`}
              >
                {/* Image Container */}
                <div className="relative h-48 sm:h-56 overflow-hidden bg-gray-900">
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
                  <img
                    src={event.image}
                    alt={event.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 z-20 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-2">
                    {event.icon}
                  </div>
                </div>

                {/* Content - Bottom */}
                <div className="p-4 md:p-5 flex flex-col justify-between flex-grow">
                  <div>
                    <h3 className="font-display text-lg md:text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-400 mb-3 md:mb-4 line-clamp-2">
                      {event.description}
                    </p>

                    <div className="space-y-1.5 mb-4">
                      <div className="flex items-center text-xs md:text-sm text-gray-300">
                        <Calendar className="w-3.5 h-3.5 mr-2 text-cyan-500 shrink-0" />
                        <span className="truncate">{event.date} • {event.time}</span>
                      </div>
                      <div className="flex items-center text-xs md:text-sm text-gray-300">
                        <Target className="w-3.5 h-3.5 mr-2 text-cyan-500 shrink-0" />
                        <span className="truncate">{event.venue}</span>
                      </div>
                      <div className="flex items-center text-xs md:text-sm text-gray-300">
                        <Users className="w-3.5 h-3.5 mr-2 text-cyan-500 shrink-0" />
                        {event.teamSize}
                      </div>
                      <div className="flex items-center text-xs md:text-sm text-gray-300">
                        <Trophy className="w-3.5 h-3.5 mr-2 text-yellow-500 shrink-0" />
                        Reg. Fee: <span className="text-yellow-400 font-bold ml-1">{event.prize}</span>
                        <span className="ml-auto text-[10px] font-bold text-cyan-500 uppercase tracking-wider bg-cyan-950/30 px-2 py-0.5 rounded border border-cyan-500/20">
                          {event.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRegisterClick(event.id)}
                    className="w-full py-2 md:py-2.5 rounded-lg bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/50 text-white text-sm md:text-base font-bold transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:scale-[1.02] active:scale-95 touch-manipulation"
                  >
                    Register Now
                    <Rocket className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
                  </button>
                </div>
              </div>
            ))}
          </div>
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