import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRegistration, useIsTeamEvent } from '../contexts/RegistrationContext';
import { SingleParticipantForm } from './SingleParticipantForm';
import { TeamDetailsForm } from './TeamDetailsForm';
import { TeamMembersForm } from './TeamMembersForm';
import { ConfirmationPage } from './ConfirmationPage';
import { SingleParticipant, TeamRegistration, RegistrationData } from '../lib/schemas';
import { getUserFriendlyErrorMessage } from '../lib/errorHandling';
import {
  formSectionVariants,
  usePrefersReducedMotion,
  getAccessibleAnimationVariants,
} from '../lib/animations';

/**
 * RegistrationFlow Component
 * 
 * Orchestrates the registration form flow with smooth transitions between sections.
 * Handles:
 * - Fade/slide transitions between form sections
 * - Step completion animations
 * - Accessibility compliance (respects prefers-reduced-motion)
 * 
 * Requirements: 11.1, 11.2, 11.3, 11.4, 11.5
 */

interface RegistrationFlowProps {
  onComplete?: (data: SingleParticipant | TeamRegistration) => void;
  onClose?: () => void;
}

export const RegistrationFlow = React.forwardRef<
  HTMLDivElement,
  RegistrationFlowProps
>(({ onComplete, onClose }, ref) => {
  const { formState, submitRegistration, confirmationId, reset, nextStep, previousStep } = useRegistration();
  const isTeamEvent = useIsTeamEvent();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const sectionVariants = getAccessibleAnimationVariants(
    formSectionVariants,
    prefersReducedMotion
  );

  const handleSingleParticipantSubmit = async (data: SingleParticipant) => {
    setSubmissionError(null);

    const registrationData: RegistrationData = {
      eventType: formState.selectedEvent as 'algo-to-code' | 'designathon',
      participant: data,
    };

    const result = await submitRegistration(registrationData);

    if (!result.success) {
      const errorMessage = getUserFriendlyErrorMessage(result.error);
      setSubmissionError(errorMessage);
    } else if (onComplete) {
      onComplete(data);
    }
  };

  const handleTeamRegistrationSubmit = async (data: TeamRegistration) => {
    setSubmissionError(null);

    const result = await submitRegistration(data);

    if (!result.success) {
      const errorMessage = getUserFriendlyErrorMessage(result.error);
      setSubmissionError(errorMessage);
    } else if (onComplete) {
      onComplete(data);
    }
  };

  const handleReset = () => {
    reset();
    if (onClose) {
      onClose();
    }
  };

  return (
    <motion.div
      ref={ref}
      className="w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Error Message */}
      {submissionError && (
        <motion.div
          className="mb-6 bg-red-500/10 border border-red-500/30 rounded-lg p-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <p className="text-red-400 text-sm">{submissionError}</p>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {/* Single Participant Form */}
        {formState.currentStep === 'details' && !isTeamEvent && (
          <motion.div
            key="single-participant-form"
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <SingleParticipantForm
              onSubmit={handleSingleParticipantSubmit}
              isLoading={formState.isSubmitting}
            />
          </motion.div>
        )}

        {/* Team Details Form */}
        {formState.currentStep === 'details' && isTeamEvent && (
          <motion.div
            key="team-details-form"
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <TeamDetailsForm
              onNext={nextStep}
              onBack={onClose}
              isLoading={formState.isSubmitting}
            />
          </motion.div>
        )}

        {/* Team Members Form */}
        {formState.currentStep === 'members' && isTeamEvent && (
          <motion.div
            key="team-members-form"
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <TeamMembersForm
              onSubmit={handleTeamRegistrationSubmit}
              onBack={previousStep}
              isLoading={formState.isSubmitting}
            />
          </motion.div>
        )}

        {/* Confirmation Page */}
        {formState.currentStep === 'confirmation' && formState.isComplete && confirmationId && (
          <motion.div
            key="confirmation-page"
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <ConfirmationPage
              confirmationId={confirmationId}
              registrationData={formState.formData as RegistrationData}
              onReset={handleReset}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Indicator */}
      {isTeamEvent && (
        <motion.div
          className="mt-8 flex justify-center gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {['details', 'members'].map((step) => (
            <motion.div
              key={step}
              className={`h-2 rounded-full transition-all ${formState.currentStep === step ||
                (formState.currentStep === 'members' && step === 'details')
                ? 'bg-orange-500 w-8'
                : 'bg-gray-300 w-2'
                }`}
              layoutId={`progress-${step}`}
              transition={{ duration: 0.3 }}
            />
          ))}
        </motion.div>
      )}
    </motion.div>
  );
});

RegistrationFlow.displayName = 'RegistrationFlow';
