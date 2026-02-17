import { useFormContext, useFieldArray, useWatch } from 'react-hook-form';
import { Plus, Trash2, User } from 'lucide-react';
import { BRANCHES, YEARS_OF_STUDY, type RegistrationFormData } from '@/types/registration';
import { capitalizeName, formatPhoneNumber, preventNonNumeric } from '@/utils/formUtils';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

interface TeamMembersStepProps {
    squadSize: number;
}

// Extract only the team registration part of the union type
type TeamFormData = Extract<RegistrationFormData, { registrationType: 'team' }>;

const TeamMembersStep = ({ squadSize }: TeamMembersStepProps) => {
    // Explicitly type the context as TeamFormData to avoid "property does not exist" errors on union
    const { register, control, setValue, formState: { errors } } = useFormContext<TeamFormData>();

    // Watch leader's college to sync with members
    const leaderCollege = useWatch({
        control,
        name: 'teamLeader.college'
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'teamMembers',
    });

    // Auto-update existing members when leader's college changes
    useEffect(() => {
        if (leaderCollege) {
            fields.forEach((_, index) => {
                setValue(`teamMembers.${index}.college`, leaderCollege);
            });
        }
    }, [leaderCollege, fields.length, setValue]); // Dependencies: updates when leader changes or members added

    const requiredMembers = squadSize - 1;
    const canAddMore = fields.length < requiredMembers;

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-4 flex-shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00D9FF] to-blue-500 flex items-center justify-center shadow-lg shadow-[#00D9FF]/20">
                        <div className="flex -space-x-1">
                            <User className="w-4 h-4 text-white" />
                            <User className="w-4 h-4 text-white/70" />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white leading-tight">Team Members</h3>
                        <p className="text-[#00D9FF]/60 text-xs">Add {requiredMembers} members (excluding yourself)</p>
                    </div>
                </div>
            </div>

            {/* Scrollable Members List */}
            <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar space-y-3 -mx-2 px-2 pb-4">
                <AnimatePresence>
                    {fields.map((field, index) => (
                        <motion.div
                            key={field.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="bg-[#1A1A2E]/50 border border-[#00D9FF]/20 rounded-xl p-4 relative group hover:border-[#00D9FF]/50 transition-colors"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <span className="text-[#00D9FF] font-bold text-sm bg-[#00D9FF]/10 px-2 py-1 rounded">Member {index + 1}</span>
                                <button
                                    type="button"
                                    onClick={() => remove(index)}
                                    className="text-gray-500 hover:text-red-400 p-1 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {/* Name */}
                                <div className="space-y-1">
                                    <input
                                        {...register(`teamMembers.${index}.name`)}
                                        onBlur={(e) => {
                                            const formatted = capitalizeName(e.target.value);
                                            e.target.value = formatted;
                                            register(`teamMembers.${index}.name`).onChange(e);
                                        }}
                                        placeholder="Full Name"
                                        className="w-full bg-[#0a192f] border border-[#00D9FF]/30 text-white px-3 py-2.5 rounded text-[16px] focus:border-[#00D9FF] outline-none min-h-[44px]"
                                    />
                                    {errors.teamMembers?.[index]?.name && (
                                        <p className="text-red-400 text-[10px]">{errors.teamMembers[index]?.name?.message}</p>
                                    )}
                                </div>

                                {/* Email */}
                                <div className="space-y-1">
                                    <input
                                        {...register(`teamMembers.${index}.email`)}
                                        placeholder="Email Address"
                                        className="w-full bg-[#0a192f] border border-[#00D9FF]/30 text-white px-3 py-2.5 rounded text-[16px] focus:border-[#00D9FF] outline-none min-h-[44px]"
                                    />
                                    {errors.teamMembers?.[index]?.email && (
                                        <p className="text-red-400 text-[10px]">{errors.teamMembers[index]?.email?.message}</p>
                                    )}
                                </div>

                                {/* Phone */}
                                <div className="space-y-1">
                                    <input
                                        {...register(`teamMembers.${index}.phone`)}
                                        onKeyDown={preventNonNumeric}
                                        onBlur={(e) => {
                                            const formatted = formatPhoneNumber(e.target.value);
                                            if (formatted) {
                                                e.target.value = formatted;
                                                register(`teamMembers.${index}.phone`).onChange(e);
                                            }
                                        }}
                                        maxLength={13}
                                        placeholder="Phone"
                                        className="w-full bg-[#0a192f] border border-[#00D9FF]/30 text-white px-3 py-2.5 rounded text-[16px] focus:border-[#00D9FF] outline-none min-h-[44px]"
                                    />
                                    {errors.teamMembers?.[index]?.phone && (
                                        <p className="text-red-400 text-[10px]">{errors.teamMembers[index]?.phone?.message}</p>
                                    )}
                                </div>

                                {/* College (Read-only, synced with leader) */}
                                <div className="space-y-1">
                                    <input
                                        {...register(`teamMembers.${index}.college`)}
                                        readOnly
                                        placeholder="College (Same as Leader)"
                                        className="w-full bg-[#0a192f]/50 border border-[#00D9FF]/10 text-white/50 px-3 py-2.5 rounded text-[16px] outline-none min-h-[44px] cursor-not-allowed"
                                        title="Team members must be from the same college as the leader"
                                    />
                                    {errors.teamMembers?.[index]?.college && (
                                        <p className="text-red-400 text-[10px]">{errors.teamMembers[index]?.college?.message}</p>
                                    )}
                                </div>

                                {/* Branch */}
                                <div className="space-y-1">
                                    <select
                                        {...register(`teamMembers.${index}.branch`)}
                                        className="w-full bg-[#1A1A2E] border border-[#00D9FF]/30 text-white px-3 py-2.5 rounded text-[16px] focus:border-[#00D9FF] outline-none min-h-[44px]"
                                    >
                                        <option value="">Branch</option>
                                        {BRANCHES.map(b => (
                                            <option key={b} value={b}>{b}</option>
                                        ))}
                                    </select>
                                    {errors.teamMembers?.[index]?.branch && (
                                        <p className="text-red-400 text-[10px]">{errors.teamMembers[index]?.branch?.message}</p>
                                    )}
                                </div>

                                {/* Year */}
                                <div className="space-y-1">
                                    <select
                                        {...register(`teamMembers.${index}.yearOfStudy`)}
                                        className="w-full bg-[#1A1A2E] border border-[#00D9FF]/30 text-white px-3 py-2.5 rounded text-[16px] focus:border-[#00D9FF] outline-none min-h-[44px]"
                                    >
                                        <option value="">Year</option>
                                        {YEARS_OF_STUDY.map(y => (
                                            <option key={y} value={y}>{y}</option>
                                        ))}
                                    </select>
                                    {errors.teamMembers?.[index]?.yearOfStudy && (
                                        <p className="text-red-400 text-[10px]">{errors.teamMembers[index]?.yearOfStudy?.message}</p>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {fields.length === 0 && (
                    <div className="h-40 flex flex-col items-center justify-center border-2 border-dashed border-[#00D9FF]/20 rounded-xl bg-[#0a192f]/30">
                        <User className="w-10 h-10 text-gray-600 mb-2" />
                        <p className="text-gray-400 text-sm">Add team members to proceed</p>
                    </div>
                )}
            </div>

            {/* Add Button - Fixed at bottom of section */}
            <div className="pt-4 mt-auto border-t border-[#00D9FF]/10">
                {canAddMore ? (
                    <button
                        type="button"
                        onClick={() =>
                            append({
                                name: '',
                                email: '',
                                phone: '',
                                college: leaderCollege || '', // Auto-fill with leader's college
                                branch: '' as any,
                                yearOfStudy: '' as any,
                            })
                        }
                        className="w-full py-3 bg-[#00D9FF]/10 hover:bg-[#00D9FF]/20 border border-[#00D9FF]/50 text-[#00D9FF] rounded-xl font-bold flex items-center justify-center gap-2 transition-all uppercase tracking-wide text-sm shadow-[0_0_15px_rgba(0,217,255,0.1)]"
                    >
                        <Plus className="w-4 h-4" />
                        Add Member ({fields.length}/{requiredMembers})
                    </button>
                ) : (
                    <div className="w-full py-3 bg-[#00D9FF]/5 border border-[#00D9FF]/20 text-[#00D9FF]/50 rounded-xl font-medium flex items-center justify-center gap-2 text-sm cursor-not-allowed">
                        Squad Full ({fields.length}/{requiredMembers})
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeamMembersStep;
