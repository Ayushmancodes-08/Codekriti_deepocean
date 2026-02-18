import { useFormContext } from 'react-hook-form';
import { Users, User, Mail, Phone, School, BookOpen, Calendar, Shield } from 'lucide-react';
import { BRANCHES, YEARS_OF_STUDY, EVENTS, type RegistrationFormData } from '@/types/registration';
import OceanInput from '../OceanInput';
import { capitalizeName, formatStrictPhone, preventNonNumeric } from '@/utils/formUtils';
import { motion } from 'framer-motion';

const TeamInfoStep = () => {
    const { register, watch, setValue, formState: { errors } } = useFormContext<RegistrationFormData>();

    const eventId = watch('eventId');
    const currentSquadSize = watch('squadSize');
    const event = EVENTS.find(e => e.id === eventId);

    const hasSizeRange = event && event.minTeamSize !== event.maxTeamSize;
    const sizeOptions = hasSizeRange
        ? Array.from(
            { length: (event.maxTeamSize - event.minTeamSize) + 1 },
            (_, i) => event.minTeamSize + i
        )
        : [];

    return (
        <div className="space-y-4 pb-8">
            <div className="flex items-center gap-3 border-b border-[#00D9FF]/10 pb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00D9FF]/20 to-blue-600/20 border border-[#00D9FF]/30 flex items-center justify-center shadow-[0_0_15px_rgba(0,217,255,0.1)]">
                    <Users className="w-5 h-5 text-[#00D9FF]" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest">SQUAD PROFILE</h3>
                    <p className="text-[#00D9FF]/50 text-[10px] font-medium uppercase tracking-tighter">Configure your operative base</p>
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

            {/* Dynamic Squad Size Selector - Compact Version */}
            {hasSizeRange && (
                <div className="p-3 rounded-xl bg-white/5 border border-[#00D9FF]/20 space-y-2">
                    <div className="flex items-center gap-2 text-[#00D9FF]/80">
                        <Shield className="w-3.5 h-3.5" />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em]">Squad Magnitude</span>
                    </div>
                    <div className="flex gap-2">
                        {sizeOptions.map((size) => (
                            <button
                                key={size}
                                type="button"
                                onClick={() => setValue('squadSize', size as any)}
                                className={`flex-1 py-1.5 rounded-lg border transition-all duration-300 flex items-center justify-center gap-2 group relative overflow-hidden ${currentSquadSize === size
                                    ? 'bg-[#00D9FF]/10 border-[#00D9FF] text-[#00D9FF] shadow-[0_0_15px_rgba(0,217,255,0.1)]'
                                    : 'bg-transparent border-white/10 text-gray-500 hover:border-white/20'
                                    }`}
                            >
                                <span className={`text-sm font-black transition-transform ${currentSquadSize === size ? 'scale-110' : ''}`}>
                                    {size}
                                </span>
                                <span className="text-[7px] font-black uppercase tracking-tighter opacity-60">Ops</span>

                                {currentSquadSize === size && (
                                    <motion.div
                                        layoutId="active-size"
                                        className="absolute inset-0 bg-[#00D9FF]/5 rounded-lg pointer-events-none"
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Team Leader Section */}
            <div className="space-y-3">
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
                            onChange={(e) => {
                                const formatted = formatStrictPhone(e.target.value);
                                e.target.value = formatted;
                                register('teamLeader.phone').onChange(e);
                            }}
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
