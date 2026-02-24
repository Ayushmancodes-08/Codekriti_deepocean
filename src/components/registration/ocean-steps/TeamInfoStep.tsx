import { useFormContext } from 'react-hook-form';
import { Users, User, Mail, Phone, School, BookOpen, Calendar, Shield, Download, FileText, UploadCloud, Trash2, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { BRANCHES, YEARS_OF_STUDY, EVENTS, EVENT_COLLEGES, type RegistrationFormData } from '@/types/registration';
import { capitalizeName, formatStrictPhone, preventNonNumeric } from '@/utils/formUtils';
import { motion, AnimatePresence } from 'framer-motion';
import { FormControl, FormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { OceanFormItem } from '@/components/ui/ocean-form';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface TeamInfoStepProps {
    onDirectSubmit?: () => void;
    isSubmitting?: boolean;
}

const TeamInfoStep = ({ onDirectSubmit, isSubmitting = false }: TeamInfoStepProps) => {
    const { watch, setValue, control } = useFormContext<RegistrationFormData>();

    const eventId = watch('eventId');
    const currentSquadSize = watch('squadSize');
    const teamLeaderCollege = watch('teamLeader.college');
    const teamLeaderBranch = watch('teamLeader.branch');
    const teamLeaderYear = watch('teamLeader.yearOfStudy');
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
                                <Select onValueChange={field.onChange} value={field.value || ''}>
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
                                    <Select onValueChange={(val) => {
                                        field.onChange(val);
                                        if (val !== 'Other') setValue('teamLeader.branchCustom' as any, '');
                                    }} value={field.value || ''}>
                                        <FormControl>
                                            <SelectTrigger className="bg-[#1A1A2E]/50 border-2 border-[#00D9FF]/30 text-white focus:ring-0 focus:border-[#00D9FF] h-11">
                                                <SelectValue placeholder="Branch" />
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

                        <FormField
                            control={control}
                            name="teamLeader.yearOfStudy"
                            render={({ field }) => (
                                <OceanFormItem label="Year" icon={Calendar}>
                                    <Select onValueChange={(val) => {
                                        field.onChange(val);
                                        if (val !== 'Other') setValue('teamLeader.yearCustom' as any, '');
                                    }} value={field.value || ''}>
                                        <FormControl>
                                            <SelectTrigger className="bg-[#1A1A2E]/50 border-2 border-[#00D9FF]/30 text-white focus:ring-0 focus:border-[#00D9FF] h-11">
                                                <SelectValue placeholder="Year" />
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
                    </div>

                    {/* Dynamic 'Other' fields for Branch & Year */}
                    <AnimatePresence>
                        {teamLeaderBranch === 'Other' && (
                            <motion.div
                                key="branch-other"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.25 }}
                                className="overflow-hidden"
                            >
                                <FormField
                                    control={control}
                                    name={"teamLeader.branchCustom" as any}
                                    render={({ field }) => (
                                        <OceanFormItem label="Specify Branch" icon={BookOpen}>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Enter your branch / department"
                                                    className="bg-[#0a192f]/50 border-2 border-yellow-400/50 text-white focus:border-yellow-400 transition-all placeholder:text-gray-500 h-11"
                                                />
                                            </FormControl>
                                        </OceanFormItem>
                                    )}
                                />
                            </motion.div>
                        )}
                        {teamLeaderYear === 'Other' && (
                            <motion.div
                                key="year-other"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.25 }}
                                className="overflow-hidden"
                            >
                                <FormField
                                    control={control}
                                    name={"teamLeader.yearCustom" as any}
                                    render={({ field }) => (
                                        <OceanFormItem label="Specify Year / Course" icon={Calendar}>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="e.g. 4th Year / PhD / Alumni"
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

            {/* DevXtreme Specific Fields */}
            {eventId === 'devxtreme' && (
                <div className="space-y-4 pt-4 border-t border-[#00D9FF]/10">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                                <BookOpen className="w-4 h-4 text-cyan-400" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-white uppercase tracking-widest">Project Abstract</h3>
                                <p className="text-cyan-400/50 text-[10px] font-medium uppercase">PDF or Word format only</p>
                            </div>
                        </div>
                        <a
                            href="/rulebooks/DevXtreme_Abstract_Template.pdf"
                            download="DevXtreme_Abstract_Template.pdf"
                            className="flex items-center gap-2 px-3 py-1.5 bg-yellow-400/10 hover:bg-yellow-400/20 border border-yellow-400/30 text-yellow-400 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
                        >
                            <Download className="w-4 h-4" /> Template
                        </a>
                    </div>

                    <FormField
                        control={control}
                        name="abstractFile"
                        render={({ field }) => (
                            <OceanFormItem label="Upload Project Abstract" icon={FileText}>
                                <FormControl>
                                    <div className="w-full">
                                        {field.value ? (
                                            <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-green-500/50 bg-green-500/10 rounded-xl transition-all relative overflow-hidden group">
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <CheckCircle2 className="w-8 h-8 text-green-400 mb-2" />
                                                    <p className="text-sm font-semibold text-green-400 truncate max-w-[200px]">{field.value.name}</p>
                                                    <div className="flex items-center justify-center gap-2 mt-1">
                                                        <span className="text-xs text-green-400/60">{(field.value.size / 1024 / 1024).toFixed(2)} MB</span>
                                                        <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 bg-green-500/20 text-green-400 rounded-sm tracking-wider">Attached</span>
                                                    </div>
                                                </div>

                                                {/* Hover Overlay for Remove */}
                                                <div className="absolute inset-0 bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm z-10">
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            field.onChange(undefined);
                                                        }}
                                                        className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/40 border border-red-500/50 text-red-500 rounded-lg text-sm font-bold transition-colors cursor-pointer"
                                                    >
                                                        <Trash2 className="w-4 h-4" /> Remove Document
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <label
                                                htmlFor="abstract-upload"
                                                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all bg-[#0a192f]/50 border-[#00D9FF]/30 hover:bg-[#0a192f] hover:border-[#00D9FF]"
                                            >
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <UploadCloud className="w-8 h-8 text-[#00D9FF] mb-2" />
                                                    <p className="mb-2 text-sm text-gray-400"><span className="font-semibold text-white">Click to upload document</span></p>
                                                    <p className="text-xs text-gray-500">PDF, DOC, DOCX (Max 5MB)</p>
                                                </div>
                                                <Input
                                                    id="abstract-upload"
                                                    type="file"
                                                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                                    className="hidden"
                                                    onChange={(e) => {
                                                        const f = e.target.files?.[0];
                                                        if (f) field.onChange(f);
                                                    }}
                                                />
                                            </label>
                                        )}

                                        {/* The old 'Submit Abstract & Register' block was removed so the user uses the standard RegistrationSummary right column */}

                                    </div>
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
