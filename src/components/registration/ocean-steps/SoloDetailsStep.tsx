import { useFormContext } from 'react-hook-form';
import { User, Mail, Phone, School, BookOpen, Calendar } from 'lucide-react';
import { BRANCHES, YEARS_OF_STUDY, type RegistrationFormData } from '@/types/registration';
import OceanInput from '../OceanInput';

const SoloDetailsStep = () => {
    const { register, formState: { errors } } = useFormContext<RegistrationFormData>();

    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00D9FF] to-blue-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#00D9FF]/30">
                    <User className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Your Information</h3>
                <p className="text-gray-400">Tell us about yourself</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <OceanInput
                    label="Full Name"
                    icon={User}
                    error={(errors as any).participant?.name?.message}
                >
                    <input
                        {...register('participant.name' as any)}
                        type="text"
                        placeholder="Enter your full name"
                        className="w-full bg-[#0a192f]/50 border-2 border-[#00D9FF]/30 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#00D9FF] transition-all placeholder-gray-500"
                    />
                </OceanInput>

                <OceanInput
                    label="Email Address"
                    icon={Mail}
                    error={(errors as any).participant?.email?.message}
                >
                    <input
                        {...register('participant.email' as any)}
                        type="email"
                        placeholder="your.email@example.com"
                        className="w-full bg-[#0a192f]/50 border-2 border-[#00D9FF]/30 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#00D9FF] transition-all placeholder-gray-500"
                    />
                </OceanInput>

                <OceanInput
                    label="Phone Number"
                    icon={Phone}
                    error={(errors as any).participant?.phone?.message}
                >
                    <input
                        {...register('participant.phone' as any)}
                        type="tel"
                        placeholder="+91 XXXXX XXXXX"
                        className="w-full bg-[#0a192f]/50 border-2 border-[#00D9FF]/30 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#00D9FF] transition-all placeholder-gray-500"
                    />
                </OceanInput>

                <OceanInput
                    label="College/University"
                    icon={School}
                    error={(errors as any).participant?.college?.message}
                >
                    <input
                        {...register('participant.college' as any)}
                        type="text"
                        placeholder="Your institution name"
                        className="w-full bg-[#0a192f]/50 border-2 border-[#00D9FF]/30 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#00D9FF] transition-all placeholder-gray-500"
                    />
                </OceanInput>

                <OceanInput
                    label="Branch/Department"
                    icon={BookOpen}
                    error={(errors as any).participant?.branch?.message}
                >
                    <select
                        {...register('participant.branch' as any)}
                        className="w-full bg-[#1A1A2E]/50 border-2 border-[#00D9FF]/30 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#00D9FF] transition-all"
                    >
                        <option value="" className="bg-[#1A1A2E]">
                            Select your branch
                        </option>
                        {BRANCHES.map((branch) => (
                            <option key={branch} value={branch} className="bg-[#1A1A2E]">
                                {branch}
                            </option>
                        ))}
                    </select>
                </OceanInput>

                <OceanInput
                    label="Year of Study"
                    icon={Calendar}
                    error={(errors as any).participant?.yearOfStudy?.message}
                >
                    <select
                        {...register('participant.yearOfStudy' as any)}
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
    );
};

export default SoloDetailsStep;
