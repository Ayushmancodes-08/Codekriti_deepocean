import { useFormContext } from 'react-hook-form';
import { BRANCHES, YEARS_OF_STUDY, type RegistrationFormData } from '@/types/registration';
import PowerShellInput from '../PowerShellInput';

const TeamInfoStep = () => {
    const { register, formState: { errors } } = useFormContext<RegistrationFormData>();

    return (
        <div className="space-y-6">
            <div className="text-[#00FF00] mb-6">
                <div className="mb-2">&gt; SET-TEAMINFO -Role Leader</div>
                <div className="text-gray-400 text-sm">Enter team name and leader details</div>
            </div>

            {/* Team Name */}
            <PowerShellInput
                label="TEAM NAME"
                error={errors.teamName?.message}
            >
                <input
                    {...register('teamName' as any)}
                    type="text"
                    placeholder="Enter team name"
                    className="w-full bg-black border-2 border-[#0178D4] text-[#00FF00] px-4 py-3 rounded focus:outline-none focus:border-[#00FF00] font-mono placeholder-gray-600"
                />
            </PowerShellInput>

            <div className="border-t border-[#0178D4]/30 pt-6 mt-8">
                <div className="text-white font-bold mb-4 text-sm">TEAM LEADER DETAILS</div>

                <div className="space-y-4">
                    <PowerShellInput
                        label="NAME"
                        error={errors.teamLeader?.name?.message}
                    >
                        <input
                            {...register('teamLeader.name' as any)}
                            type="text"
                            placeholder="Leader full name"
                            className="w-full bg-black border-2 border-[#0178D4] text-[#00FF00] px-4 py-3 rounded focus:outline-none focus:border-[#00FF00] font-mono placeholder-gray-600"
                        />
                    </PowerShellInput>

                    <PowerShellInput
                        label="EMAIL"
                        error={errors.teamLeader?.email?.message}
                    >
                        <input
                            {...register('teamLeader.email' as any)}
                            type="email"
                            placeholder="leader@example.com"
                            className="w-full bg-black border-2 border-[#0178D4] text-[#00FF00] px-4 py-3 rounded focus:outline-none focus:border-[#00FF00] font-mono placeholder-gray-600"
                        />
                    </PowerShellInput>

                    <PowerShellInput
                        label="PHONE NUMBER"
                        error={errors.teamLeader?.phone?.message}
                    >
                        <input
                            {...register('teamLeader.phone' as any)}
                            type="tel"
                            placeholder="+91 XXXXX XXXXX"
                            className="w-full bg-black border-2 border-[#0178D4] text-[#00FF00] px-4 py-3 rounded focus:outline-none focus:border-[#00FF00] font-mono placeholder-gray-600"
                        />
                    </PowerShellInput>

                    <PowerShellInput
                        label="COLLEGE"
                        error={errors.teamLeader?.college?.message}
                    >
                        <input
                            {...register('teamLeader.college' as any)}
                            type="text"
                            placeholder="College/University name"
                            className="w-full bg-black border-2 border-[#0178D4] text-[#00FF00] px-4 py-3 rounded focus:outline-none focus:border-[#00FF00] font-mono placeholder-gray-600"
                        />
                    </PowerShellInput>

                    <div className="grid grid-cols-2 gap-4">
                        <PowerShellInput
                            label="BRANCH"
                            error={errors.teamLeader?.branch?.message}
                        >
                            <select
                                {...register('teamLeader.branch' as any)}
                                className="w-full bg-black border-2 border-[#0178D4] text-[#00FF00] px-4 py-3 rounded focus:outline-none focus:border-[#00FF00] font-mono"
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
                            error={errors.teamLeader?.yearOfStudy?.message}
                        >
                            <select
                                {...register('teamLeader.yearOfStudy' as any)}
                                className="w-full bg-black border-2 border-[#0178D4] text-[#00FF00] px-4 py-3 rounded focus:outline-none focus:border-[#00FF00] font-mono"
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
            </div>
        </div>
    );
};

export default TeamInfoStep;
