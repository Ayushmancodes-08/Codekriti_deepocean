import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  RegistrationFormState,
  EventType,
  RegistrationData,
  eventConfigs,
} from '../lib/schemas';
import {
  storeRegistrationData,
  retrieveRegistrationData,
  clearRegistrationData,
  generateConfirmationId,
} from '../lib/formUtils';
import {
  submitRegistrationWithRetry,
  RetryResult,
} from '../lib/errorHandling';

interface RegistrationContextType {
  // State
  formState: RegistrationFormState;
  confirmationId: string | null;

  // Event selection
  selectEvent: (event: EventType) => void;

  // Form data management
  setFormData: (data: Partial<RegistrationData>) => void;
  getFormData: () => Partial<RegistrationData> | undefined;

  // Step navigation
  goToStep: (step: RegistrationFormState['currentStep']) => void;
  nextStep: () => void;
  previousStep: () => void;

  // Error management
  setErrors: (errors: Record<string, string>) => void;
  clearErrors: () => void;

  // Submission
  setSubmitting: (isSubmitting: boolean) => void;
  submitRegistration: (data: RegistrationData) => Promise<RetryResult<{ id: string; data: RegistrationData }>>;
  completeRegistration: () => void;

  // Reset
  reset: () => void;
}

const RegistrationContext = createContext<RegistrationContextType | undefined>(undefined);

const initialFormState: RegistrationFormState = {
  currentStep: 'event-selection',
  selectedEvent: null,
  formData: undefined,
  errors: {},
  isSubmitting: false,
  isComplete: false,
};

const STORAGE_KEY = 'codekriti-registration-draft';

export function RegistrationProvider({ children }: { children: React.ReactNode }) {
  const [formState, setFormState] = useState<RegistrationFormState>(initialFormState);
  const [confirmationId, setConfirmationId] = useState<string | null>(null);

  // Load saved data from localStorage on mount
  useEffect(() => {
    const savedData = retrieveRegistrationData(STORAGE_KEY);
    if (savedData) {
      setFormState((prev) => ({
        ...prev,
        formData: savedData,
        selectedEvent: savedData.eventType,
      }));
    }
  }, []);

  // Auto-save to localStorage whenever form data changes
  useEffect(() => {
    if (formState.formData && Object.keys(formState.formData).length > 0) {
      storeRegistrationData(STORAGE_KEY, formState.formData as RegistrationData);
    }
  }, [formState.formData]);

  const selectEvent = useCallback((event: EventType) => {
    setFormState((prev) => ({
      ...prev,
      selectedEvent: event,
      currentStep: 'details',
    }));
  }, []);

  const setFormData = useCallback((data: Partial<RegistrationData>) => {
    setFormState((prev) => ({
      ...prev,
      formData: data,
    }));
  }, []);

  const getFormData = useCallback(() => {
    return formState.formData;
  }, [formState.formData]);

  const goToStep = useCallback((step: RegistrationFormState['currentStep']) => {
    setFormState((prev) => ({
      ...prev,
      currentStep: step,
    }));
  }, []);

  const nextStep = useCallback(() => {
    const steps: RegistrationFormState['currentStep'][] = [
      'event-selection',
      'details',
      'members',
      'confirmation',
    ];
    const currentIndex = steps.indexOf(formState.currentStep);
    if (currentIndex < steps.length - 1) {
      setFormState((prev) => ({
        ...prev,
        currentStep: steps[currentIndex + 1],
      }));
    }
  }, [formState.currentStep]);

  const previousStep = useCallback(() => {
    const steps: RegistrationFormState['currentStep'][] = [
      'event-selection',
      'details',
      'members',
      'confirmation',
    ];
    const currentIndex = steps.indexOf(formState.currentStep);
    if (currentIndex > 0) {
      setFormState((prev) => ({
        ...prev,
        currentStep: steps[currentIndex - 1],
      }));
    }
  }, [formState.currentStep]);

  const setErrors = useCallback((errors: Record<string, string>) => {
    setFormState((prev) => ({
      ...prev,
      errors,
    }));
  }, []);

  const clearErrors = useCallback(() => {
    setFormState((prev) => ({
      ...prev,
      errors: {},
    }));
  }, []);

  const setSubmitting = useCallback((isSubmitting: boolean) => {
    setFormState((prev) => ({
      ...prev,
      isSubmitting,
    }));
  }, []);

  const submitRegistration = useCallback(
    async (data: RegistrationData) => {
      setSubmitting(true);
      clearErrors();

      try {
        const result = await submitRegistrationWithRetry(data, {
          maxAttempts: 3,
          initialDelay: 1000,
          maxDelay: 5000,
        });

        if (result.success && result.data) {
          // Generate confirmation ID
          const newConfirmationId = generateConfirmationId();
          setConfirmationId(newConfirmationId);

          // Clear saved draft from localStorage
          clearRegistrationData(STORAGE_KEY);

          // Mark as complete
          setFormState((prev) => ({
            ...prev,
            isComplete: true,
            currentStep: 'confirmation',
          }));
        } else if (result.error) {
          setErrors({
            submit: result.error.message,
          });
        }

        return result;
      } finally {
        setSubmitting(false);
      }
    },
    [clearErrors, setSubmitting]
  );

  const completeRegistration = useCallback(() => {
    setFormState((prev) => ({
      ...prev,
      isComplete: true,
      currentStep: 'confirmation',
    }));
  }, []);

  const reset = useCallback(() => {
    setFormState(initialFormState);
    setConfirmationId(null);
    clearRegistrationData(STORAGE_KEY);
  }, []);

  const value: RegistrationContextType = {
    formState,
    confirmationId,
    selectEvent,
    setFormData,
    getFormData,
    goToStep,
    nextStep,
    previousStep,
    setErrors,
    clearErrors,
    setSubmitting,
    submitRegistration,
    completeRegistration,
    reset,
  };

  return (
    <RegistrationContext.Provider value={value}>
      {children}
    </RegistrationContext.Provider>
  );
}

/**
 * Hook to use registration context
 * Throws error if used outside RegistrationProvider
 */
export function useRegistration(): RegistrationContextType {
  const context = useContext(RegistrationContext);
  if (!context) {
    throw new Error('useRegistration must be used within RegistrationProvider');
  }
  return context;
}

/**
 * Hook to get current event configuration
 */
export function useCurrentEventConfig() {
  const { formState } = useRegistration();
  if (!formState.selectedEvent) {
    return null;
  }
  return eventConfigs[formState.selectedEvent];
}

/**
 * Hook to check if current event is team-based
 */
export function useIsTeamEvent() {
  const config = useCurrentEventConfig();
  return config?.type === 'team';
}

/**
 * Hook to get team size limits for current event
 */
export function useTeamSizeLimits() {
  const config = useCurrentEventConfig();
  if (!config) {
    return null;
  }
  return {
    min: config.minParticipants,
    max: config.maxParticipants,
  };
}
