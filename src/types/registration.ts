import { z } from 'zod';

// Event configuration
// Event configuration
export const EVENTS = [
    {
        id: 'algo-to-code',
        name: 'Algo to Code',
        minTeamSize: 1,
        maxTeamSize: 1,
        description: 'Competitive programming challenge',
        entryFee: '₹30',
        category: 'Intra-College',
    },
    {
        id: 'innovation-challenge',
        name: 'Innovation Challenge',
        minTeamSize: 2,
        maxTeamSize: 3,
        description: 'Idea Pitch & Innovation',
        entryFee: '₹60',
        category: 'Intra-College',
    },
    {
        id: 'techmaze',
        name: 'Tech Maze',
        minTeamSize: 2,
        maxTeamSize: 3,
        description: 'Fun Technical Event',
        entryFee: '₹90',
        category: 'Intra-College',
    },
    {
        id: 'devxtreme',
        name: 'DevXtreme',
        minTeamSize: 3,
        maxTeamSize: 5,
        description: 'Overnight Hackathon',
        entryFee: '₹400 (PMEC) / ₹500 (Outside)',
        category: 'Inter-College',
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
    phone: z.string().regex(/^(\+91\s\d{5}\s\d{5}|\d{5}\s\d{5}|\d{10}|\+91\d{10})$/, 'Invalid phone number'),
    college: z.string().min(2, 'College name required'),
    branch: z.enum(BRANCHES, { errorMap: () => ({ message: 'Branch is required' }) }),
    yearOfStudy: z.enum(YEARS_OF_STUDY, { errorMap: () => ({ message: 'Year is required' }) }),
});

// Team member schema (same as participant but used in array)
const teamMemberSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().regex(/^(\+91\s\d{5}\s\d{5}|\d{5}\s\d{5}|\d{10}|\+91\d{10})$/, 'Invalid phone number'),
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
        transactionId: z.string({ required_error: "Transaction ID is required" }).min(1, "Transaction ID is required"),
        screenshotUrl: z.string().optional(),
    }),
    // Team registration
    z.object({
        registrationType: z.literal('team'),
        eventId: z.string(),
        squadSize: z.number().min(2).max(5),
        teamName: z.string().min(2, 'Team name required').max(50, 'Team name too long'),
        teamLeader: participantSchema,
        teamMembers: z.array(teamMemberSchema).min(1, 'At least one team member required'),
        subscribe: z.boolean().optional(),
        transactionId: z.string({ required_error: "Transaction ID is required" }).min(1, "Transaction ID is required"),
        screenshotUrl: z.string().optional(),
        problemStatement: z.string().optional(),
        solution: z.string().optional(),
    }),
]).superRefine((data, ctx) => {
    if (data.registrationType === 'team' && data.eventId === 'devxtreme') {
        if (!data.problemStatement || data.problemStatement.length < 10) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Problem Statement is required and must be detailed",
                path: ["problemStatement"]
            });
        }
        if (!data.solution || data.solution.length < 10) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Solution description is required and must be detailed",
                path: ["solution"]
            });
        }
    }
});

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
