import { useFormContext } from 'react-hook-form';
import { Users, User, Mail, Phone, School, BookOpen, Calendar } from 'lucide-react';
import { BRANCHES, YEARS_OF_STUDY, type RegistrationFormData } from '@/types/registration';
import OceanInput from '../OceanInput';

const TeamInfoStep = () => {
    const { register, formState: { errors } } = useFormContext<RegistrationFormData>();

    return (
        <div className="space-y-8">
            <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00D9FF] to-blue-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#00D9FF]/30">
                    <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Team Information</h3>
                <p className="text-gray-400">Set up your squad</p>
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
                    placeholder="Enter your team name"
                    className="w-full bg-[#0a192f]/50 border-2 border-[#00D9FF]/30 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#00D9FF] transition-all placeholder-gray-500"
                />
            </OceanInput>

            {/* Team Leader Section */}
            <div className="p-6 bg-gradient-to-br from-[#00D9FF]/10 to-blue-500/10 border border-[#00D9FF]/30 rounded-xl">
                <h4 className="text-xl font-bold text-[#00D9FF] mb-6 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Team Leader Details
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <OceanInput
                        label="Full Name"
                        icon={User}
                        error={(errors as any).teamLeader?.name?.message}
                    >
                        <input
                            {...register('teamLeader.name' as any)}
                            type="text"
                            placeholder="Leader's full name"
                            className="w-full bg-[#0a192f]/50 border-2 border-[#00D9FF]/30 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#00D9FF] transition-all placeholder-gray-500"
                        />
                    </OceanInput>

                    <OceanInput
                        label="Email"
                        icon={Mail}
                        error={(errors as any).teamLeader?.email?.message}
                    >
                        <input
                            {...register('teamLeader.email' as any)}
                            type="email"
                            placeholder="leader@example.com"
                            className="w-full bg-[#0a192f]/50 border-2 border-[#00D9FF]/30 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#00D9FF] transition-all placeholder-gray-500"
                        />
                    </OceanInput>

                    <OceanInput
                        label="Phone"
                        icon={Phone}
                        error={(errors as any).teamLeader?.phone?.message}
                    >
                        <input
                            {...register('teamLeader.phone' as any)}
                            type="tel"
                            placeholder="+91 XXXXX XXXXX"
                            className="w-full bg-[#0a192f]/50 border-2 border-[#00D9FF]/30 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#00D9FF] transition-all placeholder-gray-500"
                        />
                    </OceanInput>

                    <OceanInput
                        label="College"
                        icon={School}
                        error={(errors as any).teamLeader?.college?.message}
                    >
                        <input
                            {...register('teamLeader.college' as any)}
                            type="text"
                            placeholder="Institution name"
                            className="w-full bg-[#0a192f]/50 border-2 border-[#00D9FF]/30 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#00D9FF] transition-all placeholder-gray-500"
                        />
                    </OceanInput>

                    <OceanInput
                        label="Branch"
                        icon={BookOpen}
                        error={(errors as any).teamLeader?.branch?.message}
                    >
                        <select
                            {...register('teamLeader.branch' as any)}
                            className="w-full bg-[#1A1A2E]/50 border-2 border-[#00D9FF]/30 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#00D9FF] transition-all"
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
                        error={(errors as any).teamLeader?.yearOfStudy?.message}
                    >
                        <select
                            {...register('teamLeader.yearOfStudy' as any)}
                            className="w-full bg-[#1A1A2E]/50 border-2 border-[#00D9FF]/30 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#00D9FF] transition-all"
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
            </div>
        </div>
    );
};

export default TeamInfoStep;
