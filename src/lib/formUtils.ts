import {
  SingleParticipantRegistration,
  TeamRegistration,
  RegistrationData,
  EventType,
  eventConfigs,
} from './schemas';

/**
 * Check if registration data is for a single participant
 */
export function isSingleParticipantRegistration(
  data: RegistrationData
): data is SingleParticipantRegistration {
  return 'participant' in data && !('team' in data);
}

/**
 * Check if registration data is for a team
 */
export function isTeamRegistration(data: RegistrationData): data is TeamRegistration {
  return 'team' in data && 'members' in data;
}

/**
 * Get event type from registration data
 */
export function getEventType(data: RegistrationData): EventType {
  return data.eventType;
}

/**
 * Get event configuration
 */
export function getEventConfig(eventType: EventType) {
  return eventConfigs[eventType];
}

/**
 * Check if event is single participant type
 */
export function isSingleParticipantEvent(eventType: EventType): boolean {
  return eventConfigs[eventType].type === 'single';
}

/**
 * Check if event is team type
 */
export function isTeamEvent(eventType: EventType): boolean {
  return eventConfigs[eventType].type === 'team';
}

/**
 * Validate team size against event limits
 */
export function validateTeamSize(eventType: EventType, memberCount: number): boolean {
  const config = eventConfigs[eventType];
  return memberCount >= config.minParticipants && memberCount <= config.maxParticipants;
}

/**
 * Get team size limits for an event
 */
export function getTeamSizeLimits(eventType: EventType) {
  const config = eventConfigs[eventType];
  return {
    min: config.minParticipants,
    max: config.maxParticipants,
  };
}

/**
 * Generate confirmation ID
 */
export function generateConfirmationId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${timestamp}-${random}`;
}

/**
 * Serialize registration data to JSON
 */
export function serializeRegistration(data: RegistrationData): string {
  return JSON.stringify(data);
}

/**
 * Deserialize registration data from JSON
 */
export function deserializeRegistration(json: string): RegistrationData {
  return JSON.parse(json);
}

/**
 * Store registration data in local storage
 */
export function storeRegistrationData(key: string, data: RegistrationData): void {
  try {
    localStorage.setItem(key, serializeRegistration(data));
  } catch (error) {
    console.error('Failed to store registration data:', error);
  }
}

/**
 * Retrieve registration data from local storage
 */
export function retrieveRegistrationData(key: string): RegistrationData | null {
  try {
    const json = localStorage.getItem(key);
    if (!json) return null;
    return deserializeRegistration(json);
  } catch (error) {
    console.error('Failed to retrieve registration data:', error);
    return null;
  }
}

/**
 * Clear registration data from local storage
 */
export function clearRegistrationData(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Failed to clear registration data:', error);
  }
}

/**
 * Get participant name from registration data
 */
export function getParticipantName(data: RegistrationData): string {
  if (isSingleParticipantRegistration(data)) {
    return data.participant.name;
  }
  return data.team.leader.name;
}

/**
 * Get participant email from registration data
 */
export function getParticipantEmail(data: RegistrationData): string {
  if (isSingleParticipantRegistration(data)) {
    return data.participant.email;
  }
  return data.team.leader.email;
}

/**
 * Get participant phone from registration data
 */
export function getParticipantPhone(data: RegistrationData): string {
  if (isSingleParticipantRegistration(data)) {
    return data.participant.phoneNumber;
  }
  return data.team.leader.phoneNumber;
}
