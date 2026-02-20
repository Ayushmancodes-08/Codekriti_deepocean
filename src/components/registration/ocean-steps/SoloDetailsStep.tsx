import { useFormContext, useWatch } from 'react-hook-form';
import { User, Mail, Phone, School, BookOpen, Calendar, PenTool } from 'lucide-react';
import { BRANCHES, YEARS_OF_STUDY, EVENTS, EVENT_COLLEGES, type RegistrationFormData } from '@/types/registration';
import OceanInput from '../OceanInput';
import { capitalizeName, formatStrictPhone, preventNonNumeric } from '@/utils/formUtils';
import { motion, AnimatePresence } from 'framer-motion';

const SoloDetailsStep = () => {
    const { register, control, watch, formState: { errors } } = useFormContext<RegistrationFormData>();

    const college = useWatch({ control, name: 'participant.college' as any });
    const branch = useWatch({ control, name: 'participant.branch' as any });
    const year = useWatch({ control, name: 'participant.yearOfStudy' as any });
    const eventId = useWatch({ control, name: 'eventId' as any });

    // Get event-specific colleges
    const collegeOptions = eventId && EVENT_COLLEGES[eventId as any] ? EVENT_COLLEGES[eventId as any] : EVENT_COLLEGES['algo-to-code'];

    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00D9FF] to-blue-500 flex items-center justify-center mx-auto mb-2 shadow-lg shadow-[#00D9FF]/30">
                    <User className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Participant Details</h3>
                <p className="text-gray-400">Tell us about yourself</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <OceanInput
                    label="Full Name"
                    icon={User}
                    error={(errors as any).participant?.name?.message}
                >
                    <input
                        {...register('participant.name')}
                        onBlur={(e) => {
                            const formatted = capitalizeName(e.target.value);
                            e.target.value = formatted;
                            register('participant.name').onChange(e);
                        }}
                        type="text"
                        placeholder="Enter your full name"
                        className="w-full bg-[#0a192f]/50 border-2 border-[#00D9FF]/30 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#00D9FF] transition-all placeholder-gray-500 min-h-[44px] text-[16px]"
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
                        className="w-full bg-[#0a192f]/50 border-2 border-[#00D9FF]/30 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#00D9FF] transition-all placeholder-gray-500 min-h-[44px] text-[16px]"
                    />
                </OceanInput>

                <OceanInput
                    label="Phone Number"
                    icon={Phone}
                    error={(errors as any).participant?.phone?.message}
                >
                    <input
                        {...register('participant.phone')}
                        onKeyDown={preventNonNumeric}
                        onChange={(e) => {
                            const formatted = formatStrictPhone(e.target.value);
                            e.target.value = formatted;
                            register('participant.phone').onChange(e);
                        }}
                        type="tel"
                        placeholder="+91 XXXXX XXXXX"
                        className="w-full bg-[#0a192f]/50 border-2 border-[#00D9FF]/30 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#00D9FF] transition-all placeholder-gray-500 min-h-[44px] text-[16px]"
                    />
                </OceanInput>

                {/* College Selection + Custom Input */}
                <div className="space-y-4">
                    <OceanInput
                        label="College/University"
                        icon={School}
                        error={(errors as any).participant?.college?.message}
                    >
                        <div className="relative">
                            <select
                                {...register('participant.college' as any)} // Cast as any because schema update might not be inferred yet or using optional field
                                className="w-full bg-[#1A1A2E]/50 border-2 border-[#00D9FF]/30 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#00D9FF] transition-all min-h-[44px] text-[16px] appearance-none"
                            >
                                <option value="" className="bg-[#1A1A2E]">Select College</option>
                                {collegeOptions.map((col) => (
                                    <option key={col} value={col} className={`bg-[#1A1A2E] ${col === 'Other' ? 'text-yellow-400 font-bold' : ''}`}>
                                        {col}
                                    </option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                            </div>
                        </div>
                    </OceanInput>

                    <AnimatePresence>
                        {college === 'Other' && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                            >
                                <OceanInput
                                    label="Specify College Name"
                                    icon={PenTool}
                                    error={(errors as any).participant?.collegeCustom?.message}
                                >
                                    <input
                                        {...register('participant.collegeCustom' as any)}
                                        type="text"
                                        placeholder="Enter your college name"
                                        className="w-full bg-[#0a192f]/50 border-2 border-yellow-400/50 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-yellow-400 transition-all placeholder-gray-500 min-h-[44px] text-[16px]"
                                    />
                                </OceanInput>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Branch Selection + Custom Input */}
                <div className="space-y-4">
                    <OceanInput
                        label="Branch/Department"
                        icon={BookOpen}
                        error={(errors as any).participant?.branch?.message}
                    >
                        <div className="relative">
                            <select
                                {...register('participant.branch' as any)}
                                className="w-full bg-[#1A1A2E]/50 border-2 border-[#00D9FF]/30 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#00D9FF] transition-all min-h-[44px] text-[16px] appearance-none"
                            >
                                <option value="" className="bg-[#1A1A2E]">
                                    Select your branch
                                </option>
                                {BRANCHES.filter(branch => branch !== 'Other').map((branch) => (
                                    <option key={branch} value={branch} className="bg-[#1A1A2E]">
                                        {branch}
                                    </option>
                                ))}
                                <option value="Other" className="bg-[#1A1A2E] text-yellow-400 font-bold">Other (Specify)</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                            </div>
                        </div>
                    </OceanInput>

                    <AnimatePresence>
                        {branch === 'Other' && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                            >
                                <OceanInput
                                    label="Specify Branch"
                                    icon={PenTool}
                                    error={(errors as any).participant?.branchCustom?.message}
                                >
                                    <input
                                        {...register('participant.branchCustom' as any)}
                                        type="text"
                                        placeholder="Enter your branch"
                                        className="w-full bg-[#0a192f]/50 border-2 border-yellow-400/50 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-yellow-400 transition-all placeholder-gray-500 min-h-[44px] text-[16px]"
                                    />
                                </OceanInput>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Year Selection + Custom Input */}
                <div className="space-y-4">
                    <OceanInput
                        label="Year of Study"
                        icon={Calendar}
                        error={(errors as any).participant?.yearOfStudy?.message}
                    >
                        <div className="relative">
                            <select
                                {...register('participant.yearOfStudy' as any)}
                                className="w-full bg-[#1A1A2E]/50 border-2 border-[#00D9FF]/30 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#00D9FF] transition-all min-h-[44px] text-[16px] appearance-none"
                            >
                                <option value="" className="bg-[#1A1A2E]">
                                    Select year
                                </option>
                                {YEARS_OF_STUDY.filter(year => year !== 'Other').map((year) => (
                                    <option key={year} value={year} className="bg-[#1A1A2E]">
                                        {year}
                                    </option>
                                ))}
                                <option value="Other" className="bg-[#1A1A2E] text-yellow-400 font-bold">Other (Specify)</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                            </div>
                        </div>
                    </OceanInput>

                    <AnimatePresence>
                        {year === 'Other' && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                            >
                                <OceanInput
                                    label="Specify Year"
                                    icon={PenTool}
                                    error={(errors as any).participant?.yearCustom?.message}
                                >
                                    <input
                                        {...register('participant.yearCustom' as any)}
                                        type="text"
                                        placeholder="Enter year (e.g., 5th Year)"
                                        className="w-full bg-[#0a192f]/50 border-2 border-yellow-400/50 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-yellow-400 transition-all placeholder-gray-500 min-h-[44px] text-[16px]"
                                    />
                                </OceanInput>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default SoloDetailsStep;
