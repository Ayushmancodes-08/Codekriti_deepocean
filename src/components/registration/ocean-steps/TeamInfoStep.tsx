import { useFormContext } from 'react-hook-form';
import { Users, User, Mail, Phone, School, BookOpen, Calendar } from 'lucide-react';
import { BRANCHES, YEARS_OF_STUDY, type RegistrationFormData } from '@/types/registration';
import OceanInput from '../OceanInput';
import { capitalizeName, formatPhoneNumber, preventNonNumeric } from '@/utils/formUtils';

const TeamInfoStep = () => {
    const { register, formState: { errors } } = useFormContext<RegistrationFormData>();

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-[#00D9FF]/20 pb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00D9FF] to-blue-500 flex items-center justify-center shadow-lg shadow-[#00D9FF]/20">
                    <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-white leading-tight">Team Details</h3>
                    <p className="text-[#00D9FF]/60 text-xs">Manage your squad info</p>
                </div>
            </div>

            {/* Team Name */}
            <OceanInput
                label="Team Name"
                icon={Users}
                error={(errors as any).teamName?.message}
            >
                <input
                    {...register('teamName' as any)}
                    type="text"
                    placeholder="Enter unique team name"
                    className="w-full bg-[#0a192f]/50 border-2 border-[#00D9FF]/30 text-white px-3 py-2.5 rounded-lg focus:outline-none focus:border-[#00D9FF] transition-all placeholder-gray-500 text-sm"
                />
            </OceanInput>

            {/* Team Leader Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-[#00D9FF]/80">
                    <User className="w-4 h-4" />
                    <span className="text-sm font-semibold uppercase tracking-wider">Team Leader</span>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <OceanInput
                        label="Full Name"
                        icon={User}
                        error={(errors as any).teamLeader?.name?.message}
                    >
                        <input
                            {...register('teamLeader.name')}
                            onBlur={(e) => {
                                const formatted = capitalizeName(e.target.value);
                                e.target.value = formatted;
                                register('teamLeader.name').onChange(e);
                            }}
                            type="text"
                            placeholder="Leader Name"
                            className="w-full bg-[#0a192f]/50 border-2 border-[#00D9FF]/30 text-white px-3 py-2.5 rounded-lg focus:outline-none focus:border-[#00D9FF] transition-all placeholder-gray-500 min-h-[44px] text-[16px]"
                        />
                    </OceanInput>

                    <OceanInput
                        label="Email"
                        icon={Mail}
                        error={(errors as any).teamLeader?.email?.message}
                    >
                        <input
                            {...register('teamLeader.email')}
                            type="email"
                            placeholder="Leader Email"
                            className="w-full bg-[#0a192f]/50 border-2 border-[#00D9FF]/30 text-white px-3 py-2.5 rounded-lg focus:outline-none focus:border-[#00D9FF] transition-all placeholder-gray-500 min-h-[44px] text-[16px]"
                        />
                    </OceanInput>

                    <OceanInput
                        label="Phone"
                        icon={Phone}
                        error={(errors as any).teamLeader?.phone?.message}
                    >
                        <input
                            {...register('teamLeader.phone')}
                            onKeyDown={preventNonNumeric}
                            onBlur={(e) => {
                                const formatted = formatPhoneNumber(e.target.value);
                                if (formatted) {
                                    e.target.value = formatted;
                                    register('teamLeader.phone').onChange(e);
                                }
                            }}
                            maxLength={13}
                            type="tel"
                            placeholder="Phone Number"
                            className="w-full bg-[#0a192f]/50 border-2 border-[#00D9FF]/30 text-white px-3 py-2.5 rounded-lg focus:outline-none focus:border-[#00D9FF] transition-all placeholder-gray-500 min-h-[44px] text-[16px]"
                        />
                    </OceanInput>

                    <OceanInput
                        label="College"
                        icon={School}
                        error={(errors as any).teamLeader?.college?.message}
                    >
                        <input
                            {...register('teamLeader.college')}
                            onBlur={(e) => {
                                const formatted = capitalizeName(e.target.value);
                                e.target.value = formatted;
                                register('teamLeader.college').onChange(e);
                            }}
                            type="text"
                            placeholder="College Name"
                            className="w-full bg-[#0a192f]/50 border-2 border-[#00D9FF]/30 text-white px-3 py-2.5 rounded-lg focus:outline-none focus:border-[#00D9FF] transition-all placeholder-gray-500 min-h-[44px] text-[16px]"
                        />
                    </OceanInput>

                    <div className="grid grid-cols-2 gap-3">
                        <OceanInput
                            label="Branch"
                            icon={BookOpen}
                            error={(errors as any).teamLeader?.branch?.message}
                        >
                            <div className="relative">
                                <select
                                    {...register('teamLeader.branch')}
                                    className="w-full bg-[#1A1A2E]/50 border-2 border-[#00D9FF]/30 text-white px-2 py-2.5 rounded-lg focus:outline-none focus:border-[#00D9FF] transition-all min-h-[44px] text-[16px] appearance-none"
                                >
                                    <option value="" className="bg-[#1A1A2E]">Branch</option>
                                    {BRANCHES.map((branch) => (
                                        <option key={branch} value={branch} className="bg-[#1A1A2E]">
                                            {branch}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </OceanInput>

                        <OceanInput
                            label="Year"
                            icon={Calendar}
                            error={(errors as any).teamLeader?.yearOfStudy?.message}
                        >
                            <div className="relative">
                                <select
                                    {...register('teamLeader.yearOfStudy')}
                                    className="w-full bg-[#1A1A2E]/50 border-2 border-[#00D9FF]/30 text-white px-2 py-2.5 rounded-lg focus:outline-none focus:border-[#00D9FF] transition-all min-h-[44px] text-[16px] appearance-none"
                                >
                                    <option value="" className="bg-[#1A1A2E]">Year</option>
                                    {YEARS_OF_STUDY.map((year) => (
                                        <option key={year} value={year} className="bg-[#1A1A2E]">
                                            {year}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </OceanInput>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeamInfoStep;
