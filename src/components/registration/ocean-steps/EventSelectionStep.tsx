import { motion } from 'framer-motion';
import { EVENTS } from '@/types/registration';
import { Zap, Code, Lightbulb, Puzzle, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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
                            className={cn(
                                "relative p-6 rounded-xl text-left transition-all group overflow-hidden",
                                isSelected
                                    ? "bg-[#00D9FF]/10 border-2 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                                    : "bg-[#0a192f]/50 border border-gray-700 hover:border-cyan-500/30 hover:bg-[#0a192f]/80"
                            )}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {/* Glow effect on hover/select */}
                            <div className={cn(
                                "absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent transition-opacity duration-300 opacity-0 group-hover:opacity-100",
                                isSelected && "opacity-100"
                            )} />

                            {isSelected && (
                                <motion.div
                                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg z-10"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                >
                                    <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                                </motion.div>
                            )}

                            <div className="flex items-start gap-4 relative z-10">
                                <div className={cn(
                                    "w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300",
                                    isSelected
                                        ? "bg-cyan-500/20 text-cyan-400 scale-110 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                                        : "bg-gray-800/50 text-gray-500 group-hover:text-cyan-400 group-hover:bg-cyan-500/10"
                                )}>
                                    <Icon className={cn("w-6 h-6 transition-transform duration-300", isSelected ? "text-cyan-300 scale-110" : "text-current")} />
                                </div>

                                <div className="flex-1">
                                    <h4 className={cn(
                                        "text-lg font-bold mb-2 transition-colors",
                                        isSelected ? "text-cyan-400" : "text-white group-hover:text-cyan-100"
                                    )}>
                                        {event.name}
                                    </h4>
                                    <p className="text-gray-400 text-sm mb-3 line-clamp-2 leading-relaxed">
                                        {event.description}
                                    </p>
                                    <div className="flex items-center gap-2 text-xs">
                                        <span className={cn(
                                            "px-3 py-1 rounded-full border transition-all duration-300",
                                            isSelected
                                                ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-semibold"
                                                : "bg-gray-800/50 text-gray-400 border-gray-700/50"
                                        )}>
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
                    className="p-6 bg-[#0a192f]/60 border border-cyan-500/20 rounded-xl space-y-5 relative overflow-hidden backdrop-blur-sm"
                >
                    <div className="flex items-center justify-between relative z-10">
                        <label className="text-white font-bold tracking-wide uppercase text-sm">Select Squad Size</label>
                        <span className="text-[10px] font-bold text-cyan-400 bg-cyan-950/50 px-3 py-1 rounded-full border border-cyan-500/30 uppercase tracking-widest">
                            Range: {selectedEventData.minTeamSize}-{selectedEventData.maxTeamSize}
                        </span>
                    </div>

                    <div className="grid grid-cols-5 gap-3 relative z-10">
                        {getSquadOptions(selectedEventData).map((size) => (
                            <Button
                                key={size}
                                type="button"
                                variant={squadSize === size ? "default" : "outline"}
                                onClick={() => onSelect(selectedEventData.id, size)}
                                className={cn(
                                    "h-12 font-black transition-all duration-300 rounded-lg border-2",
                                    squadSize === size
                                        ? "bg-gradient-to-br from-cyan-500 to-blue-600 border-transparent text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] scale-105"
                                        : "bg-[#0a192f]/80 border-cyan-500/20 text-gray-400 hover:text-cyan-300 hover:border-cyan-500/50 hover:bg-cyan-500/5"
                                )}
                            >
                                {size}
                            </Button>
                        ))}
                    </div>

                    {/* Background Decorative Element */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                </motion.div>
            )}

            {/* Summary */}
            {selectedEventData && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-5 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-transparent border border-cyan-500/30 rounded-xl relative overflow-hidden group"
                >
                    <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="w-1.5 h-10 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full" />
                            <div>
                                <p className="text-cyan-400 font-black uppercase text-sm tracking-widest mb-0.5">{selectedEventData.name}</p>
                                <p className="text-gray-400 text-xs font-medium">
                                    {squadSize} {squadSize === 1 ? 'Solo Participant' : 'Team Members'}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <span className="text-[10px] font-mono text-cyan-400/60 bg-cyan-950/20 px-2 py-0.5 rounded border border-cyan-400/10">MISSION_{selectedEventData.id.toUpperCase()}</span>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] text-cyan-500 font-bold tracking-widest uppercase animate-pulse">Ready</span>
                                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default EventSelectionStep;
