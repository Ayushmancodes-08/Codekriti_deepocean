import { useFormContext, useFieldArray } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Users, Plus, X, Mail } from 'lucide-react';
import type { RegistrationFormData } from '@/types/legacy-registration';
import FormField from '../FormField';

const TeamInfoStep = () => {
    const { register, control, formState: { errors }, watch } = useFormContext<RegistrationFormData>();
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'teamMembers',
    });

    const selectedEvents = watch('selectedEvents') || [];
    const requiresTeam = selectedEvents.length > 0; // Simplified check

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="mb-8">
                <h3 className="text-2xl font-bold text-cyan-300 mb-2">Team Information</h3>
                <p className="text-cyan-400/70">
                    {requiresTeam
                        ? 'Build your crew for the deep-sea adventure'
                        : 'This section is optional'}
                </p>
            </div>

            <FormField
                label="Team Name (Optional)"
                icon={<Users className="w-5 h-5" />}
                error={errors.teamName?.message}
            >
                <input
                    {...register('teamName')}
                    type="text"
                    placeholder="Enter your team name"
                    className="w-full px-4 py-3 bg-cyan-950/30 border border-cyan-500/30 rounded-lg text-cyan-100 placeholder-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                />
            </FormField>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <label className="text-cyan-300 font-medium">Team Members (Optional)</label>
                    {fields.length < 4 && (
                        <button
                            type="button"
                            onClick={() => append({ name: '', email: '' })}
                            className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 rounded-lg transition-all border border-cyan-500/30"
                        >
                            <Plus className="w-4 h-4" />
                            Add Member
                        </button>
                    )}
                </div>

                {fields.length === 0 && (
                    <div className="p-6 bg-cyan-950/20 border border-cyan-700/30 rounded-lg text-center">
                        <Users className="w-12 h-12 text-cyan-600 mx-auto mb-3" />
                        <p className="text-cyan-400/70 text-sm">
                            No team members added yet. Click "Add Member" to start building your team.
                        </p>
                    </div>
                )}

                {fields.map((field, index) => (
                    <motion.div
                        key={field.id}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-4 bg-cyan-950/20 border border-cyan-700/30 rounded-lg space-y-3"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="text-cyan-300 font-medium">Member {index + 1}</h4>
                            <button
                                type="button"
                                onClick={() => remove(index)}
                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-1 rounded transition-all"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-3">
                            <FormField
                                label="Name"
                                icon={<Users className="w-4 h-4" />}
                                error={errors.teamMembers?.[index]?.name?.message}
                            >
                                <input
                                    {...register(`teamMembers.${index}.name` as const)}
                                    type="text"
                                    placeholder="Member name"
                                    className="w-full px-4 py-2 bg-cyan-950/30 border border-cyan-500/30 rounded-lg text-cyan-100 placeholder-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all text-sm"
                                />
                            </FormField>

                            <FormField
                                label="Email"
                                icon={<Mail className="w-4 h-4" />}
                                error={errors.teamMembers?.[index]?.email?.message}
                            >
                                <input
                                    {...register(`teamMembers.${index}.email` as const)}
                                    type="email"
                                    placeholder="member@example.com"
                                    className="w-full px-4 py-2 bg-cyan-950/30 border border-cyan-500/30 rounded-lg text-cyan-100 placeholder-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all text-sm"
                                />
                            </FormField>
                        </div>
                    </motion.div>
                ))}

                {fields.length > 0 && (
                    <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                        <p className="text-cyan-300 text-sm">
                            <strong>Team Size:</strong> {fields.length + 1} members (including you)
                        </p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default TeamInfoStep;
