import { useFormContext, useFieldArray } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import { BRANCHES, YEARS_OF_STUDY, type RegistrationFormData } from '@/types/registration';
import PowerShellInput from '../PowerShellInput';

interface TeamMembersStepProps {
    squadSize: number;
}

const TeamMembersStep = ({ squadSize }: TeamMembersStepProps) => {
    const { register, control, formState: { errors } } = useFormContext<RegistrationFormData>();
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'teamMembers' as any,
    });

    const requiredMembers = squadSize - 1; // Excluding leader
    const canAddMore = fields.length < requiredMembers;
    const canRemove = fields.length > 0;

    return (
        <div className="space-y-6">
            <div className="text-[#00FF00] mb-6">
                <div className="mb-2">&gt; ADD-MEMBERS -Count {requiredMembers}</div>
                <div className="text-gray-400 text-sm">
                    Add {requiredMembers} team member{requiredMembers > 1 ? 's' : ''} (excluding leader)
                </div>
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
                    className="w-full py-3 bg-[#00FF00]/10 hover:bg-[#00FF00]/20 border-2 border-[#00FF00] text-[#00FF00] rounded font-bold flex items-center justify-center gap-2 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    ADD TEAM MEMBER [{fields.length + 1}/{requiredMembers}]
                </button>
            )}

            {/* Team Members List */}
            <div className="space-y-6">
                {fields.map((field, index) => (
                    <div
                        key={field.id}
                        className="p-4 bg-black/30 border border-[#0178D4]/50 rounded space-y-4"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="text-white font-bold text-sm">
                                MEMBER {index + 1}/{requiredMembers}
                            </div>
                            {canRemove && (
                                <button
                                    type="button"
                                    onClick={() => remove(index)}
                                    className="text-red-500 hover:text-red-400 hover:bg-red-500/10 p-2 rounded transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        <PowerShellInput
                            label="NAME"
                            error={(errors as any).teamMembers?.[index]?.name?.message}
                        >
                            <input
                                {...register(`teamMembers.${index}.name` as any)}
                                type="text"
                                placeholder="Member full name"
                                className="w-full bg-black border-2 border-[#0178D4] text-[#00FF00] px-4 py-2 rounded focus:outline-none focus:border-[#00FF00] font-mono placeholder-gray-600 text-sm"
                            />
                        </PowerShellInput>

                        <PowerShellInput
                            label="EMAIL"
                            error={(errors as any).teamMembers?.[index]?.email?.message}
                        >
                            <input
                                {...register(`teamMembers.${index}.email` as any)}
                                type="email"
                                placeholder="member@example.com"
                                className="w-full bg-black border-2 border-[#0178D4] text-[#00FF00] px-4 py-2 rounded focus:outline-none focus:border-[#00FF00] font-mono placeholder-gray-600 text-sm"
                            />
                        </PowerShellInput>

                        <PowerShellInput
                            label="PHONE"
                            error={(errors as any).teamMembers?.[index]?.phone?.message}
                        >
                            <input
                                {...register(`teamMembers.${index}.phone` as any)}
                                type="tel"
                                placeholder="+91 XXXXX XXXXX"
                                className="w-full bg-black border-2 border-[#0178D4] text-[#00FF00] px-4 py-2 rounded focus:outline-none focus:border-[#00FF00] font-mono placeholder-gray-600 text-sm"
                            />
                        </PowerShellInput>

                        <PowerShellInput
                            label="COLLEGE"
                            error={(errors as any).teamMembers?.[index]?.college?.message}
                        >
                            <input
                                {...register(`teamMembers.${index}.college` as any)}
                                type="text"
                                placeholder="College name"
                                className="w-full bg-black border-2 border-[#0178D4] text-[#00FF00] px-4 py-2 rounded focus:outline-none focus:border-[#00FF00] font-mono placeholder-gray-600 text-sm"
                            />
                        </PowerShellInput>

                        <div className="grid grid-cols-2 gap-4">
                            <PowerShellInput
                                label="BRANCH"
                                error={(errors as any).teamMembers?.[index]?.branch?.message}
                            >
                                <select
                                    {...register(`teamMembers.${index}.branch` as any)}
                                    className="w-full bg-black border-2 border-[#0178D4] text-[#00FF00] px-4 py-2 rounded focus:outline-none focus:border-[#00FF00] font-mono text-sm"
                                >
                                    <option value="" className="bg-black">
                                        -- Select --
                                    </option>
                                    {BRANCHES.map((branch) => (
                                        <option key={branch} value={branch} className="bg-black">
                                            {branch}
                                        </option>
                                    ))}
                                </select>
                            </PowerShellInput>

                            <PowerShellInput
                                label="YEAR"
                                error={(errors as any).teamMembers?.[index]?.yearOfStudy?.message}
                            >
                                <select
                                    {...register(`teamMembers.${index}.yearOfStudy` as any)}
                                    className="w-full bg-black border-2 border-[#0178D4] text-[#00FF00] px-4 py-2 rounded focus:outline-none focus:border-[#00FF00] font-mono text-sm"
                                >
                                    <option value="" className="bg-black">
                                        -- Select --
                                    </option>
                                    {YEARS_OF_STUDY.map((year) => (
                                        <option key={year} value={year} className="bg-black">
                                            {year}
                                        </option>
                                    ))}
                                </select>
                            </PowerShellInput>
                        </div>
                    </div>
                ))}
            </div>

            {fields.length === 0 && (
                <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-700 rounded">
                    Click "ADD TEAM MEMBER" to start adding members
                </div>
            )}

            {fields.length < requiredMembers && fields.length > 0 && (
                <div className="text-yellow-500 text-sm border border-yellow-500/30 bg-yellow-500/5 p-3 rounded">
                    ⚠ Warning: You need to add {requiredMembers - fields.length} more member
                    {requiredMembers - fields.length > 1 ? 's' : ''}
                </div>
            )}
        </div>
    );
};

export default TeamMembersStep;
