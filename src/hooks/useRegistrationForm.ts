import { useForm, UseFormProps, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ZodSchema } from 'zod';

/**
 * Custom hook for registration forms with Zod validation
 * Wraps React Hook Form with Zod resolver for type-safe validation
 */
export function useRegistrationForm<T extends Record<string, any>>(
  schema: ZodSchema,
  options?: Omit<UseFormProps<T>, 'resolver'>
): UseFormReturn<T> {
  return useForm<T>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    ...options,
  });
}

/**
 * Custom hook for single participant form
 */
export function useSingleParticipantForm(
  defaultValues?: any
) {
  const { SingleParticipantSchema } = require('../lib/schemas');
  return useRegistrationForm(SingleParticipantSchema, {
    defaultValues: defaultValues || {
      name: '',
      college: '',
      studentId: '',
      phoneNumber: '',
      email: '',
      branch: '',
      year: '',
    },
  });
}

/**
 * Custom hook for team details form
 */
export function useTeamDetailsForm(
  defaultValues?: any
) {
  const { TeamDetailsSchema } = require('../lib/schemas');
  return useRegistrationForm(TeamDetailsSchema, {
    defaultValues: defaultValues || {
      name: '',
      college: '',
      leader: {
        name: '',
        phoneNumber: '',
        email: '',
      },
    },
  });
}

/**
 * Custom hook for team member form
 */
export function useTeamMemberForm(
  defaultValues?: any
) {
  const { TeamMemberSchema } = require('../lib/schemas');
  return useRegistrationForm(TeamMemberSchema, {
    defaultValues: defaultValues || {
      name: '',
      college: '',
      studentId: '',
      phoneNumber: '',
      email: '',
      branch: '',
      year: '',
    },
  });
}

/**
 * Custom hook for event selection
 */
export function useEventSelection() {
  const { EventTypeSchema } = require('../lib/schemas');
  return useRegistrationForm(EventTypeSchema, {
    defaultValues: null,
  });
}
