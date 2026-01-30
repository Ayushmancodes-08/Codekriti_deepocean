import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { eventConfigs, EventType } from '../lib/schemas';

/**
 * EventSelection Component
 * 
 * Displays event cards with descriptions, participant type, and limits.
 * Allows users to select an event and provides visual feedback for selection.
 * 
 * Requirements: 7.1, 7.2, 7.3, 7.4, 7.5
 */

interface EventSelectionProps {
  onEventSelect: (event: EventType) => void;
  onClose?: () => void;
  selectedEvent?: EventType | null;
  showCloseButton?: boolean;
  title?: string;
  className?: string;
}

const EventSelection = ({
  onEventSelect,
  onClose,
  selectedEvent = null,
  showCloseButton = true,
  title = 'Select Event',
  className = '',
}: EventSelectionProps) => {
  const events: EventType[] = ['algo-to-code', 'designathon', 'techmaze', 'dev-xtreme'];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className={`flex flex-col items-center justify-center ${className}`}
    >
      <section className="bg-black/80 backdrop-blur-md rounded-2xl p-8 max-w-2xl w-full mx-4 border border-primary/30">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 id="event-selection-title" className="text-3xl font-bold text-white font-display">{title}</h2>
          {showCloseButton && onClose && (
            <button
              onClick={onClose}
              className="p-2.5 md:p-2 hover:bg-white/10 active:bg-white/20 rounded-lg transition-colors min-h-11 min-w-11 md:min-h-9 md:min-w-9 flex items-center justify-center touch-manipulation focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label="Close event selection"
            >
              <X size={24} className="text-white" />
            </button>
          )}
        </div>

        {/* Event Cards Grid */}
        <fieldset className="border-0 p-0 m-0">
          <legend className="sr-only">Available events for registration</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.map((eventType) => {
              const config = eventConfigs[eventType];
              const isSelected = selectedEvent === eventType;

              return (
                <motion.button
                  key={eventType}
                  onClick={() => onEventSelect(eventType)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-4 md:p-4 rounded-lg transition-all text-left group min-h-24 md:min-h-auto touch-manipulation focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                    isSelected
                      ? 'bg-gradient-to-br from-primary to-accent border border-primary shadow-lg shadow-primary/50'
                      : 'bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/50 hover:border-primary active:border-primary hover:from-primary/30 hover:to-accent/30 active:from-primary/30 active:to-accent/30'
                  }`}
                  aria-pressed={isSelected}
                  aria-label={`Select ${config.name} event - ${config.description}`}
                  aria-describedby={`event-${eventType}-details`}
                >
                  {/* Event Name */}
                  <h3
                    className={`text-lg font-bold transition-colors ${
                      isSelected ? 'text-white' : 'text-white group-hover:text-primary'
                    }`}
                  >
                    {config.name}
                  </h3>

                  {/* Event Description */}
                  <p
                    id={`event-${eventType}-details`}
                    className={`text-sm mt-1 transition-colors ${
                      isSelected ? 'text-white/90' : 'text-white/70'
                    }`}
                  >
                    {config.description}
                  </p>

                  {/* Participant Type and Limits */}
                  <p
                    className={`text-xs mt-2 transition-colors ${
                      isSelected ? 'text-white/80' : 'text-accent'
                    }`}
                  >
                    {config.type === 'single' ? (
                      <span>Individual Event</span>
                    ) : (
                      <span>
                        Team Event • {config.minParticipants}-{config.maxParticipants} members
                      </span>
                    )}
                  </p>

                  {/* Selection Indicator */}
                  {isSelected && (
                    <motion.div
                      layoutId="eventSelection"
                      className="absolute inset-0 rounded-lg border-2 border-accent pointer-events-none"
                      initial={false}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </fieldset>

        {/* Helper Text */}
        <p className="text-xs text-white/50 mt-6 text-center">
          Select an event to proceed with registration
        </p>
      </section>
    </motion.div>
  );
};

export default EventSelection;
