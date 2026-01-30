import { z } from 'zod';

// Event configuration
export const EVENTS = [
    {
        id: 'algo-to-code',
        name: 'Algo to Code',
        minTeamSize: 1,
        maxTeamSize: 1,
        description: 'Competitive programming challenge',
    },
    {
        id: 'designathon',
        name: 'Designathon',
        minTeamSize: 1,
        maxTeamSize: 1,
        description: 'UI/UX design competition',
    },
    {
        id: 'techmaze',
        name: 'TechMaze',
        minTeamSize: 3,
        maxTeamSize: 4,
        description: 'Technical treasure hunt',
    },
    {
        id: 'devxtreme-hackathon',
        name: 'DevXtreme Hackathon',
        minTeamSize: 3,
        maxTeamSize: 6,
        description: '48-hour coding marathon',
    },
] as const;

export type EventId = typeof EVENTS[number]['id'];

// Branch options
export const BRANCHES = [
    'Computer Science',
    'Information Technology',
    'Electronics & Communication',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Other',
] as const;

// Year of study
export const YEARS_OF_STUDY = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Other'] as const;

// Participant details schema
const participantSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().regex(/^\+?[\d\s-()]{10,}$/, 'Invalid phone number'),
    college: z.string().min(2, 'College name required'),
    branch: z.enum(BRANCHES, { errorMap: () => ({ message: 'Branch is required' }) }),
    yearOfStudy: z.enum(YEARS_OF_STUDY, { errorMap: () => ({ message: 'Year is required' }) }),
});

// Team member schema (same as participant but used in array)
const teamMemberSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().regex(/^\+?[\d\s-()]{10,}$/, 'Invalid phone number'),
    college: z.string().min(2, 'College name required'),
    branch: z.enum(BRANCHES, { errorMap: () => ({ message: 'Branch is required' }) }),
    yearOfStudy: z.enum(YEARS_OF_STUDY, { errorMap: () => ({ message: 'Year is required' }) }),
});

// Main registration schema
export const registrationSchema = z.discriminatedUnion('registrationType', [
    // Solo registration
    z.object({
        registrationType: z.literal('solo'),
        eventId: z.string(),
        squadSize: z.literal(1),
        participant: participantSchema,
        subscribe: z.boolean().optional(),
    }),
    // Team registration
    z.object({
        registrationType: z.literal('team'),
        eventId: z.string(),
        squadSize: z.number().min(2).max(6),
        teamName: z.string().min(2, 'Team name required').max(50, 'Team name too long'),
        teamLeader: participantSchema,
        teamMembers: z.array(teamMemberSchema).min(1, 'At least one team member required'),
        subscribe: z.boolean().optional(),
    }),
]);

export type RegistrationFormData = z.infer<typeof registrationSchema>;
export type ParticipantData = z.infer<typeof participantSchema>;
export type TeamMemberData = z.infer<typeof teamMemberSchema>;

// Step metadata for PowerShell interface
export interface RegistrationStep {
    step: number;
    command: string;
    description: string;
}

// Solo workflow steps
export const SOLO_STEPS: RegistrationStep[] = [
    { step: 1, command: 'SELECT-EVENT', description: 'Choose your competition' },
    { step: 2, command: 'ENTER-DETAILS', description: 'Participant information' },
    { step: 3, command: 'CONFIRM-REGISTRATION', description: 'Review and submit' },
];

// Team workflow steps
export const TEAM_STEPS: RegistrationStep[] = [
    { step: 1, command: 'SELECT-EVENT', description: 'Choose your competition' },
    { step: 2, command: 'SET-TEAMINFO', description: 'Team name and leader' },
    { step: 3, command: 'ADD-MEMBERS', description: 'Team members information' },
    { step: 4, command: 'CONFIRM-REGISTRATION', description: 'Review and submit' },
];
