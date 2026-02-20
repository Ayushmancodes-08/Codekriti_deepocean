import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { TeamDetailsSchema, TeamDetails } from '../lib/schemas';
import { useRegistration, useTeamSizeLimits } from '../contexts/RegistrationContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  formContainerVariants,
  fieldVariants,
  errorMessageVariants,
  errorShakeVariants,
  usePrefersReducedMotion,
  getAccessibleAnimationVariants,
} from '../lib/animations';

interface TeamDetailsFormProps {
  onSubmit?: (data: TeamDetails) => void | Promise<void>;
  onNext?: () => void;
  onBack?: () => void;
  isLoading?: boolean;
}

// College options (common colleges)
const COLLEGES = [
  'NIT Rourkela',
  'NIT Warangal',
  'NIT Trichy',
  'NIT Surathkal',
  'NIT Calicut',
  'BITS Pilani',
  'IIT Delhi',
  'IIT Bombay',
  'Other',
];

// Colleges for DevXtreme
const DEVXTREME_COLLEGES = [
  'Parala Maharaja Engineering College',
  'Other',
];

export const TeamDetailsForm = React.forwardRef<
  HTMLFormElement,
  TeamDetailsFormProps
>(({ onSubmit, onNext, onBack, isLoading = false }, ref) => {
  const { setFormData, setErrors, clearErrors, setSubmitting, formState } = useRegistration();
  const teamSizeLimits = useTeamSizeLimits();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [shakeField, setShakeField] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<TeamDetails>({
    resolver: zodResolver(TeamDetailsSchema),
    mode: 'onBlur',
    defaultValues: {
      name: '',
      college: '',
      leader: {
        name: '',
        phoneNumber: '',
        email: '',
      },
    },
  });

  // Watch for dynamic fields
  const college = watch('college');
  const selectedEvent = formState.selectedEvent;

  // Use appropriate college list
  const activeColleges = selectedEvent === 'dev-xtreme' ? DEVXTREME_COLLEGES : COLLEGES;

  const formValues = watch();

  // Update registration context with form data
  useEffect(() => {
    setFormData({
      eventType: formState.selectedEvent as 'techmaze' | 'dev-xtreme',
      team: formValues,
      members: [],
    });
  }, [formValues, setFormData, formState.selectedEvent]);

  // Trigger shake animation when errors appear
  useEffect(() => {
    const errorKeys = Object.keys(errors);
    if (errorKeys.length > 0) {
      setShakeField(errorKeys[0]);
      const timer = setTimeout(() => setShakeField(null), 400);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  const handleFormSubmit = async (data: TeamDetails) => {
    try {
      clearErrors();
      setSubmitting(true);

      if (onSubmit) {
        // Handle "Other" fields
        const finalData = { ...data };
        if (finalData.college === 'Other' && (data as any).collegeCustom) {
          finalData.college = (data as any).collegeCustom;
        }
        // Clean up temporary fields
        delete (finalData as any).collegeCustom;

        await onSubmit(finalData);
      }

      setFormData({
        eventType: formState.selectedEvent as 'techmaze' | 'dev-xtreme',
        team: data,
        members: [],
      });

      // Move to next step
      if (onNext) {
        onNext();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Submission failed';
      setErrors({ submit: errorMessage });
    } finally {
      setSubmitting(false);
    }
  };

  const containerVariants = getAccessibleAnimationVariants(
    formContainerVariants,
    prefersReducedMotion
  );

  const fieldVariantsAccessible = getAccessibleAnimationVariants(
    fieldVariants,
    prefersReducedMotion
  );

  const errorVariants = getAccessibleAnimationVariants(
    errorMessageVariants,
    prefersReducedMotion
  );

  return (
    <motion.form
      ref={ref}
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header with member count indicator */}
      <motion.div className="mb-6" variants={fieldVariantsAccessible}>
        <h3 className="text-lg font-semibold text-white mb-2">Team Details</h3>
        {teamSizeLimits && (
          <p className="text-sm text-gray-400">
            Team size: {teamSizeLimits.min} - {teamSizeLimits.max} members
          </p>
        )}
      </motion.div>

      {/* Team Name Field */}
      <motion.div
        className="space-y-2"
        variants={fieldVariantsAccessible}
        animate={shakeField === 'name' ? 'shake' : 'still'}
      >
        <Label htmlFor="teamName" className="text-sm font-medium text-gray-300">
          Team Name <span className="text-cyan-400">*</span>
        </Label>
        <motion.div
          variants={errorShakeVariants}
          animate={shakeField === 'name' ? 'shake' : 'still'}
        >
          <Input
            id="teamName"
            placeholder="Enter your team name"
            {...register('name')}
            className={`bg-[#0a192f] border-gray-700 text-white placeholder:text-gray-500 transition-all ${errors.name
                ? 'border-red-500 focus:ring-red-500'
                : 'focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400'
              }`}
            aria-invalid={errors.name ? 'true' : 'false'}
            aria-describedby={errors.name ? 'teamName-error' : undefined}
          />
        </motion.div>
        {errors.name && (
          <motion.p
            id="teamName-error"
            className="text-sm text-red-400"
            variants={errorVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {errors.name.message}
          </motion.p>
        )}
      </motion.div>

      {/* College Field */}
      <motion.div
        className="space-y-2"
        variants={fieldVariantsAccessible}
        animate={shakeField === 'college' ? 'shake' : 'still'}
      >
        <Label htmlFor="teamCollege" className="text-sm font-medium text-gray-300">
          College <span className="text-cyan-400">*</span>
        </Label>
        <motion.div
          variants={errorShakeVariants}
          animate={shakeField === 'college' ? 'shake' : 'still'}
        >
          <Select onValueChange={(value) => setValue('college', value)}>
            <SelectTrigger
              id="teamCollege"
              className={`bg-[#0a192f] border-gray-700 text-white transition-all ${errors.college
                  ? 'border-red-500'
                  : 'focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400'
                }`}
              aria-invalid={errors.college ? 'true' : 'false'}
              aria-describedby={errors.college ? 'teamCollege-error' : undefined}
            >
              <SelectValue placeholder="Select your college" />
            </SelectTrigger>
            <SelectContent className="bg-[#0a192f] border-gray-700 text-white">
              {activeColleges.map((college) => (
                <SelectItem key={college} value={college} className="focus:bg-cyan-900/50 focus:text-cyan-400">
                  {college}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>
        {errors.college && (
          <motion.p
            id="teamCollege-error"
            className="text-sm text-red-400"
            variants={errorVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {errors.college.message}
          </motion.p>
        )}
      </motion.div>

      {/* Custom College Input */}
      {college === 'Other' && (
        <motion.div
          className="space-y-2"
          variants={fieldVariantsAccessible}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <Label htmlFor="teamCollegeCustom" className="text-sm font-medium text-gray-300">
            Enter College Name <span className="text-cyan-400">*</span>
          </Label>
          <Input
            id="teamCollegeCustom"
            placeholder="Enter your college name"
            {...register('collegeCustom' as any)}
            className="bg-[#0a192f] border-gray-700 text-white placeholder:text-gray-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
          />
        </motion.div>
      )}

      {/* Team Leader Section */}
      <motion.div className="space-y-4 pt-4 border-t border-gray-700" variants={fieldVariantsAccessible}>
        <h4 className="text-base font-semibold text-white">Team Leader Information</h4>

        {/* Leader Name Field */}
        <motion.div
          className="space-y-2"
          variants={fieldVariantsAccessible}
          animate={shakeField === 'leader.name' ? 'shake' : 'still'}
        >
          <Label htmlFor="leaderName" className="text-sm font-medium text-gray-300">
            Leader Name <span className="text-cyan-400">*</span>
          </Label>
          <motion.div
            variants={errorShakeVariants}
            animate={shakeField === 'leader.name' ? 'shake' : 'still'}
          >
            <Input
              id="leaderName"
              placeholder="Enter team leader's full name"
              {...register('leader.name')}
              className={`bg-[#0a192f] border-gray-700 text-white placeholder:text-gray-500 transition-all ${errors.leader?.name
                  ? 'border-red-500 focus:ring-red-500'
                  : 'focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400'
                }`}
              aria-invalid={errors.leader?.name ? 'true' : 'false'}
              aria-describedby={errors.leader?.name ? 'leaderName-error' : undefined}
            />
          </motion.div>
          {errors.leader?.name && (
            <motion.p
              id="leaderName-error"
              className="text-sm text-red-400"
              variants={errorVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {errors.leader.name.message}
            </motion.p>
          )}
        </motion.div>

        {/* Leader Phone Field */}
        <motion.div
          className="space-y-2"
          variants={fieldVariantsAccessible}
          animate={shakeField === 'leader.phoneNumber' ? 'shake' : 'still'}
        >
          <Label htmlFor="leaderPhone" className="text-sm font-medium text-gray-300">
            Phone Number <span className="text-cyan-400">*</span>
          </Label>
          <motion.div
            variants={errorShakeVariants}
            animate={shakeField === 'leader.phoneNumber' ? 'shake' : 'still'}
          >
            <Input
              id="leaderPhone"
              type="tel"
              placeholder="Enter 10-digit phone number"
              {...register('leader.phoneNumber')}
              className={`bg-[#0a192f] border-gray-700 text-white placeholder:text-gray-500 transition-all ${errors.leader?.phoneNumber
                  ? 'border-red-500 focus:ring-red-500'
                  : 'focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400'
                }`}
              aria-invalid={errors.leader?.phoneNumber ? 'true' : 'false'}
              aria-describedby={errors.leader?.phoneNumber ? 'leaderPhone-error' : undefined}
            />
          </motion.div>
          {errors.leader?.phoneNumber && (
            <motion.p
              id="leaderPhone-error"
              className="text-sm text-red-400"
              variants={errorVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {errors.leader.phoneNumber.message}
            </motion.p>
          )}
        </motion.div>

        {/* Leader Email Field */}
        <motion.div
          className="space-y-2"
          variants={fieldVariantsAccessible}
          animate={shakeField === 'leader.email' ? 'shake' : 'still'}
        >
          <Label htmlFor="leaderEmail" className="text-sm font-medium text-gray-300">
            Email <span className="text-cyan-400">*</span>
          </Label>
          <motion.div
            variants={errorShakeVariants}
            animate={shakeField === 'leader.email' ? 'shake' : 'still'}
          >
            <Input
              id="leaderEmail"
              type="email"
              placeholder="Enter team leader's email address"
              {...register('leader.email')}
              className={`bg-[#0a192f] border-gray-700 text-white placeholder:text-gray-500 transition-all ${errors.leader?.email
                  ? 'border-red-500 focus:ring-red-500'
                  : 'focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400'
                }`}
              aria-invalid={errors.leader?.email ? 'true' : 'false'}
              aria-describedby={errors.leader?.email ? 'leaderEmail-error' : undefined}
            />
          </motion.div>
          {errors.leader?.email && (
            <motion.p
              id="leaderEmail-error"
              className="text-sm text-red-400"
              variants={errorVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {errors.leader.email.message}
            </motion.p>
          )}
        </motion.div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div variants={fieldVariantsAccessible} className="pt-6 flex gap-3">
        <Button
          type="button"
          onClick={onBack}
          disabled={isSubmitting || isLoading}
          variant="outline"
          className="flex-1 min-h-11 md:min-h-10 touch-manipulation border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
        >
          Back
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 md:py-2 px-4 rounded-lg transition-all duration-200 min-h-11 md:min-h-10 touch-manipulation shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_20px_rgba(6,182,212,0.5)]"
        >
          {isSubmitting || isLoading ? 'Processing...' : 'Add Team Members'}
        </Button>
      </motion.div>
    </motion.form>
  );
});

TeamDetailsForm.displayName = 'TeamDetailsForm';
