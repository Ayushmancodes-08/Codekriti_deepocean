import { useFormContext } from 'react-hook-form';
import { motion } from 'framer-motion';
import { BRANCHES, YEARS_OF_STUDY, type RegistrationFormData } from '@/types/registration';
import PowerShellInput from '../PowerShellInput';

const SoloDetailsStep = () => {
    const { register, formState: { errors } } = useFormContext<RegistrationFormData>();

    return (
        <div className="space-y-6">
            <div className="text-[#00FF00] mb-6">
                <div className="mb-2">&gt; ENTER-DETAILS -Type Participant</div>
                <div className="text-gray-400 text-sm">Enter your personal information</div>
            </div>

            <PowerShellInput
                label="NAME"
                error={errors.participant?.name?.message}
            >
                <input
                    {...register('participant.name' as any)}
                    type="text"
                    placeholder="Enter full name"
                    className="w-full bg-black border-2 border-[#0178D4] text-[#00FF00] px-4 py-3 rounded focus:outline-none focus:border-[#00FF00] font-mono placeholder-gray-600"
                />
            </PowerShellInput>

            <PowerShellInput
                label="COLLEGE"
                error={errors.participant?.college?.message}
            >
                <input
                    {...register('participant.college' as any)}
                    type="text"
                    placeholder="Enter college/university name"
                    className="w-full bg-black border-2 border-[#0178D4] text-[#00FF00] px-4 py-3 rounded focus:outline-none focus:border-[#00FF00] font-mono placeholder-gray-600"
                />
            </PowerShellInput>

            <PowerShellInput
                label="PHONE NUMBER"
                error={errors.participant?.phone?.message}
            >
                <input
                    {...register('participant.phone' as any)}
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full bg-black border-2 border-[#0178D4] text-[#00FF00] px-4 py-3 rounded focus:outline-none focus:border-[#00FF00] font-mono placeholder-gray-600"
                />
            </PowerShellInput>

            <PowerShellInput
                label="BRANCH"
                error={errors.participant?.branch?.message}
            >
                <select
                    {...register('participant.branch' as any)}
                    className="w-full bg-black border-2 border-[#0178D4] text-[#00FF00] px-4 py-3 rounded focus:outline-none focus:border-[#00FF00] font-mono"
                >
                    <option value="" className="bg-black">
                        -- Select Branch --
                    </option>
                    {BRANCHES.map((branch) => (
                        <option key={branch} value={branch} className="bg-black">
                            {branch}
                        </option>
                    ))}
                </select>
            </PowerShellInput>

            <PowerShellInput
                label="YEAR OF STUDY"
                error={errors.participant?.yearOfStudy?.message}
            >
                <select
                    {...register('participant.yearOfStudy' as any)}
                    className="w-full bg-black border-2 border-[#0178D4] text-[#00FF00] px-4 py-3 rounded focus:outline-none focus:border-[#00FF00] font-mono"
                >
                    <option value="" className="bg-black">
                        -- Select Year --
                    </option>
                    {YEARS_OF_STUDY.map((year) => (
                        <option key={year} value={year} className="bg-black">
                            {year}
                        </option>
                    ))}
                </select>
            </PowerShellInput>

            <PowerShellInput
                label="EMAIL"
                error={errors.participant?.email?.message}
            >
                <input
                    {...register('participant.email' as any)}
                    type="email"
                    placeholder="your.email@example.com"
                    className="w-full bg-black border-2 border-[#0178D4] text-[#00FF00] px-4 py-3 rounded focus:outline-none focus:border-[#00FF00] font-mono placeholder-gray-600"
                />
            </PowerShellInput>
        </div>
    );
};

export default SoloDetailsStep;
