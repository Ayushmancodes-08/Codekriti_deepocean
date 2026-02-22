import { useFormContext, useWatch } from 'react-hook-form';
import { User, Mail, Phone, School, BookOpen, Calendar, PenTool } from 'lucide-react';
import { BRANCHES, YEARS_OF_STUDY, EVENT_COLLEGES, type RegistrationFormData } from '@/types/registration';
import { capitalizeName, formatStrictPhone, preventNonNumeric } from '@/utils/formUtils';
import { motion, AnimatePresence } from 'framer-motion';
import { FormControl, FormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { OceanFormItem } from '@/components/ui/ocean-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

const SoloDetailsStep = () => {
    const { control } = useFormContext<RegistrationFormData>();

    const college = useWatch({ control, name: 'participant.college' as any });
    const branch = useWatch({ control, name: 'participant.branch' as any });
    const year = useWatch({ control, name: 'participant.yearOfStudy' as any });
    const eventId = useWatch({ control, name: 'eventId' as any });

    // Get event-specific colleges
    const collegeOptions = (eventId && EVENT_COLLEGES[eventId as keyof typeof EVENT_COLLEGES] ? EVENT_COLLEGES[eventId as keyof typeof EVENT_COLLEGES] : EVENT_COLLEGES['algo-to-code']) as string[];

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
                <FormField
                    control={control}
                    name="participant.name"
                    render={({ field }) => (
                        <OceanFormItem label="Full Name" icon={User}>
                            <FormControl>
                                <Input
                                    {...field}
                                    onBlur={(e) => {
                                        const formatted = capitalizeName(e.target.value);
                                        field.onChange(formatted);
                                    }}
                                    placeholder="Enter your full name"
                                    className="bg-[#0a192f]/50 border-2 border-[#00D9FF]/30 text-white focus:border-[#00D9FF] transition-all placeholder:text-gray-500 h-11"
                                />
                            </FormControl>
                        </OceanFormItem>
                    )}
                />

                <FormField
                    control={control}
                    name="participant.email"
                    render={({ field }) => (
                        <OceanFormItem label="Email Address" icon={Mail}>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="email"
                                    placeholder="your.email@example.com"
                                    className="bg-[#0a192f]/50 border-2 border-[#00D9FF]/30 text-white focus:border-[#00D9FF] transition-all placeholder:text-gray-500 h-11"
                                />
                            </FormControl>
                        </OceanFormItem>
                    )}
                />

                <FormField
                    control={control}
                    name="participant.phone"
                    render={({ field }) => (
                        <OceanFormItem label="Phone Number" icon={Phone}>
                            <FormControl>
                                <Input
                                    {...field}
                                    onKeyDown={preventNonNumeric}
                                    onChange={(e) => {
                                        const formatted = formatStrictPhone(e.target.value);
                                        field.onChange(formatted);
                                    }}
                                    type="tel"
                                    placeholder="+91 XXXXX XXXXX"
                                    className="bg-[#0a192f]/50 border-2 border-[#00D9FF]/30 text-white focus:border-[#00D9FF] transition-all placeholder:text-gray-500 h-11"
                                />
                            </FormControl>
                        </OceanFormItem>
                    )}
                />

                {/* College Selection + Custom Input */}
                <div className="space-y-4">
                    <FormField
                        control={control}
                        name="participant.college"
                        render={({ field }) => (
                            <OceanFormItem label="College/University" icon={School}>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="bg-[#1A1A2E]/50 border-2 border-[#00D9FF]/30 text-white focus:ring-0 focus:border-[#00D9FF] h-11">
                                            <SelectValue placeholder="Select College" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="bg-[#1A1A2E] border-[#00D9FF]/30 text-white">
                                        {collegeOptions.map((col) => (
                                            <SelectItem key={col} value={col} className={cn(col === 'Other' && "text-yellow-400 font-bold")}>
                                                {col}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </OceanFormItem>
                        )}
                    />

                    <AnimatePresence>
                        {college === 'Other' && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                            >
                                <FormField
                                    control={control}
                                    name="participant.collegeCustom"
                                    render={({ field }) => (
                                        <OceanFormItem label="Specify College Name" icon={PenTool}>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Enter your college name"
                                                    className="bg-[#0a192f]/50 border-2 border-yellow-400/50 text-white focus:border-yellow-400 transition-all placeholder:text-gray-500 h-11"
                                                />
                                            </FormControl>
                                        </OceanFormItem>
                                    )}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Branch Selection + Custom Input */}
                <div className="space-y-4">
                    <FormField
                        control={control}
                        name="participant.branch"
                        render={({ field }) => (
                            <OceanFormItem label="Branch/Department" icon={BookOpen}>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="bg-[#1A1A2E]/50 border-2 border-[#00D9FF]/30 text-white focus:ring-0 focus:border-[#00D9FF] h-11">
                                            <SelectValue placeholder="Select your branch" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="bg-[#1A1A2E] border-[#00D9FF]/30 text-white">
                                        {BRANCHES.filter(branch => branch !== 'Other').map((branch) => (
                                            <SelectItem key={branch} value={branch}>
                                                {branch}
                                            </SelectItem>
                                        ))}
                                        <SelectItem value="Other" className="text-yellow-400 font-bold">Other (Specify)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </OceanFormItem>
                        )}
                    />

                    <AnimatePresence>
                        {branch === 'Other' && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                            >
                                <FormField
                                    control={control}
                                    name="participant.branchCustom"
                                    render={({ field }) => (
                                        <OceanFormItem label="Specify Branch" icon={PenTool}>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Enter your branch"
                                                    className="bg-[#0a192f]/50 border-2 border-yellow-400/50 text-white focus:border-yellow-400 transition-all placeholder:text-gray-500 h-11"
                                                />
                                            </FormControl>
                                        </OceanFormItem>
                                    )}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Year Selection + Custom Input */}
                <div className="space-y-4">
                    <FormField
                        control={control}
                        name="participant.yearOfStudy"
                        render={({ field }) => (
                            <OceanFormItem label="Year of Study" icon={Calendar}>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="bg-[#1A1A2E]/50 border-2 border-[#00D9FF]/30 text-white focus:ring-0 focus:border-[#00D9FF] h-11">
                                            <SelectValue placeholder="Select year" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="bg-[#1A1A2E] border-[#00D9FF]/30 text-white">
                                        {YEARS_OF_STUDY.filter(year => year !== 'Other').map((year) => (
                                            <SelectItem key={year} value={year}>
                                                {year}
                                            </SelectItem>
                                        ))}
                                        <SelectItem value="Other" className="text-yellow-400 font-bold">Other (Specify)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </OceanFormItem>
                        )}
                    />

                    <AnimatePresence>
                        {year === 'Other' && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                            >
                                <FormField
                                    control={control}
                                    name="participant.yearCustom"
                                    render={({ field }) => (
                                        <OceanFormItem label="Specify Year" icon={PenTool}>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Enter year (e.g., 5th Year)"
                                                    className="bg-[#0a192f]/50 border-2 border-yellow-400/50 text-white focus:border-yellow-400 transition-all placeholder:text-gray-500 h-11"
                                                />
                                            </FormControl>
                                        </OceanFormItem>
                                    )}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default SoloDetailsStep;
