import { motion } from 'framer-motion';
import { EVENTS } from '@/types/registration';
import { Zap, Code, Lightbulb, Puzzle, Palette } from 'lucide-react';

interface EventSelectionStepProps {
    selectedEvent: string | null;
    squadSize: number;
    onSelect: (eventId: string, size: number) => void;
}

const EVENT_ICONS = {
    'algo-to-code': Code,
    'designathon': Palette,
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
                <h3 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-3">
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
                                ? 'bg-[#00D9FF]/10 border-2 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                                : 'bg-[#0a192f]/50 border border-gray-700 hover:border-cyan-500/30 hover:bg-[#0a192f]/80'
                                }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {isSelected && (
                                <motion.div
                                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                >
                                    <div className="w-2 h-2 bg-white rounded-full" />
                                </motion.div>
                            )}

                            <div className="flex items-start gap-4">
                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${isSelected
                                    ? 'bg-cyan-500/20 text-cyan-400'
                                    : 'bg-gray-800/50 text-gray-500 group-hover:text-cyan-400'
                                    }`}>
                                    <Icon className={`w-6 h-6 ${isSelected ? 'text-cyan-300' : 'text-current'}`} />
                                </div>

                                <div className="flex-1">
                                    <h4 className={`text-lg font-bold mb-2 transition-colors ${isSelected ? 'text-cyan-400' : 'text-white'
                                        }`}>
                                        {event.name}
                                    </h4>
                                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                                        {event.description}
                                    </p>
                                    <div className="flex items-center gap-2 text-xs">
                                        <span className={`px-3 py-1 rounded-full border transition-colors ${isSelected
                                            ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                                            : 'bg-gray-800 text-gray-400 border-gray-700'
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
            {selectedEventData && selectedEventData.minTeamSize !== selectedEventData.maxTeamSize && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 bg-[#112240] border border-gray-700 rounded-xl space-y-4"
                >
                    <div className="flex items-center justify-between">
                        <label className="block text-white font-semibold">Select Squad Size</label>
                        <span className="text-xs text-cyan-400 bg-cyan-900/30 px-2 py-1 rounded border border-cyan-500/30">
                            Allowed: {selectedEventData.minTeamSize}-{selectedEventData.maxTeamSize}
                        </span>
                    </div>

                    <div className="grid grid-cols-5 gap-3">
                        {getSquadOptions(selectedEventData).map((size) => (
                            <button
                                key={size}
                                type="button"
                                onClick={() => onSelect(selectedEventData.id, size)}
                                className={`py-3 rounded-lg font-bold transition-all relative overflow-hidden ${squadSize === size
                                    ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                                    : 'bg-[#0a192f] text-gray-400 hover:text-white hover:bg-[#1e293b] border border-gray-700'
                                    }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Summary */}
            {selectedEventData && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-xl"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-cyan-400 font-bold mb-0.5">{selectedEventData.name}</p>
                            <p className="text-gray-400 text-xs">
                                {squadSize} {squadSize === 1 ? 'Solo Participant' : 'Team Members'}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-cyan-600 bg-cyan-900/10 px-2 py-1 rounded">ID: {selectedEventData.id}</span>
                            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default EventSelectionStep;
