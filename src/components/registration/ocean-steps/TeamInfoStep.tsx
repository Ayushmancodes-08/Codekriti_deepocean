import { useFormContext } from 'react-hook-form';
import { Users, User, Mail, Phone, School, BookOpen, Calendar, Shield } from 'lucide-react';
import { BRANCHES, YEARS_OF_STUDY, EVENTS, EVENT_COLLEGES, type RegistrationFormData } from '@/types/registration';
import { capitalizeName, formatStrictPhone, preventNonNumeric } from '@/utils/formUtils';
import { motion } from 'framer-motion';
import { FormControl, FormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { OceanFormItem } from '@/components/ui/ocean-form';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

const TeamInfoStep = () => {
    const { register, watch, setValue, control, formState: { errors } } = useFormContext<RegistrationFormData>();

    const eventId = watch('eventId');
    const currentSquadSize = watch('squadSize');
    const teamLeaderCollege = watch('teamLeader.college');
    const event = EVENTS.find(e => e.id === eventId);

    // Get event-specific colleges
    const collegeOptions = (eventId && EVENT_COLLEGES[eventId as keyof typeof EVENT_COLLEGES] ? EVENT_COLLEGES[eventId as keyof typeof EVENT_COLLEGES] : EVENT_COLLEGES['algo-to-code']) as string[];

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
            <FormField
                control={control}
                name="teamName"
                render={({ field }) => (
                    <OceanFormItem label="Team Name" icon={Users}>
                        <FormControl>
                            <Input
                                {...field}
                                placeholder="Enter unique team name"
                                className="bg-[#0a192f]/50 border-2 border-[#00D9FF]/30 text-white focus:border-[#00D9FF] transition-all placeholder:text-gray-500 h-11"
                            />
                        </FormControl>
                    </OceanFormItem>
                )}
            />

            {/* Dynamic Squad Size Selector - Compact Version */}
            {hasSizeRange && (
                <div className="p-3 rounded-xl bg-white/5 border border-[#00D9FF]/20 space-y-2">
                    <div className="flex items-center gap-2 text-[#00D9FF]/80">
                        <Shield className="w-3.5 h-3.5" />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em]">Squad Magnitude</span>
                    </div>
                    <div className="flex gap-2">
                        {sizeOptions.map((size) => (
                            <Button
                                key={size}
                                type="button"
                                variant="ghost"
                                onClick={() => setValue('squadSize', size as any)}
                                className={cn(
                                    "flex-1 h-10 rounded-lg border transition-all duration-300 flex items-center justify-center gap-2 group relative overflow-hidden",
                                    currentSquadSize === size
                                        ? "bg-[#00D9FF]/10 border-[#00D9FF] text-[#00D9FF] shadow-[0_0_15px_rgba(0,217,255,0.1)] hover:bg-[#00D9FF]/20"
                                        : "bg-transparent border-white/10 text-gray-500 hover:border-white/20 hover:bg-white/5"
                                )}
                            >
                                <span className={cn(
                                    "text-sm font-black transition-transform",
                                    currentSquadSize === size ? "scale-110" : ""
                                )}>
                                    {size}
                                </span>
                                <span className="text-[7px] font-black uppercase tracking-tighter opacity-60">Ops</span>

                                {currentSquadSize === size && (
                                    <motion.div
                                        layoutId="active-size"
                                        className="absolute inset-0 bg-[#00D9FF]/5 rounded-lg pointer-events-none"
                                    />
                                )}
                            </Button>
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
                    <FormField
                        control={control}
                        name="teamLeader.name"
                        render={({ field }) => (
                            <OceanFormItem label="Full Name" icon={User}>
                                <FormControl>
                                    <Input
                                        {...field}
                                        onBlur={(e) => {
                                            const formatted = capitalizeName(e.target.value);
                                            field.onChange(formatted);
                                        }}
                                        placeholder="Leader Name"
                                        className="bg-[#0a192f]/50 border-2 border-[#00D9FF]/30 text-white focus:border-[#00D9FF] transition-all placeholder:text-gray-500 h-11"
                                    />
                                </FormControl>
                            </OceanFormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name="teamLeader.email"
                        render={({ field }) => (
                            <OceanFormItem label="Email" icon={Mail}>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="email"
                                        placeholder="Leader Email"
                                        className="bg-[#0a192f]/50 border-2 border-[#00D9FF]/30 text-white focus:border-[#00D9FF] transition-all placeholder:text-gray-500 h-11"
                                    />
                                </FormControl>
                            </OceanFormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name="teamLeader.phone"
                        render={({ field }) => (
                            <OceanFormItem label="Phone" icon={Phone}>
                                <FormControl>
                                    <Input
                                        {...field}
                                        onKeyDown={preventNonNumeric}
                                        onChange={(e) => {
                                            const formatted = formatStrictPhone(e.target.value);
                                            field.onChange(formatted);
                                        }}
                                        type="tel"
                                        placeholder="Phone Number"
                                        className="bg-[#0a192f]/50 border-2 border-[#00D9FF]/30 text-white focus:border-[#00D9FF] transition-all placeholder:text-gray-500 h-11"
                                    />
                                </FormControl>
                            </OceanFormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name="teamLeader.college"
                        render={({ field }) => (
                            <OceanFormItem label="College" icon={School}>
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

                    {teamLeaderCollege === 'Other' && (
                        <FormField
                            control={control}
                            name="teamLeader.collegeCustom"
                            render={({ field }) => (
                                <OceanFormItem label="Specify College Name" icon={School}>
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
                    )}

                    <div className="grid grid-cols-2 gap-3">
                        <FormField
                            control={control}
                            name="teamLeader.branch"
                            render={({ field }) => (
                                <OceanFormItem label="Branch" icon={BookOpen}>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="bg-[#1A1A2E]/50 border-2 border-[#00D9FF]/30 text-white focus:ring-0 focus:border-[#00D9FF] h-11">
                                                <SelectValue placeholder="Branch" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="bg-[#1A1A2E] border-[#00D9FF]/30 text-white">
                                            {BRANCHES.map((branch) => (
                                                <SelectItem key={branch} value={branch}>
                                                    {branch}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </OceanFormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name="teamLeader.yearOfStudy"
                            render={({ field }) => (
                                <OceanFormItem label="Year" icon={Calendar}>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="bg-[#1A1A2E]/50 border-2 border-[#00D9FF]/30 text-white focus:ring-0 focus:border-[#00D9FF] h-11">
                                                <SelectValue placeholder="Year" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="bg-[#1A1A2E] border-[#00D9FF]/30 text-white">
                                            {YEARS_OF_STUDY.map((year) => (
                                                <SelectItem key={year} value={year}>
                                                    {year}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </OceanFormItem>
                            )}
                        />
                    </div>
                </div>
            </div>

            {/* DevXtreme Specific Fields */}
            {eventId === 'devxtreme' && (
                <div className="space-y-4 pt-4 border-t border-[#00D9FF]/10">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                            <BookOpen className="w-4 h-4 text-cyan-400" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Project Proposal</h3>
                            <p className="text-cyan-400/50 text-[10px] font-medium uppercase">Shortlisting Required</p>
                        </div>
                    </div>

                    <FormField
                        control={control}
                        name="problemStatement"
                        render={({ field }) => (
                            <OceanFormItem label="Problem Statement" icon={BookOpen}>
                                <FormControl>
                                    <Textarea
                                        {...field}
                                        placeholder="Describe the problem you are solving..."
                                        className="bg-[#0a192f]/50 border-2 border-[#00D9FF]/30 text-white focus:border-[#00D9FF] transition-all placeholder:text-gray-500 min-h-[100px] resize-y"
                                    />
                                </FormControl>
                            </OceanFormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name="solution"
                        render={({ field }) => (
                            <OceanFormItem label="Proposed Solution" icon={Shield}>
                                <FormControl>
                                    <Textarea
                                        {...field}
                                        placeholder="Describe your technical solution..."
                                        className="bg-[#0a192f]/50 border-2 border-[#00D9FF]/30 text-white focus:border-[#00D9FF] transition-all placeholder:text-gray-500 min-h-[120px] resize-y"
                                    />
                                </FormControl>
                            </OceanFormItem>
                        )}
                    />
                </div>
            )}
        </div>
    );
};

export default TeamInfoStep;
