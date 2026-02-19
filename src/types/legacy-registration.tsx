import { z } from 'zod';
import { User, GraduationCap, Calendar, Users, CheckSquare } from 'lucide-react';

export const REGISTRATION_STEPS = [
    {
        step: 1,
        title: 'Personal Info',
        description: 'Basic details',
        icon: <User />,
    },
    {
        step: 2,
        title: 'Academic Info',
        description: 'Education details',
        icon: <GraduationCap />,
    },
    {
        step: 3,
        title: 'Events',
        description: 'Choose events',
        icon: <Calendar />,
    },
    {
        step: 4,
        title: 'Team',
        description: 'Team details',
        icon: <Users />,
    },
    {
        step: 5,
        title: 'Final',
        description: 'Review & Submit',
        icon: <CheckSquare />,
    }
];

export const registrationSchema = z.object({
    fullName: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Invalid phone number'),
    institution: z.string().min(2, 'Institution name required'),
    degree: z.string().optional(),
    graduationYear: z.number().int().min(2020).max(2030),
    selectedEvents: z.array(z.string()).min(1, 'Select at least one event'),
    teamName: z.string().optional(),
    teamMembers: z.array(z.object({
        name: z.string().min(1, 'Name required'),
        email: z.string().email('Invalid email').optional().or(z.literal('')),
    })).optional(),
    tshirtSize: z.string().optional(),
    dietaryRestrictions: z.string().optional(),
    agreeToTerms: z.boolean().refine(val => val === true, 'You must agree to terms'),
});

export type RegistrationFormData = z.infer<typeof registrationSchema>;
