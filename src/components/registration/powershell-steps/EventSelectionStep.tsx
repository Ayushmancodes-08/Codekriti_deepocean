import { motion } from 'framer-motion';
import { EVENTS } from '@/types/registration';

interface EventSelectionStepProps {
    selectedEvent: string | null;
    squadSize: number;
    onSelect: (eventId: string, size: number) => void;
}

const EventSelectionStep = ({ selectedEvent, squadSize, onSelect }: EventSelectionStepProps) => {
    const getSquadOptions = (event: typeof EVENTS[number]) => {
        const options = [];
        for (let i = event.minTeamSize; i <= event.maxTeamSize; i++) {
            options.push(i);
        }
        return options;
    };

    return (
        <div className="space-y-6">
            <div className="text-[#00FF00] mb-4">
                <div className="mb-2">&gt; SELECT-EVENT -Mode Interactive</div>
                <div className="text-gray-400 text-sm">Choose your competition and squad size</div>
            </div>

            {/* Event Selection */}
            <div className="space-y-3">
                <label className="block text-white font-bold text-sm mb-2">
                    SELECT EVENT
                </label>
                <select
                    value={selectedEvent || ''}
                    onChange={(e) => {
                        const event = EVENTS.find((ev) => ev.id === e.target.value);
                        if (event) {
                            onSelect(e.target.value, event.minTeamSize);
                        }
                    }}
                    className="w-full bg-black border-2 border-[#0178D4] text-[#00FF00] px-4 py-3 rounded focus:outline-none focus:border-[#00FF00] font-mono"
                >
                    <option value="" className="bg-black">
                        -- Choose Event --
                    </option>
                    {EVENTS.map((event) => (
                        <option key={event.id} value={event.id} className="bg-black">
                            {event.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Squad Size Selection */}
            {selectedEvent && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3"
                >
                    <label className="block text-white font-bold text-sm mb-2">
                        SQUAD SIZE
                    </label>
                    <select
                        value={squadSize}
                        onChange={(e) => onSelect(selectedEvent, parseInt(e.target.value))}
                        className="w-full bg-black border-2 border-[#0178D4] text-[#00FF00] px-4 py-3 rounded focus:outline-none focus:border-[#00FF00] font-mono"
                    >
                        {getSquadOptions(EVENTS.find((e) => e.id === selectedEvent)!).map((size) => (
                            <option key={size} value={size} className="bg-black">
                                {size} {size === 1 ? 'Player' : 'Players'}
                            </option>
                        ))}
                    </select>
                </motion.div>
            )}

            {/* Event Details */}
            {selectedEvent && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-6 p-4 bg-black/50 border border-[#0178D4]/50 rounded"
                >
                    <div className="text-[#00FF00] text-sm space-y-1">
                        <div>&gt; Event Selected:</div>
                        <div className="text-white ml-4">
                            {EVENTS.find((e) => e.id === selectedEvent)?.name}
                        </div>
                        <div className="text-gray-400 ml-4 text-xs">
                            {EVENTS.find((e) => e.id === selectedEvent)?.description}
                        </div>
                        <div className="mt-2">&gt; Squad Configuration:</div>
                        <div className="text-white ml-4">
                            {squadSize} {squadSize === 1 ? 'Solo Participant' : 'Team Members'}
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default EventSelectionStep;
