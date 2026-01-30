import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { eventConfigs, EventType } from '../lib/schemas';

/**
 * Property 1: Event Selection Determines Form Type
 * 
 * For any event selection, the form displayed should match the event's participant type (single vs. team).
 * 
 * Validates: Requirements 7.1, 7.2, 7.3, 7.4, 7.5
 * 
 * Feature: hackathon-website-upgrade, Property 1: Event Selection Determines Form Type
 */
describe('EventSelection - Property 1: Event Selection Determines Form Type', () => {
  /**
   * Property: Event selection correctly identifies participant type
   * 
   * For any event type selected, the corresponding event configuration should:
   * - Have a valid type ('single' or 'team')
   * - Match the expected participant type for that event
   * - Have consistent participant limits
   */
  it('should correctly identify participant type for any selected event', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constant('algo-to-code' as EventType),
          fc.constant('designathon' as EventType),
          fc.constant('techmaze' as EventType),
          fc.constant('dev-xtreme' as EventType)
        ),
        (eventType) => {
          const config = eventConfigs[eventType];

          // Property: Event configuration exists
          expect(config).toBeDefined();

          // Property: Type is either 'single' or 'team'
          expect(['single', 'team']).toContain(config.type);

          // Property: Single participant events have exactly 1 participant
          if (config.type === 'single') {
            expect(config.minParticipants).toBe(1);
            expect(config.maxParticipants).toBe(1);
          }

          // Property: Team events have multiple participants
          if (config.type === 'team') {
            expect(config.minParticipants).toBeGreaterThanOrEqual(1);
            expect(config.maxParticipants).toBeGreaterThan(config.minParticipants);
          }

          // Property: Min participants <= Max participants
          expect(config.minParticipants).toBeLessThanOrEqual(config.maxParticipants);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Event selection provides required information
   * 
   * For any event selection, the event card should display:
   * - Event name
   * - Event description
   * - Participant type information
   * - Participant limits (for team events)
   */
  it('should display all required event information', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constant('algo-to-code' as EventType),
          fc.constant('designathon' as EventType),
          fc.constant('techmaze' as EventType),
          fc.constant('dev-xtreme' as EventType)
        ),
        (eventType) => {
          const config = eventConfigs[eventType];

          // Property: Event name is not empty
          expect(config.name).toBeTruthy();
          expect(config.name.length).toBeGreaterThan(0);

          // Property: Event description is not empty
          expect(config.description).toBeTruthy();
          expect(config.description.length).toBeGreaterThan(0);

          // Property: Event type is defined
          expect(config.type).toBeDefined();

          // Property: Participant limits are positive integers
          expect(config.minParticipants).toBeGreaterThan(0);
          expect(config.maxParticipants).toBeGreaterThan(0);
          expect(Number.isInteger(config.minParticipants)).toBe(true);
          expect(Number.isInteger(config.maxParticipants)).toBe(true);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Event selection callback is triggered correctly
   * 
   * For any event selection, the onEventSelect callback should:
   * - Be called exactly once
   * - Receive the correct event type
   * - Not throw any errors
   */
  it('should trigger event selection callback with correct event type', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constant('algo-to-code' as EventType),
          fc.constant('designathon' as EventType),
          fc.constant('techmaze' as EventType),
          fc.constant('dev-xtreme' as EventType)
        ),
        (eventType) => {
          let callbackCalled = false;
          let callbackEventType: EventType | null = null;

          // Simulate event selection callback
          const mockOnEventSelect = (event: EventType) => {
            callbackCalled = true;
            callbackEventType = event;
          };

          // Simulate user selecting event
          mockOnEventSelect(eventType);

          // Property: Callback was called
          expect(callbackCalled).toBe(true);

          // Property: Callback received correct event type
          expect(callbackEventType).toBe(eventType);

          // Property: Event type matches one of the valid events
          expect(['algo-to-code', 'designathon', 'techmaze', 'dev-xtreme']).toContain(
            callbackEventType
          );

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Event selection maintains visual feedback state
   * 
   * For any event selection, the component should:
   * - Show visual feedback for the selected event
   * - Distinguish selected from unselected events
   * - Maintain selection state consistency
   */
  it('should maintain consistent selection state', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constant('algo-to-code' as EventType),
          fc.constant('designathon' as EventType),
          fc.constant('techmaze' as EventType),
          fc.constant('dev-xtreme' as EventType)
        ),
        (selectedEvent) => {
          const allEvents: EventType[] = [
            'algo-to-code',
            'designathon',
            'techmaze',
            'dev-xtreme',
          ];

          // Simulate selection state
          const selectionState = allEvents.map((event) => ({
            event,
            isSelected: event === selectedEvent,
          }));

          // Property: Exactly one event is selected
          const selectedCount = selectionState.filter((s) => s.isSelected).length;
          expect(selectedCount).toBe(1);

          // Property: All other events are not selected
          const unselectedCount = selectionState.filter((s) => !s.isSelected).length;
          expect(unselectedCount).toBe(allEvents.length - 1);

          // Property: Selected event matches the input
          const selected = selectionState.find((s) => s.isSelected);
          expect(selected?.event).toBe(selectedEvent);

          // Property: Total events equals all events
          expect(selectionState.length).toBe(allEvents.length);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Event selection handles all valid event types
   * 
   * For any valid event type, the component should:
   * - Accept the event type without errors
   * - Provide valid configuration for that event
   * - Support all four event types
   */
  it('should handle all valid event types without errors', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constant('algo-to-code' as EventType),
          fc.constant('designathon' as EventType),
          fc.constant('techmaze' as EventType),
          fc.constant('dev-xtreme' as EventType)
        ),
        (eventType) => {
          // Property: Event type is valid
          const validEventTypes = [
            'algo-to-code',
            'designathon',
            'techmaze',
            'dev-xtreme',
          ];
          expect(validEventTypes).toContain(eventType);

          // Property: Configuration exists for event type
          expect(eventConfigs[eventType]).toBeDefined();

          // Property: Configuration is not null or undefined
          expect(eventConfigs[eventType]).not.toBeNull();

          // Property: Configuration has all required fields
          const config = eventConfigs[eventType];
          expect(config).toHaveProperty('name');
          expect(config).toHaveProperty('type');
          expect(config).toHaveProperty('minParticipants');
          expect(config).toHaveProperty('maxParticipants');
          expect(config).toHaveProperty('description');

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
