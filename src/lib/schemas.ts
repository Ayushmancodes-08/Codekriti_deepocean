import { z } from 'zod';

// Event types
export const EventTypeSchema = z.enum([
  'algo-to-code',
  'designathon',
  'techmaze',
  'dev-xtreme',
]);

export type EventType = z.infer<typeof EventTypeSchema>;

// Event configuration
export const EventConfigSchema = z.object({
  name: z.string(),
  type: z.enum(['single', 'team']),
  minParticipants: z.number().int().positive(),
  maxParticipants: z.number().int().positive(),
  description: z.string(),
});

export type EventConfig = z.infer<typeof EventConfigSchema>;

export const eventConfigs: Record<EventType, EventConfig> = {
  'algo-to-code': {
    name: 'Algo-to-Code',
    type: 'single',
    minParticipants: 1,
    maxParticipants: 1,
    description: 'Individual coding competition',
  },
  'designathon': {
    name: 'Designathon',
    type: 'single',
    minParticipants: 1,
    maxParticipants: 1,
    description: 'Individual design competition',
  },
  'techmaze': {
    name: 'TechMaze',
    type: 'team',
    minParticipants: 1,
    maxParticipants: 3,
    description: 'Team-based tech challenge',
  },
  'dev-xtreme': {
    name: 'Dev Xtreme',
    type: 'team',
    minParticipants: 3,
    maxParticipants: 6,
    description: 'Team-based development competition',
  },
};

// Single participant schema
export const SingleParticipantSchema = z.object({
  name: z.string().min(1, 'Name is required').min(2, 'Name must be at least 2 characters'),
  college: z.string().min(1, 'College is required'),
  studentId: z.string().min(1, 'Student ID is required'),
  phoneNumber: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^[0-9]{10}$/, 'Phone number must be 10 digits'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  branch: z.string().min(1, 'Branch is required'),
  year: z.string().min(1, 'Year is required'),
});

export type SingleParticipant = z.infer<typeof SingleParticipantSchema>;

// Single participant registration
export const SingleParticipantRegistrationSchema = z.object({
  eventType: z.enum(['algo-to-code', 'designathon']),
  participant: SingleParticipantSchema,
});

export type SingleParticipantRegistration = z.infer<
  typeof SingleParticipantRegistrationSchema
>;

// Team member schema
export const TeamMemberSchema = z.object({
  name: z.string().min(1, 'Name is required').min(2, 'Name must be at least 2 characters'),
  college: z.string().min(1, 'College is required'),
  studentId: z.string().min(1, 'Student ID is required'),
  phoneNumber: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^[0-9]{10}$/, 'Phone number must be 10 digits'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  branch: z.string().min(1, 'Branch is required'),
  year: z.string().min(1, 'Year is required'),
});

export type TeamMember = z.infer<typeof TeamMemberSchema>;

// Team leader schema
export const TeamLeaderSchema = z.object({
  name: z.string().min(1, 'Name is required').min(2, 'Name must be at least 2 characters'),
  phoneNumber: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^[0-9]{10}$/, 'Phone number must be 10 digits'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
});

export type TeamLeader = z.infer<typeof TeamLeaderSchema>;

// Team details schema
export const TeamDetailsSchema = z.object({
  name: z.string().min(1, 'Team name is required').min(2, 'Team name must be at least 2 characters'),
  college: z.string().min(1, 'College is required'),
  leader: TeamLeaderSchema,
});

export type TeamDetails = z.infer<typeof TeamDetailsSchema>;

// Team registration schema
export const TeamRegistrationSchema = z.object({
  eventType: z.enum(['techmaze', 'dev-xtreme']),
  team: TeamDetailsSchema,
  members: z.array(TeamMemberSchema),
});

export type TeamRegistration = z.infer<typeof TeamRegistrationSchema>;

// Combined registration type
export type RegistrationData = SingleParticipantRegistration | TeamRegistration;

// Form state schema
export const RegistrationFormStateSchema = z.object({
  currentStep: z.enum(['event-selection', 'details', 'members', 'confirmation']),
  selectedEvent: EventTypeSchema.nullable(),
  formData: z.record(z.any()).optional(),
  errors: z.record(z.string()).optional(),
  isSubmitting: z.boolean().default(false),
  isComplete: z.boolean().default(false),
});

export type RegistrationFormState = z.infer<typeof RegistrationFormStateSchema>;
