import { useFormContext, useFieldArray } from 'react-hook-form';
import { Plus, Trash2, User, Mail, Phone, School, BookOpen, Calendar } from 'lucide-react';
import { BRANCHES, YEARS_OF_STUDY, type RegistrationFormData } from '@/types/registration';
import OceanInput from '../OceanInput';
import { motion } from 'framer-motion';

interface TeamMembersStepProps {
    squadSize: number;
}

const TeamMembersStep = ({ squadSize }: TeamMembersStepProps) => {
    const { register, control, formState: { errors } } = useFormContext<RegistrationFormData>();
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'teamMembers' as any,
    });

    const requiredMembers = squadSize - 1;
    const canAddMore = fields.length < requiredMembers;

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-2">Team Members</h3>
                <p className="text-gray-400">Add {requiredMembers} team member{requiredMembers > 1 ? 's' : ''} (excluding leader)</p>
            </div>

            {/* Add Member Button */}
            {canAddMore && (
                <button
                    type="button"
                    onClick={() =>
                        append({
                            name: '',
                            email: '',
                            phone: '',
                            college: '',
                            branch: '' as any,
                            yearOfStudy: '' as any,
                        })
                    }
                    className="w-full py-4 bg-gradient-to-r from-[#00D9FF]/10 to-blue-500/10 hover:from-[#00D9FF]/20 hover:to-blue-500/20 border-2 border-dashed border-[#00D9FF] text-[#00D9FF] rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                >
                    <Plus className="w-5 h-5" />
                    Add Team Member ({fields.length + 1}/{requiredMembers})
                </button>
            )}

            {/* Members List */}
            <div className="space-y-6">
                {fields.map((field, index) => (
                    <motion.div
                        key={field.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-6 bg-[#1A1A2E]/50 border border-[#00D9FF]/20 rounded-xl"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h4 className="text-lg font-bold text-[#00D9FF] flex items-center gap-2">
                                <User className="w-5 h-5" />
                                Member {index + 1}
                            </h4>
                            <button
                                type="button"
                                onClick={() => remove(index)}
                                className="text-cyan-400 hover:text-[#00D9FF] hover:bg-[#00D9FF]/10 p-2 rounded-lg transition-all"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <OceanInput
                                label="Name"
                                icon={User}
                                error={(errors as any).teamMembers?.[index]?.name?.message}
                            >
                                <input
                                    {...register(`teamMembers.${index}.name` as any)}
                                    type="text"
                                    placeholder="Member's full name"
                                    className="w-full bg-[#0a192f] border-2 border-[#00D9FF]/30 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-[#00D9FF] transition-all placeholder-gray-500 text-sm"
                                />
                            </OceanInput>

                            <OceanInput
                                label="Email"
                                icon={Mail}
                                error={(errors as any).teamMembers?.[index]?.email?.message}
                            >
                                <input
                                    {...register(`teamMembers.${index}.email` as any)}
                                    type="email"
                                    placeholder="member@example.com"
                                    className="w-full bg-[#0a192f] border-2 border-[#00D9FF]/30 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-[#00D9FF] transition-all placeholder-gray-500 text-sm"
                                />
                            </OceanInput>

                            <OceanInput
                                label="Phone"
                                icon={Phone}
                                error={(errors as any).teamMembers?.[index]?.phone?.message}
                            >
                                <input
                                    {...register(`teamMembers.${index}.phone` as any)}
                                    type="tel"
                                    placeholder="+91 XXXXX XXXXX"
                                    className="w-full bg-[#0a192f] border-2 border-[#00D9FF]/30 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-[#00D9FF] transition-all placeholder-gray-500 text-sm"
                                />
                            </OceanInput>

                            <OceanInput
                                label="College"
                                icon={School}
                                error={(errors as any).teamMembers?.[index]?.college?.message}
                            >
                                <input
                                    {...register(`teamMembers.${index}.college` as any)}
                                    type="text"
                                    placeholder="Institution name"
                                    className="w-full bg-[#0a192f] border-2 border-[#00D9FF]/30 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-[#00D9FF] transition-all placeholder-gray-500 text-sm"
                                />
                            </OceanInput>

                            <OceanInput
                                label="Branch"
                                icon={BookOpen}
                                error={(errors as any).teamMembers?.[index]?.branch?.message}
                            >
                                <select
                                    {...register(`teamMembers.${index}.branch` as any)}
                                    className="w-full bg-[#1A1A2E] border-2 border-[#00D9FF]/30 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-[#00D9FF] transition-all text-sm"
                                >
                                    <option value="" className="bg-[#1A1A2E]">
                                        Select branch
                                    </option>
                                    {BRANCHES.map((branch) => (
                                        <option key={branch} value={branch} className="bg-[#1A1A2E]">
                                            {branch}
                                        </option>
                                    ))}
                                </select>
                            </OceanInput>

                            <OceanInput
                                label="Year"
                                icon={Calendar}
                                error={(errors as any).teamMembers?.[index]?.yearOfStudy?.message}
                            >
                                <select
                                    {...register(`teamMembers.${index}.yearOfStudy` as any)}
                                    className="w-full bg-[#1A1A2E] border-2 border-[#00D9FF]/30 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-[#00D9FF] transition-all text-sm"
                                >
                                    <option value="" className="bg-[#1A1A2E]">
                                        Select year
                                    </option>
                                    {YEARS_OF_STUDY.map((year) => (
                                        <option key={year} value={year} className="bg-[#1A1A2E]">
                                            {year}
                                        </option>
                                    ))}
                                </select>
                            </OceanInput>
                        </div>
                    </motion.div>
                ))}
            </div>

            {fields.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed border-[#00D9FF]/20 rounded-xl">
                    <User className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                    <p className="text-gray-500">Click "Add Team Member" to start adding squad members</p>
                </div>
            )}

            {fields.length < requiredMembers && fields.length > 0 && (
                <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl flex items-center gap-3">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                    <p className="text-cyan-400 text-sm font-medium">
                        You need to add {requiredMembers - fields.length} more member{requiredMembers - fields.length > 1 ? 's' : ''}
                    </p>
                </div>
            )}
        </div>
    );
};

export default TeamMembersStep;
