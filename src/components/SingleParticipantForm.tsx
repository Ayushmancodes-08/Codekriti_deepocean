import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { SingleParticipantSchema, SingleParticipant } from '../lib/schemas';
import { useRegistration } from '../contexts/RegistrationContext';
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

interface SingleParticipantFormProps {
  onSubmit?: (data: SingleParticipant) => void | Promise<void>;
  isLoading?: boolean;
}

// Branch options
const BRANCHES = [
  'Computer Science',
  'Electronics',
  'Mechanical',
  'Electrical',
  'Civil',
  'Chemical',
  'Biotechnology',
  'Other',
];

// Year options
const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

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

export const SingleParticipantForm = React.forwardRef<
  HTMLFormElement,
  SingleParticipantFormProps
>(({ onSubmit, isLoading = false }, ref) => {
  const { setFormData, setErrors, clearErrors, setSubmitting } = useRegistration();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [shakeField, setShakeField] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<SingleParticipant>({
    resolver: zodResolver(SingleParticipantSchema),
    mode: 'onBlur',
    defaultValues: {
      name: '',
      college: '',
      studentId: '',
      phoneNumber: '',
      email: '',
      branch: '',
      year: '',
    },
  });

  const formValues = watch();
  const watchedBranch = watch('branch');
  const watchedYear = watch('year');
  const watchedCollege = watch('college');

  // Update registration context with form data
  useEffect(() => {
    setFormData({
      eventType: 'algo-to-code', // Will be set by parent
      participant: formValues,
    });
  }, [formValues, setFormData]);

  // Trigger shake animation when errors appear
  useEffect(() => {
    const errorKeys = Object.keys(errors);
    if (errorKeys.length > 0) {
      setShakeField(errorKeys[0]);
      const timer = setTimeout(() => setShakeField(null), 400);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  const handleFormSubmit = async (data: SingleParticipant) => {
    try {
      clearErrors();
      setSubmitting(true);

      if (onSubmit) {
        // Handle "Other" fields
        const finalData = { ...data };
        if (finalData.branch === 'Other' && (data as any).branchCustom) finalData.branch = (data as any).branchCustom;
        if (finalData.year === 'Other' && (data as any).yearCustom) finalData.year = (data as any).yearCustom;
        if (finalData.college === 'Other' && (data as any).collegeCustom) finalData.college = (data as any).collegeCustom;

        // Clean up temporary fields
        delete (finalData as any).branchCustom;
        delete (finalData as any).yearCustom;
        delete (finalData as any).collegeCustom;

        await onSubmit(finalData);
      }

      setFormData({
        eventType: 'algo-to-code',
        participant: data,
      });
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
      aria-label="Single Participant Registration Form"
    >
      {/* Form Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Registration Details</h2>
        <p className="text-sm text-white/70">
          All fields marked with <span className="text-red-500">*</span> are required
        </p>
      </div>

      {/* Name Field */}
      <motion.div
        className="space-y-2"
        variants={fieldVariantsAccessible}
        animate={shakeField === 'name' ? 'shake' : 'still'}
      >
        <Label htmlFor="name" className="text-sm font-medium">
          Full Name <span className="text-red-500" aria-label="required">*</span>
        </Label>
        <motion.div
          variants={errorShakeVariants}
          animate={shakeField === 'name' ? 'shake' : 'still'}
        >
          <Input
            id="name"
            placeholder="Enter your full name"
            {...register('name')}
            className={`transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${errors.name ? 'border-red-500 focus:ring-red-500' : 'focus:ring-orange-500'
              }`}
            aria-invalid={errors.name ? 'true' : 'false'}
            aria-describedby={errors.name ? 'name-error' : undefined}
            aria-required="true"
          />
        </motion.div>
        {errors.name && (
          <motion.p
            id="name-error"
            className="text-sm text-red-500"
            variants={errorVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="alert"
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
        <Label htmlFor="college" className="text-sm font-medium">
          College <span className="text-red-500" aria-label="required">*</span>
        </Label>
        <motion.div
          variants={errorShakeVariants}
          animate={shakeField === 'college' ? 'shake' : 'still'}
        >
          <Select onValueChange={(value) => setValue('college', value)}>
            <SelectTrigger
              id="college"
              className={`transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${errors.college ? 'border-red-500' : 'focus:ring-orange-500'
                }`}
              aria-invalid={errors.college ? 'true' : 'false'}
              aria-describedby={errors.college ? 'college-error' : undefined}
              aria-required="true"
            >
              <SelectValue placeholder="Select your college" />
            </SelectTrigger>
            <SelectContent>
              {COLLEGES.map((college) => (
                <SelectItem key={college} value={college}>
                  {college}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>
        {errors.college && (
          <motion.p
            id="college-error"
            className="text-sm text-red-500"
            variants={errorVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="alert"
          >
            {errors.college.message}
          </motion.p>
        )}
      </motion.div>

      {/* Custom College Input */}
      {watchedCollege === 'Other' && (
        <motion.div
          className="space-y-2"
          variants={fieldVariantsAccessible}
          animate={shakeField === 'college' ? 'shake' : 'still'}
        >
          <Label htmlFor="collegeCustom" className="text-sm font-medium">
            Enter College Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="collegeCustom"
            placeholder="Enter your college name"
            {...register('collegeCustom' as any)}
            className="focus:ring-orange-500"
          />
        </motion.div>
      )}

      {/* Student ID Field */}
      <motion.div
        className="space-y-2"
        variants={fieldVariantsAccessible}
        animate={shakeField === 'studentId' ? 'shake' : 'still'}
      >
        <Label htmlFor="studentId" className="text-sm font-medium">
          Student ID <span className="text-red-500" aria-label="required">*</span>
        </Label>
        <motion.div
          variants={errorShakeVariants}
          animate={shakeField === 'studentId' ? 'shake' : 'still'}
        >
          <Input
            id="studentId"
            placeholder="Enter your student ID"
            {...register('studentId')}
            className={`transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${errors.studentId ? 'border-red-500 focus:ring-red-500' : 'focus:ring-orange-500'
              }`}
            aria-invalid={errors.studentId ? 'true' : 'false'}
            aria-describedby={errors.studentId ? 'studentId-error' : undefined}
            aria-required="true"
          />
        </motion.div>
        {errors.studentId && (
          <motion.p
            id="studentId-error"
            className="text-sm text-red-500"
            variants={errorVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="alert"
          >
            {errors.studentId.message}
          </motion.p>
        )}
      </motion.div>

      {/* Phone Number Field */}
      <motion.div
        className="space-y-2"
        variants={fieldVariantsAccessible}
        animate={shakeField === 'phoneNumber' ? 'shake' : 'still'}
      >
        <Label htmlFor="phoneNumber" className="text-sm font-medium">
          Phone Number <span className="text-red-500" aria-label="required">*</span>
        </Label>
        <motion.div
          variants={errorShakeVariants}
          animate={shakeField === 'phoneNumber' ? 'shake' : 'still'}
        >
          <Input
            id="phoneNumber"
            type="tel"
            placeholder="Enter 10-digit phone number"
            {...register('phoneNumber')}
            className={`transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${errors.phoneNumber ? 'border-red-500 focus:ring-red-500' : 'focus:ring-orange-500'
              }`}
            aria-invalid={errors.phoneNumber ? 'true' : 'false'}
            aria-describedby={errors.phoneNumber ? 'phoneNumber-error' : undefined}
            aria-required="true"
          />
        </motion.div>
        {errors.phoneNumber && (
          <motion.p
            id="phoneNumber-error"
            className="text-sm text-red-500"
            variants={errorVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="alert"
          >
            {errors.phoneNumber.message}
          </motion.p>
        )}
      </motion.div>

      {/* Email Field */}
      <motion.div
        className="space-y-2"
        variants={fieldVariantsAccessible}
        animate={shakeField === 'email' ? 'shake' : 'still'}
      >
        <Label htmlFor="email" className="text-sm font-medium">
          Email <span className="text-red-500" aria-label="required">*</span>
        </Label>
        <motion.div
          variants={errorShakeVariants}
          animate={shakeField === 'email' ? 'shake' : 'still'}
        >
          <Input
            id="email"
            type="email"
            placeholder="Enter your email address"
            {...register('email')}
            className={`transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${errors.email ? 'border-red-500 focus:ring-red-500' : 'focus:ring-orange-500'
              }`}
            aria-invalid={errors.email ? 'true' : 'false'}
            aria-describedby={errors.email ? 'email-error' : undefined}
            aria-required="true"
          />
        </motion.div>
        {errors.email && (
          <motion.p
            id="email-error"
            className="text-sm text-red-500"
            variants={errorVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="alert"
          >
            {errors.email.message}
          </motion.p>
        )}
      </motion.div>

      {/* Branch Field */}
      <motion.div
        className="space-y-2"
        variants={fieldVariantsAccessible}
        animate={shakeField === 'branch' ? 'shake' : 'still'}
      >
        <Label htmlFor="branch" className="text-sm font-medium">
          Branch <span className="text-red-500" aria-label="required">*</span>
        </Label>
        <motion.div
          variants={errorShakeVariants}
          animate={shakeField === 'branch' ? 'shake' : 'still'}
        >
          <Select onValueChange={(value) => setValue('branch', value)}>
            <SelectTrigger
              id="branch"
              className={`transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${errors.branch ? 'border-red-500' : 'focus:ring-orange-500'
                }`}
              aria-invalid={errors.branch ? 'true' : 'false'}
              aria-describedby={errors.branch ? 'branch-error' : undefined}
              aria-required="true"
            >
              <SelectValue placeholder="Select your branch" />
            </SelectTrigger>
            <SelectContent>
              {BRANCHES.map((branch) => (
                <SelectItem key={branch} value={branch}>
                  {branch}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>
        {errors.branch && (
          <motion.p
            id="branch-error"
            className="text-sm text-red-500"
            variants={errorVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="alert"
          >
            {errors.branch.message}
          </motion.p>
        )}
      </motion.div>

      {/* Custom Branch Input */}
      {watchedBranch === 'Other' && (
        <motion.div
          className="space-y-2"
          variants={fieldVariantsAccessible}
          animate={shakeField === 'branch' ? 'shake' : 'still'}
        >
          <Label htmlFor="branchCustom" className="text-sm font-medium">
            Enter Branch Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="branchCustom"
            placeholder="Enter your branch name"
            {...register('branchCustom' as any)}
            className="focus:ring-orange-500"
          />
        </motion.div>
      )}

      {/* Year Field */}
      <motion.div
        className="space-y-2"
        variants={fieldVariantsAccessible}
        animate={shakeField === 'year' ? 'shake' : 'still'}
      >
        <Label htmlFor="year" className="text-sm font-medium">
          Year <span className="text-red-500" aria-label="required">*</span>
        </Label>
        <motion.div
          variants={errorShakeVariants}
          animate={shakeField === 'year' ? 'shake' : 'still'}
        >
          <Select onValueChange={(value) => setValue('year', value)}>
            <SelectTrigger
              id="year"
              className={`transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${errors.year ? 'border-red-500' : 'focus:ring-orange-500'
                }`}
              aria-invalid={errors.year ? 'true' : 'false'}
              aria-describedby={errors.year ? 'year-error' : undefined}
              aria-required="true"
            >
              <SelectValue placeholder="Select your year" />
            </SelectTrigger>
            <SelectContent>
              {YEARS.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>
        {errors.year && (
          <motion.p
            id="year-error"
            className="text-sm text-red-500"
            variants={errorVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="alert"
          >
            {errors.year.message}
          </motion.p>
        )}
      </motion.div>

      {/* Custom Year Input */}
      {watchedYear === 'Other' && (
        <motion.div
          className="space-y-2"
          variants={fieldVariantsAccessible}
          animate={shakeField === 'year' ? 'shake' : 'still'}
        >
          <Label htmlFor="yearCustom" className="text-sm font-medium">
            Enter Year <span className="text-red-500">*</span>
          </Label>
          <Input
            id="yearCustom"
            placeholder="Enter your year (e.g., 5th Year)"
            {...register('yearCustom' as any)}
            className="focus:ring-orange-500"
          />
        </motion.div>
      )}

      {/* Submit Button */}
      <motion.div variants={fieldVariantsAccessible} className="pt-4">
        <Button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="w-full bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-semibold py-3 md:py-2 px-4 rounded-lg transition-all duration-200 min-h-11 md:min-h-10 touch-manipulation focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          aria-busy={isSubmitting || isLoading}
        >
          {isSubmitting || isLoading ? 'Submitting...' : 'Submit Registration'}
        </Button>
      </motion.div>
    </motion.form>
  );
});

SingleParticipantForm.displayName = 'SingleParticipantForm';
