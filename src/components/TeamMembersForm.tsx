import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { TeamMemberSchema, TeamMember, TeamRegistration } from '../lib/schemas';
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
import { Trash2, Edit2, Plus } from 'lucide-react';
import {
  formContainerVariants,
  fieldVariants,
  errorMessageVariants,
  errorShakeVariants,
  listItemVariants,
  progressBarVariants,
  usePrefersReducedMotion,
  getAccessibleAnimationVariants,
} from '../lib/animations';

interface TeamMembersFormProps {
  onSubmit?: (data: TeamRegistration) => void | Promise<void>;
  onBack?: () => void;
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

// College options
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

export const TeamMembersForm = React.forwardRef<
  HTMLDivElement,
  TeamMembersFormProps
>(({ onSubmit, onBack, isLoading = false }, ref) => {
  const { setFormData, setErrors, clearErrors, setSubmitting, formState } = useRegistration();
  const teamSizeLimits = useTeamSizeLimits();
  const prefersReducedMotion = usePrefersReducedMotion();

  const [members, setMembers] = useState<TeamMember[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [shakeField, setShakeField] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    reset,
  } = useForm<TeamMember>({
    resolver: zodResolver(TeamMemberSchema),
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

  // Update registration context with members data
  useEffect(() => {
    const registrationData = formState.formData as Partial<TeamRegistration> | undefined;
    if (registrationData) {
      setFormData({
        ...registrationData,
        members,
      });
    }
  }, [members, setFormData, formState.formData]);

  // Trigger shake animation when errors appear
  useEffect(() => {
    const errorKeys = Object.keys(errors);
    if (errorKeys.length > 0) {
      setShakeField(errorKeys[0]);
      const timer = setTimeout(() => setShakeField(null), 400);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  const canAddMore = !teamSizeLimits || members.length < teamSizeLimits.max;
  const canSubmit = teamSizeLimits && members.length >= teamSizeLimits.min;

  const handleAddMember = async (data: TeamMember) => {
    try {
      clearErrors();
      setIsSubmittingForm(true);

      if (editingIndex !== null) {
        // Update existing member
        const updatedMembers = [...members];
        updatedMembers[editingIndex] = data;
        setMembers(updatedMembers);
        setEditingIndex(null);
      } else {
        // Add new member
        setMembers([...members, data]);
      }

      reset();
      setShowForm(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add member';
      setErrors({ submit: errorMessage });
    } finally {
      setIsSubmittingForm(false);
    }
  };

  const handleEditMember = (index: number) => {
    const member = members[index];
    setValue('name', member.name);
    setValue('college', member.college);
    setValue('studentId', member.studentId);
    setValue('phoneNumber', member.phoneNumber);
    setValue('email', member.email);
    setValue('branch', member.branch);
    setValue('year', member.year);
    setEditingIndex(index);
    setShowForm(true);
  };

  const handleRemoveMember = (index: number) => {
    setMembers(members.filter((_, i) => i !== index));
    if (editingIndex === index) {
      setEditingIndex(null);
      reset();
      setShowForm(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    reset();
    setShowForm(false);
  };

  const handleFormSubmit = async (data: TeamMember) => {
    try {
      clearErrors();
      setSubmitting(true);

      await handleAddMember(data);

      // If this is the final submission (all members added)
      if (editingIndex === null && members.length + 1 >= (teamSizeLimits?.min || 1)) {
        // Don't auto-submit, let user click submit button
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Submission failed';
      setErrors({ submit: errorMessage });
    } finally {
      setSubmitting(false);
    }
  };

  const handleFinalSubmit = async () => {
    try {
      clearErrors();
      setSubmitting(true);

      const registrationData = formState.formData as Partial<TeamRegistration> | undefined;
      if (!registrationData) {
        throw new Error('Registration data not found');
      }

      const finalData: TeamRegistration = {
        eventType: registrationData.eventType as 'techmaze' | 'dev-xtreme',
        team: registrationData.team!,
        members,
      };

      if (onSubmit) {
        await onSubmit(finalData);
      }

      setFormData(finalData);
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

  const memberCardVariants = getAccessibleAnimationVariants(
    listItemVariants,
    prefersReducedMotion
  );

  return (
    <motion.div
      ref={ref}
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header with progress indicator */}
      <motion.div className="mb-6" variants={fieldVariants}>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Add Team Members</h3>
        {teamSizeLimits && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {members.length} of {teamSizeLimits.max} members added
            </p>
            <div className="w-full max-w-xs bg-gray-200 rounded-full h-2 ml-4">
              <div
                className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${(members.length / teamSizeLimits.max) * 100}%`,
                }}
              />
            </div>
          </div>
        )}
      </motion.div>

      {/* Members List */}
      <motion.div className="space-y-3" variants={fieldVariants}>
        <AnimatePresence>
          {members.map((member, index) => (
            <motion.div
              key={`${member.email}-${index}`}
              className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-shadow"
              variants={memberCardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="flex-1">
                <p className="font-medium text-gray-900">{member.name}</p>
                <p className="text-sm text-gray-600">{member.email}</p>
                <p className="text-xs text-gray-500">
                  {member.branch} • {member.year}
                </p>
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  type="button"
                  onClick={() => handleEditMember(index)}
                  className="p-3 md:p-2 text-blue-600 hover:bg-blue-50 active:bg-blue-100 rounded-lg transition-colors min-h-11 min-w-11 md:min-h-9 md:min-w-9 flex items-center justify-center touch-manipulation"
                  aria-label={`Edit ${member.name}`}
                >
                  <Edit2 size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => handleRemoveMember(index)}
                  className="p-3 md:p-2 text-red-600 hover:bg-red-50 active:bg-red-100 rounded-lg transition-colors min-h-11 min-w-11 md:min-h-9 md:min-w-9 flex items-center justify-center touch-manipulation"
                  aria-label={`Remove ${member.name}`}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {members.length === 0 && !showForm && (
          <motion.p
            className="text-center text-gray-500 py-8"
            variants={fieldVariants}
          >
            No members added yet. Click "Add Member" to get started.
          </motion.p>
        )}
      </motion.div>

      {/* Add/Edit Member Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <h4 className="font-semibold text-gray-900">
              {editingIndex !== null ? 'Edit Member' : 'Add New Member'}
            </h4>

            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
              {/* Name Field */}
              <motion.div className="space-y-2" variants={fieldVariants}>
                <Label htmlFor="memberName" className="text-sm font-medium">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="memberName"
                  placeholder="Enter member's full name"
                  {...register('name')}
                  className={`transition-all ${
                    errors.name ? 'border-red-500 focus:ring-red-500' : 'focus:ring-orange-500'
                  }`}
                  aria-invalid={errors.name ? 'true' : 'false'}
                  aria-describedby={errors.name ? 'memberName-error' : undefined}
                />
                {errors.name && (
                  <motion.p
                    id="memberName-error"
                    className="text-sm text-red-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {errors.name.message}
                  </motion.p>
                )}
              </motion.div>

              {/* College Field */}
              <motion.div className="space-y-2" variants={fieldVariants}>
                <Label htmlFor="memberCollege" className="text-sm font-medium">
                  College <span className="text-red-500">*</span>
                </Label>
                <Select onValueChange={(value) => setValue('college', value)}>
                  <SelectTrigger
                    id="memberCollege"
                    className={`transition-all ${
                      errors.college ? 'border-red-500' : 'focus:ring-orange-500'
                    }`}
                    aria-invalid={errors.college ? 'true' : 'false'}
                    aria-describedby={errors.college ? 'memberCollege-error' : undefined}
                  >
                    <SelectValue placeholder="Select college" />
                  </SelectTrigger>
                  <SelectContent>
                    {COLLEGES.map((college) => (
                      <SelectItem key={college} value={college}>
                        {college}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.college && (
                  <motion.p
                    id="memberCollege-error"
                    className="text-sm text-red-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {errors.college.message}
                  </motion.p>
                )}
              </motion.div>

              {/* Student ID Field */}
              <motion.div className="space-y-2" variants={fieldVariants}>
                <Label htmlFor="memberStudentId" className="text-sm font-medium">
                  Student ID <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="memberStudentId"
                  placeholder="Enter student ID"
                  {...register('studentId')}
                  className={`transition-all ${
                    errors.studentId ? 'border-red-500 focus:ring-red-500' : 'focus:ring-orange-500'
                  }`}
                  aria-invalid={errors.studentId ? 'true' : 'false'}
                  aria-describedby={errors.studentId ? 'memberStudentId-error' : undefined}
                />
                {errors.studentId && (
                  <motion.p
                    id="memberStudentId-error"
                    className="text-sm text-red-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {errors.studentId.message}
                  </motion.p>
                )}
              </motion.div>

              {/* Phone Number Field */}
              <motion.div className="space-y-2" variants={fieldVariants}>
                <Label htmlFor="memberPhone" className="text-sm font-medium">
                  Phone Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="memberPhone"
                  type="tel"
                  placeholder="Enter 10-digit phone number"
                  {...register('phoneNumber')}
                  className={`transition-all ${
                    errors.phoneNumber ? 'border-red-500 focus:ring-red-500' : 'focus:ring-orange-500'
                  }`}
                  aria-invalid={errors.phoneNumber ? 'true' : 'false'}
                  aria-describedby={errors.phoneNumber ? 'memberPhone-error' : undefined}
                />
                {errors.phoneNumber && (
                  <motion.p
                    id="memberPhone-error"
                    className="text-sm text-red-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {errors.phoneNumber.message}
                  </motion.p>
                )}
              </motion.div>

              {/* Email Field */}
              <motion.div className="space-y-2" variants={fieldVariants}>
                <Label htmlFor="memberEmail" className="text-sm font-medium">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="memberEmail"
                  type="email"
                  placeholder="Enter email address"
                  {...register('email')}
                  className={`transition-all ${
                    errors.email ? 'border-red-500 focus:ring-red-500' : 'focus:ring-orange-500'
                  }`}
                  aria-invalid={errors.email ? 'true' : 'false'}
                  aria-describedby={errors.email ? 'memberEmail-error' : undefined}
                />
                {errors.email && (
                  <motion.p
                    id="memberEmail-error"
                    className="text-sm text-red-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {errors.email.message}
                  </motion.p>
                )}
              </motion.div>

              {/* Branch Field */}
              <motion.div className="space-y-2" variants={fieldVariants}>
                <Label htmlFor="memberBranch" className="text-sm font-medium">
                  Branch <span className="text-red-500">*</span>
                </Label>
                <Select onValueChange={(value) => setValue('branch', value)}>
                  <SelectTrigger
                    id="memberBranch"
                    className={`transition-all ${
                      errors.branch ? 'border-red-500' : 'focus:ring-orange-500'
                    }`}
                    aria-invalid={errors.branch ? 'true' : 'false'}
                    aria-describedby={errors.branch ? 'memberBranch-error' : undefined}
                  >
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {BRANCHES.map((branch) => (
                      <SelectItem key={branch} value={branch}>
                        {branch}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.branch && (
                  <motion.p
                    id="memberBranch-error"
                    className="text-sm text-red-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {errors.branch.message}
                  </motion.p>
                )}
              </motion.div>

              {/* Year Field */}
              <motion.div className="space-y-2" variants={fieldVariants}>
                <Label htmlFor="memberYear" className="text-sm font-medium">
                  Year <span className="text-red-500">*</span>
                </Label>
                <Select onValueChange={(value) => setValue('year', value)}>
                  <SelectTrigger
                    id="memberYear"
                    className={`transition-all ${
                      errors.year ? 'border-red-500' : 'focus:ring-orange-500'
                    }`}
                    aria-invalid={errors.year ? 'true' : 'false'}
                    aria-describedby={errors.year ? 'memberYear-error' : undefined}
                  >
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {YEARS.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.year && (
                  <motion.p
                    id="memberYear-error"
                    className="text-sm text-red-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {errors.year.message}
                  </motion.p>
                )}
              </motion.div>

              {/* Form Action Buttons */}
              <motion.div variants={fieldVariants} className="pt-4 flex gap-3">
                <Button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={isSubmittingForm || isLoading}
                  variant="outline"
                  className="flex-1 min-h-11 md:min-h-10 touch-manipulation"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmittingForm || isLoading}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-semibold py-3 md:py-2 px-4 rounded-lg transition-all duration-200 min-h-11 md:min-h-10 touch-manipulation"
                >
                  {isSubmittingForm || isLoading
                    ? 'Processing...'
                    : editingIndex !== null
                      ? 'Update Member'
                      : 'Add Member'}
                </Button>
              </motion.div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Member Button */}
      {!showForm && canAddMore && (
        <motion.button
          type="button"
          onClick={() => setShowForm(true)}
          className="w-full py-3 md:py-2 px-4 border-2 border-dashed border-orange-300 rounded-lg text-orange-600 font-semibold hover:bg-orange-50 active:bg-orange-100 transition-colors flex items-center justify-center gap-2 min-h-11 md:min-h-10 touch-manipulation"
          variants={fieldVariants}
        >
          <Plus size={20} />
          Add Member
        </motion.button>
      )}

      {/* Error Message */}
      {formState.errors?.submit && (
        <motion.div
          className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {formState.errors.submit}
        </motion.div>
      )}

      {/* Action Buttons */}
      <motion.div variants={fieldVariants} className="pt-6 flex gap-3">
        <Button
          type="button"
          onClick={onBack}
          disabled={isSubmitting || isLoading}
          variant="outline"
          className="flex-1 min-h-11 md:min-h-10 touch-manipulation"
        >
          Back
        </Button>
        <Button
          type="button"
          onClick={handleFinalSubmit}
          disabled={!canSubmit || isSubmitting || isLoading}
          className="flex-1 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-semibold py-3 md:py-2 px-4 rounded-lg transition-all duration-200 min-h-11 md:min-h-10 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
        >
          {isSubmitting || isLoading ? 'Submitting...' : 'Complete Registration'}
        </Button>
      </motion.div>

      {/* Minimum members requirement message */}
      {teamSizeLimits && members.length < teamSizeLimits.min && (
        <motion.p
          className="text-sm text-gray-600 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Add at least {teamSizeLimits.min} member{teamSizeLimits.min > 1 ? 's' : ''} to continue
        </motion.p>
      )}
    </motion.div>
  );
});

TeamMembersForm.displayName = 'TeamMembersForm';
