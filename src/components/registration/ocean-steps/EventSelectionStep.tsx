import { motion } from 'framer-motion';
import { EVENTS } from '@/types/registration';
import { Zap, Code, Lightbulb, Puzzle } from 'lucide-react';

interface EventSelectionStepProps {
    selectedEvent: string | null;
    squadSize: number;
    onSelect: (eventId: string, size: number) => void;
}

const EVENT_ICONS = {
    'algo-to-code': Code,
    'innovation-challenge': Lightbulb,
    'techmaze': Puzzle,
    'devxtreme': Zap,
};

const EventSelectionStep = ({ selectedEvent, squadSize, onSelect }: EventSelectionStepProps) => {
    const getSquadOptions = (event: typeof EVENTS[number]) => {
        const options = [];
        for (let i = event.minTeamSize; i <= event.maxTeamSize; i++) {
            options.push(i);
        }
        return options;
    };

    const selectedEventData = EVENTS.find((e) => e.id === selectedEvent);

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h3 className="text-3xl font-bold bg-gradient-to-r from-[#00D9FF] to-[#FF6B35] bg-clip-text text-transparent mb-3">
                    Choose Your Challenge
                </h3>
                <p className="text-gray-400">Select an event and configure your squad</p>
            </div>

            {/* Event Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {EVENTS.map((event) => {
                    const Icon = EVENT_ICONS[event.id as keyof typeof EVENT_ICONS];
                    const isSelected = selectedEvent === event.id;

                    return (
                        <motion.button
                            key={event.id}
                            type="button"
                            onClick={() => onSelect(event.id, event.minTeamSize)}
                            className={`relative p-6 rounded-xl text-left transition-all ${isSelected
                                ? 'bg-[#00D9FF]/10 border-2 border-[#00D9FF]/50 shadow-lg shadow-[#00D9FF]/5'
                                : 'bg-[#0a192f]/50 border-2 border-[#00D9FF]/10 hover:border-[#00D9FF]/30'
                                }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {isSelected && (
                                <motion.div
                                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-r from-[#00D9FF] to-blue-500 flex items-center justify-center"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                >
                                    <div className="w-3 h-3 bg-white rounded-full" />
                                </motion.div>
                            )}

                            <div className="flex items-start gap-4">
                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${isSelected
                                    ? 'bg-[#00D9FF]/20 text-[#00D9FF]'
                                    : 'bg-[#00D9FF]/10'
                                    }`}>
                                    <Icon className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-[#00D9FF]'}`} />
                                </div>

                                <div className="flex-1">
                                    <h4 className={`text-lg font-bold mb-2 ${isSelected ? 'text-[#00D9FF]' : 'text-white'
                                        }`}>
                                        {event.name}
                                    </h4>
                                    <p className="text-gray-400 text-sm mb-3">
                                        {event.description}
                                    </p>
                                    <div className="flex items-center gap-2 text-xs">
                                        <span className={`px-3 py-1 rounded-full ${isSelected ? 'bg-[#00D9FF]/20 text-[#00D9FF]' : 'bg-gray-700 text-gray-400'
                                            }`}>
                                            {event.minTeamSize === event.maxTeamSize
                                                ? `${event.minTeamSize} ${event.minTeamSize === 1 ? 'player' : 'players'}`
                                                : `${event.minTeamSize}-${event.maxTeamSize} players`}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.button>
                    );
                })}
            </div>

            {/* Squad Size Selector */}
            {selectedEvent && selectedEventData && selectedEventData.minTeamSize !== selectedEventData.maxTeamSize && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 bg-[#0a192f]/50 border border-[#00D9FF]/20 rounded-xl"
                >
                    <label className="block text-white font-bold mb-4">Squad Size</label>
                    <div className="grid grid-cols-4 gap-3">
                        {getSquadOptions(selectedEventData).map((size) => (
                            <button
                                key={size}
                                type="button"
                                onClick={() => onSelect(selectedEvent, size)}
                                className={`py-3 rounded-lg font-bold transition-all ${squadSize === size
                                    ? 'bg-[#00D9FF]/20 text-[#00D9FF] border border-[#00D9FF]/50 shadow-sm'
                                    : 'bg-[#0a192f] text-gray-400 hover:bg-[#00D9FF]/10 border border-[#00D9FF]/20'
                                    }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                    <p className="text-gray-400 text-sm mt-3 text-center">
                        Select your team size ({selectedEventData.minTeamSize}-{selectedEventData.maxTeamSize} members)
                    </p>
                </motion.div>
            )}

            {/* Summary */}
            {selectedEvent && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 bg-gradient-to-r from-[#00D9FF]/10 to-blue-500/10 border border-[#00D9FF]/30 rounded-xl"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[#00D9FF] font-bold">{selectedEventData?.name}</p>
                            <p className="text-gray-400 text-sm">
                                {squadSize} {squadSize === 1 ? 'Solo Participant' : 'Team Members'}
                            </p>
                        </div>
                        <div className="w-2 h-2 bg-[#00D9FF] rounded-full animate-pulse" />
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default EventSelectionStep;
