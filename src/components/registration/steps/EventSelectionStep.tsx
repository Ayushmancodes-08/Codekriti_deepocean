import { useFormContext } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Code, Lightbulb, Gamepad2, Check } from 'lucide-react';
import type { RegistrationFormData } from '@/types/legacy-registration';

const EVENTS = [
    {
        id: 'algotocode',
        title: 'Algo-to-Code',
        description: 'Competitive programming challenge',
        category: 'technical' as const,
        icon: Code,
        maxTeamSize: 1,
    },
    {
        id: 'webcraft',
        title: 'WebCraft Showdown',
        description: '48-hour web development hackathon',
        category: 'technical' as const,
        icon: Code,
        maxTeamSize: 4,
    },
    {
        id: 'designthon',
        title: 'UI/UX Designathon',
        description: 'Design beautiful user experiences',
        category: 'creative' as const,
        icon: Lightbulb,
        maxTeamSize: 3,
    },
    {
        id: 'codequest',
        title: 'Code Quest',
        description: 'Treasure hunt with coding challenges',
        category: 'technical' as const,
        icon: Code,
        maxTeamSize: 2,
    },
    {
        id: 'gaming',
        title: 'Gaming Tournament',
        description: 'Esports competition',
        category: 'gaming' as const,
        icon: Gamepad2,
        maxTeamSize: 5,
    },
];

const EventSelectionStep = () => {
    const { watch, setValue, formState: { errors } } = useFormContext<RegistrationFormData>();
    const selectedEvents = watch('selectedEvents') || [];

    const toggleEvent = (eventId: string) => {
        const isSelected = selectedEvents.includes(eventId);

        if (isSelected) {
            setValue('selectedEvents', selectedEvents.filter((id) => id !== eventId));
        } else {
            if (selectedEvents.length < 3) {
                setValue('selectedEvents', [...selectedEvents, eventId]);
            }
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="mb-8">
                <h3 className="text-2xl font-bold text-cyan-300 mb-2">Event Selection</h3>
                <p className="text-cyan-400/70">Choose up to 3 events to participate in</p>
                {errors.selectedEvents && (
                    <p className="text-red-400 text-sm mt-2">{errors.selectedEvents.message}</p>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {EVENTS.map((event) => {
                    const isSelected = selectedEvents.includes(event.id);
                    const Icon = event.icon;

                    return (
                        <motion.button
                            key={event.id}
                            type="button"
                            onClick={() => toggleEvent(event.id)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`relative p-6 rounded-xl border-2 transition-all text-left ${isSelected
                                ? 'bg-cyan-500/20 border-cyan-400 shadow-lg shadow-cyan-500/20'
                                : 'bg-cyan-950/20 border-cyan-700/30 hover:border-cyan-600/50'
                                }`}
                        >
                            {/* Selection Checkmark */}
                            {isSelected && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute top-3 right-3 w-6 h-6 bg-cyan-400 rounded-full flex items-center justify-center"
                                >
                                    <Check className="w-4 h-4 text-cyan-950" />
                                </motion.div>
                            )}

                            <div className="flex items-start gap-4">
                                <div className={`p-3 rounded-lg ${isSelected ? 'bg-cyan-400/20' : 'bg-cyan-500/10'
                                    }`}>
                                    <Icon className={`w-6 h-6 ${isSelected ? 'text-cyan-300' : 'text-cyan-500'
                                        }`} />
                                </div>

                                <div className="flex-1">
                                    <h4 className={`font-bold mb-1 ${isSelected ? 'text-cyan-200' : 'text-cyan-300'
                                        }`}>
                                        {event.title}
                                    </h4>
                                    <p className="text-cyan-400/70 text-sm mb-2">{event.description}</p>
                                    <div className="flex items-center gap-2 text-xs text-cyan-500">
                                        <span className="px-2 py-1 bg-cyan-500/10 rounded">
                                            Team: {event.maxTeamSize === 1 ? 'Solo' : `Max ${event.maxTeamSize}`}
                                        </span>
                                        <span className="px-2 py-1 bg-cyan-500/10 rounded capitalize">
                                            {event.category}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.button>
                    );
                })}
            </div>

            <div className="mt-4 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                <p className="text-cyan-300 text-sm">
                    <strong>Selected:</strong> {selectedEvents.length} / 3 events
                </p>
            </div>
        </motion.div>
    );
};

export default EventSelectionStep;
