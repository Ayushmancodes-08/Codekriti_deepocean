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
  listItemVariants,
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



  const watchedBranch = watch('branch');
  const watchedYear = watch('year');
  const watchedCollege = watch('college');

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



  const canAddMore = !teamSizeLimits || members.length < teamSizeLimits.max;
  const canSubmit = teamSizeLimits && members.length >= teamSizeLimits.min;

  const handleAddMember = async (data: TeamMember) => {
    try {
      clearErrors();
      setIsSubmittingForm(true);

      if (editingIndex !== null) {
        // Update existing member
        const processedData = { ...data };
        if (processedData.branch === 'Other' && (data as any).branchCustom) processedData.branch = (data as any).branchCustom;
        if (processedData.year === 'Other' && (data as any).yearCustom) processedData.year = (data as any).yearCustom;
        if (processedData.college === 'Other' && (data as any).collegeCustom) processedData.college = (data as any).collegeCustom;

        const updatedMembers = [...members];
        updatedMembers[editingIndex] = processedData;
        setMembers(updatedMembers);
        setEditingIndex(null);
      } else {
        // Add new member
        const processedData = { ...data };
        if (processedData.branch === 'Other' && (data as any).branchCustom) processedData.branch = (data as any).branchCustom;
        if (processedData.year === 'Other' && (data as any).yearCustom) processedData.year = (data as any).yearCustom;
        if (processedData.college === 'Other' && (data as any).collegeCustom) processedData.college = (data as any).collegeCustom;

        setMembers([...members, processedData]);
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
    // If values are not in standard lists, set them as 'Other' and populate custom fields?
    // This is complex because we already flattened them. 
    // Simplified: We assume editing just loads value. If not in list, logic might need 'Other'. 
    // ideally we should check if member.branch is in BRANCHES. If not, set 'Other' and 'branchCustom' to member.branch.
    if (!BRANCHES.includes(member.branch)) {
      setValue('branch', 'Other');
      setValue('branchCustom' as any, member.branch);
    }
    if (!YEARS.includes(member.year)) {
      setValue('year', 'Other');
      setValue('yearCustom' as any, member.year);
    }
    if (!COLLEGES.includes(member.college)) {
      setValue('college', 'Other');
      setValue('collegeCustom' as any, member.college);
    }
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
        <h3 className="text-lg font-semibold text-white mb-2">Add Team Members</h3>
        {teamSizeLimits && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">
              {members.length} of {teamSizeLimits.max} members added
            </p>
            <div className="w-full max-w-xs bg-gray-700 rounded-full h-2 ml-4">
              <div
                className="bg-cyan-500 h-2 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                style={{
                  width: `${(members.length / teamSizeLimits.max) * 100}%`,
                }}
              />
            </div>
          </div>
        )}
      </motion.div>

      {/* Members List */}
      <motion.div className="space-y-3" variants={fieldVariantsAccessible}>
        <AnimatePresence>
          {members.map((member, index) => (
            <motion.div
              key={`${member.email}-${index}`}
              className="bg-[#0a192f] border border-gray-700 rounded-lg p-4 flex items-center justify-between hover:border-cyan-500/50 transition-all hover:shadow-[0_0_15px_rgba(6,182,212,0.1)]"
              variants={memberCardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="flex-1">
                <p className="font-medium text-white">{member.name}</p>
                <p className="text-sm text-gray-400">{member.email}</p>
                <p className="text-xs text-gray-500 mt-1">
                  <span className="bg-gray-800 px-2 py-1 rounded text-cyan-400 border border-gray-700">
                    {member.branch}
                  </span>
                  <span className="mx-2 text-gray-600">•</span>
                  <span className="bg-gray-800 px-2 py-1 rounded text-cyan-400 border border-gray-700">
                    {member.year}
                  </span>
                </p>
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  type="button"
                  onClick={() => handleEditMember(index)}
                  className="p-3 md:p-2 text-cyan-400 hover:bg-cyan-900/30 active:bg-cyan-900/50 rounded-lg transition-colors min-h-11 min-w-11 md:min-h-9 md:min-w-9 flex items-center justify-center touch-manipulation border border-transparent hover:border-cyan-500/30"
                  aria-label={`Edit ${member.name}`}
                >
                  <Edit2 size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => handleRemoveMember(index)}
                  className="p-3 md:p-2 text-red-400 hover:bg-red-900/30 active:bg-red-900/50 rounded-lg transition-colors min-h-11 min-w-11 md:min-h-9 md:min-w-9 flex items-center justify-center touch-manipulation border border-transparent hover:border-red-500/30"
                  aria-label={`Remove ${member.name}`}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {members.length === 0 && !showForm && (
          <motion.div
            className="text-center py-12 border-2 border-dashed border-gray-700 rounded-lg bg-[#0a192f]/50"
            variants={fieldVariantsAccessible}
          >
            <p className="text-gray-400 mb-2">No members added yet</p>
            <p className="text-sm text-gray-500">Click "Add Member" below to get started</p>
          </motion.div>
        )}
      </motion.div>

      {/* Add/Edit Member Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            className="bg-[#0a192f] border border-cyan-500/30 rounded-lg p-6 space-y-4 shadow-[0_0_20px_rgba(6,182,212,0.1)]"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <h4 className="font-semibold text-white border-b border-gray-700 pb-2">
              {editingIndex !== null ? 'Edit Member Details' : 'Add New Member'}
            </h4>

            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 pt-2">
              {/* Name Field */}
              <motion.div className="space-y-2" variants={fieldVariantsAccessible}>
                <Label htmlFor="memberName" className="text-sm font-medium text-gray-300">
                  Full Name <span className="text-cyan-400">*</span>
                </Label>
                <Input
                  id="memberName"
                  placeholder="Enter member's full name"
                  {...register('name')}
                  className={`bg-[#112240] border-gray-700 text-white placeholder:text-gray-500 transition-all ${errors.name
                      ? 'border-red-500 focus:ring-red-500'
                      : 'focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400'
                    }`}
                  aria-invalid={errors.name ? 'true' : 'false'}
                  aria-describedby={errors.name ? 'memberName-error' : undefined}
                />
                {errors.name && (
                  <motion.p
                    id="memberName-error"
                    className="text-sm text-red-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {errors.name.message}
                  </motion.p>
                )}
              </motion.div>

              {/* College Field */}
              <motion.div className="space-y-2" variants={fieldVariantsAccessible}>
                <Label htmlFor="memberCollege" className="text-sm font-medium text-gray-300">
                  College <span className="text-cyan-400">*</span>
                </Label>
                <Select onValueChange={(value) => setValue('college', value)}>
                  <SelectTrigger
                    id="memberCollege"
                    className={`bg-[#112240] border-gray-700 text-white transition-all ${errors.college
                        ? 'border-red-500'
                        : 'focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400'
                      }`}
                    aria-invalid={errors.college ? 'true' : 'false'}
                    aria-describedby={errors.college ? 'memberCollege-error' : undefined}
                  >
                    <SelectValue placeholder="Select college" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#112240] border-gray-700 text-white">
                    {COLLEGES.map((college) => (
                      <SelectItem key={college} value={college} className="focus:bg-cyan-900/50 focus:text-cyan-400">
                        {college}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.college && (
                  <motion.p
                    id="memberCollege-error"
                    className="text-sm text-red-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {errors.college.message}
                  </motion.p>
                )}
              </motion.div>

              {/* Custom College Input */}
              {watchedCollege === 'Other' && (
                <motion.div className="space-y-2" variants={fieldVariantsAccessible}>
                  <Label htmlFor="memberCollegeCustom" className="text-sm font-medium text-gray-300">
                    Enter College Name <span className="text-cyan-400">*</span>
                  </Label>
                  <Input
                    id="memberCollegeCustom"
                    placeholder="Enter college name"
                    {...register('collegeCustom' as any)}
                    className="bg-[#112240] border-gray-700 text-white placeholder:text-gray-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                  />
                </motion.div>
              )}

              {/* Student ID Field */}
              <motion.div className="space-y-2" variants={fieldVariantsAccessible}>
                <Label htmlFor="memberStudentId" className="text-sm font-medium text-gray-300">
                  Student ID <span className="text-cyan-400">*</span>
                </Label>
                <Input
                  id="memberStudentId"
                  placeholder="Enter student ID"
                  {...register('studentId')}
                  className={`bg-[#112240] border-gray-700 text-white placeholder:text-gray-500 transition-all ${errors.studentId
                      ? 'border-red-500 focus:ring-red-500'
                      : 'focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400'
                    }`}
                  aria-invalid={errors.studentId ? 'true' : 'false'}
                  aria-describedby={errors.studentId ? 'memberStudentId-error' : undefined}
                />
                {errors.studentId && (
                  <motion.p
                    id="memberStudentId-error"
                    className="text-sm text-red-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {errors.studentId.message}
                  </motion.p>
                )}
              </motion.div>

              {/* Phone Number Field */}
              <motion.div className="space-y-2" variants={fieldVariantsAccessible}>
                <Label htmlFor="memberPhone" className="text-sm font-medium text-gray-300">
                  Phone Number <span className="text-cyan-400">*</span>
                </Label>
                <Input
                  id="memberPhone"
                  type="tel"
                  placeholder="Enter 10-digit phone number"
                  {...register('phoneNumber')}
                  className={`bg-[#112240] border-gray-700 text-white placeholder:text-gray-500 transition-all ${errors.phoneNumber
                      ? 'border-red-500 focus:ring-red-500'
                      : 'focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400'
                    }`}
                  aria-invalid={errors.phoneNumber ? 'true' : 'false'}
                  aria-describedby={errors.phoneNumber ? 'memberPhone-error' : undefined}
                />
                {errors.phoneNumber && (
                  <motion.p
                    id="memberPhone-error"
                    className="text-sm text-red-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {errors.phoneNumber.message}
                  </motion.p>
                )}
              </motion.div>

              {/* Email Field */}
              <motion.div className="space-y-2" variants={fieldVariantsAccessible}>
                <Label htmlFor="memberEmail" className="text-sm font-medium text-gray-300">
                  Email <span className="text-cyan-400">*</span>
                </Label>
                <Input
                  id="memberEmail"
                  type="email"
                  placeholder="Enter email address"
                  {...register('email')}
                  className={`bg-[#112240] border-gray-700 text-white placeholder:text-gray-500 transition-all ${errors.email
                      ? 'border-red-500 focus:ring-red-500'
                      : 'focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400'
                    }`}
                  aria-invalid={errors.email ? 'true' : 'false'}
                  aria-describedby={errors.email ? 'memberEmail-error' : undefined}
                />
                {errors.email && (
                  <motion.p
                    id="memberEmail-error"
                    className="text-sm text-red-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {errors.email.message}
                  </motion.p>
                )}
              </motion.div>

              {/* Branch Field */}
              <motion.div className="space-y-2" variants={fieldVariantsAccessible}>
                <Label htmlFor="memberBranch" className="text-sm font-medium text-gray-300">
                  Branch <span className="text-cyan-400">*</span>
                </Label>
                <Select onValueChange={(value) => setValue('branch', value)}>
                  <SelectTrigger
                    id="memberBranch"
                    className={`bg-[#112240] border-gray-700 text-white transition-all ${errors.branch
                        ? 'border-red-500'
                        : 'focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400'
                      }`}
                    aria-invalid={errors.branch ? 'true' : 'false'}
                    aria-describedby={errors.branch ? 'memberBranch-error' : undefined}
                  >
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#112240] border-gray-700 text-white">
                    {BRANCHES.map((branch) => (
                      <SelectItem key={branch} value={branch} className="focus:bg-cyan-900/50 focus:text-cyan-400">
                        {branch}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.branch && (
                  <motion.p
                    id="memberBranch-error"
                    className="text-sm text-red-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {errors.branch.message}
                  </motion.p>
                )}
              </motion.div>

              {/* Custom Branch Input */}
              {watchedBranch === 'Other' && (
                <motion.div className="space-y-2" variants={fieldVariantsAccessible}>
                  <Label htmlFor="memberBranchCustom" className="text-sm font-medium text-gray-300">
                    Enter Branch Name <span className="text-cyan-400">*</span>
                  </Label>
                  <Input
                    id="memberBranchCustom"
                    placeholder="Enter branch name"
                    {...register('branchCustom' as any)}
                    className="bg-[#112240] border-gray-700 text-white placeholder:text-gray-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                  />
                </motion.div>
              )}

              {/* Year Field */}
              <motion.div className="space-y-2" variants={fieldVariantsAccessible}>
                <Label htmlFor="memberYear" className="text-sm font-medium text-gray-300">
                  Year <span className="text-cyan-400">*</span>
                </Label>
                <Select onValueChange={(value) => setValue('year', value)}>
                  <SelectTrigger
                    id="memberYear"
                    className={`bg-[#112240] border-gray-700 text-white transition-all ${errors.year
                        ? 'border-red-500'
                        : 'focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400'
                      }`}
                    aria-invalid={errors.year ? 'true' : 'false'}
                    aria-describedby={errors.year ? 'memberYear-error' : undefined}
                  >
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#112240] border-gray-700 text-white">
                    {YEARS.map((year) => (
                      <SelectItem key={year} value={year} className="focus:bg-cyan-900/50 focus:text-cyan-400">
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.year && (
                  <motion.p
                    id="memberYear-error"
                    className="text-sm text-red-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {errors.year.message}
                  </motion.p>
                )}
              </motion.div>

              {/* Custom Year Input */}
              {watchedYear === 'Other' && (
                <motion.div className="space-y-2" variants={fieldVariantsAccessible}>
                  <Label htmlFor="memberYearCustom" className="text-sm font-medium text-gray-300">
                    Enter Year <span className="text-cyan-400">*</span>
                  </Label>
                  <Input
                    id="memberYearCustom"
                    placeholder="Enter year (e.g., 5th Year)"
                    {...register('yearCustom' as any)}
                    className="bg-[#112240] border-gray-700 text-white placeholder:text-gray-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                  />
                </motion.div>
              )}

              {/* Form Action Buttons */}
              <motion.div variants={fieldVariantsAccessible} className="pt-4 flex gap-3">
                <Button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={isSubmittingForm || isLoading}
                  variant="outline"
                  className="flex-1 min-h-11 md:min-h-10 touch-manipulation border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmittingForm || isLoading}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 md:py-2 px-4 rounded-lg transition-all duration-200 min-h-11 md:min-h-10 touch-manipulation shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_20px_rgba(6,182,212,0.5)]"
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
          className="w-full py-3 md:py-2 px-4 border-2 border-dashed border-cyan-500/50 rounded-lg text-cyan-400 font-semibold hover:bg-cyan-900/20 active:bg-cyan-900/30 transition-all flex items-center justify-center gap-2 min-h-11 md:min-h-10 touch-manipulation hover:border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.05)] hover:shadow-[0_0_20px_rgba(6,182,212,0.1)]"
          variants={fieldVariantsAccessible}
        >
          <Plus size={20} />
          Add Member
        </motion.button>
      )}

      {/* Error Message */}
      {formState.errors?.submit && (
        <motion.div
          className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 text-red-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {formState.errors.submit}
        </motion.div>
      )}

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
          type="button"
          onClick={handleFinalSubmit}
          disabled={!canSubmit || isSubmitting || isLoading}
          className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold py-3 md:py-2 px-4 rounded-lg transition-all duration-200 min-h-11 md:min-h-10 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_20px_rgba(16,185,129,0.5)]"
        >
          {isSubmitting || isLoading ? 'Submitting...' : 'Complete Registration'}
        </Button>
      </motion.div>

      {/* Minimum members requirement message */}
      {teamSizeLimits && members.length < teamSizeLimits.min && (
        <motion.p
          className="text-sm text-gray-400 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Add at least {teamSizeLimits.min} member{teamSizeLimits.min > 1 ? 's' : ''} to continue
        </motion.p>
      )}
    </motion.div >
  );
});

TeamMembersForm.displayName = 'TeamMembersForm';
