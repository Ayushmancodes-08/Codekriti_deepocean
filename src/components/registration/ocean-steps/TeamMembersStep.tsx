import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useFormContext, useFieldArray, useWatch } from 'react-hook-form';
import { User, X, PlusCircle, Edit2, Trash2, CheckCircle2 } from 'lucide-react';
import { BRANCHES, YEARS_OF_STUDY, type RegistrationFormData, EVENT_COLLEGES } from '@/types/registration';
import { capitalizeName, formatStrictPhone, preventNonNumeric } from '@/utils/formUtils';
import { motion, AnimatePresence } from 'framer-motion';
import { FormField, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { OceanFormItem } from '@/components/ui/ocean-form';

interface TeamMembersStepProps {
    squadSize: number;
}

type TeamFormData = Extract<RegistrationFormData, { registrationType: 'team' }>;

const TeamMembersStep = ({ squadSize }: TeamMembersStepProps) => {
    const { control, setValue, watch } = useFormContext<TeamFormData>();
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const leaderCollege = useWatch({ control, name: 'teamLeader.college' });
    const teamMembers = useWatch({ control, name: 'teamMembers' });
    const eventId = useWatch({ control, name: 'eventId' });
    const { fields, append, remove } = useFieldArray({ control, name: 'teamMembers' });

    // Get event-specific colleges
    const collegeOptions = (eventId && EVENT_COLLEGES[eventId as keyof typeof EVENT_COLLEGES] ? EVENT_COLLEGES[eventId as keyof typeof EVENT_COLLEGES] : EVENT_COLLEGES['algo-to-code']) as string[];

    useEffect(() => {
        if (leaderCollege) {
            fields.forEach((_, index) => {
                setValue(`teamMembers.${index}.college`, leaderCollege);
            });
        }
    }, [leaderCollege, fields.length, setValue]);

    const requiredMembers = squadSize - 1;

    // We want to show exactly requiredMembers slots.
    // Some might be real fields, some might be "empty" placeholders.
    const slots = Array.from({ length: requiredMembers }).map((_, i) => fields[i] || null);

    const handleSlotClick = (index: number) => {
        if (!fields[index]) {
            // First time adding to this slot - append a new member
            // Note: useFieldArray usually appends to the end, but since we are simulating fixed slots,
            // we should be careful. If a user clicks slot 2 but slot 1 is empty, fieldArray will make it index 0.
            // For simplicity in this logic, we'll just open the modal.
            // But we need a field to register inputs against.

            // Auto-append if the index doesn't exist yet
            if (fields.length <= index) {
                append({
                    name: '',
                    email: '',
                    phone: '',
                    college: leaderCollege || '',
                    branch: '' as any,
                    yearOfStudy: '' as any,
                });
            }
        }
        setEditingIndex(index);
        setIsModalOpen(true);
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-3 flex-shrink-0">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00D9FF] to-blue-500 flex items-center justify-center shadow-lg">
                        <User className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-white leading-tight">Team Members</h3>
                        <p className="text-[#00D9FF]/60 text-[10px]">Tap slots to manage squad ({fields.length}/{requiredMembers})</p>
                    </div>
                </div>
            </div>

            <div className="flex-grow overflow-y-auto pr-1 custom-scrollbar space-y-3 pb-4">
                {slots.map((field, index) => {
                    const isFilled = !!field;

                    const memberValues = teamMembers?.[index];
                    const memberName = memberValues?.name;
                    // Check if ALL details are filled to show "Online"
                    const isDetailsComplete = memberValues?.name && memberValues?.email && memberValues?.phone && memberValues?.branch && memberValues?.yearOfStudy;

                    return (
                        <motion.div
                            key={field?.id || `empty-${index}`}
                            layout
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.01 }}
                            className={`relative rounded-2xl p-4 flex items-center justify-between group transition-all cursor-pointer border-2 overflow-hidden ${isFilled
                                ? 'bg-[#1A1A2E]/60 border-[#00D9FF]/20 hover:border-[#00D9FF]/40 shadow-[0_4px_15px_rgba(0,0,0,0.2)]'
                                : 'bg-[#0a192f]/40 border-dashed border-[#00D9FF]/10 hover:border-[#00D9FF]/30 hover:bg-[#0a192f]/60'
                                }`}
                            onClick={() => handleSlotClick(index)}
                        >
                            {/* Inner Glow for Filled Slots */}
                            {isFilled && (
                                <div className="absolute inset-0 bg-gradient-to-r from-[#00D9FF]/5 to-transparent pointer-events-none" />
                            )}

                            <div className="relative z-10 flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs border transition-all duration-300 ${isFilled
                                    ? 'bg-[#00D9FF]/10 text-[#00D9FF] border-[#00D9FF]/30 shadow-[0_0_15px_rgba(0,217,255,0.15)] group-hover:shadow-[0_0_20px_rgba(0,217,255,0.3)]'
                                    : 'bg-white/5 text-gray-700 border-white/5'
                                    }`}>
                                    {index + 1}
                                </div>
                                <div className="space-y-0.5">
                                    <p className={`font-bold text-[10px] uppercase tracking-[0.2em] ${isFilled ? 'text-[#00D9FF]/60' : 'text-gray-600'}`}>
                                        {isFilled ? `OPERATIVE ${String(index + 1).padStart(2, '0')}` : 'VACANT UNIT'}
                                    </p>
                                    <p className={`font-black text-base tracking-tight truncate max-w-[160px] ${isFilled ? 'text-white' : 'text-gray-700'}`}>
                                        {isFilled && memberName ? memberName.toUpperCase() : 'IDENTITY REQUIRED'}
                                    </p>
                                </div>
                            </div>

                            <div className="relative z-10 flex items-center gap-2">
                                {isFilled ? (
                                    <div className="flex items-center gap-2">
                                        <div className="flex flex-col items-end mr-2">
                                            <div className="flex items-center gap-1.5">
                                                {isDetailsComplete ? (
                                                    <>
                                                        <span className="text-[8px] font-black text-green-500 uppercase tracking-widest">Online</span>
                                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_5px_#22c55e]" />
                                                    </>
                                                ) : (
                                                    <>
                                                        <span className="text-[8px] font-black text-yellow-500 uppercase tracking-widest">Pending</span>
                                                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/50 animate-pulse" />
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleSlotClick(index); }}
                                                className="p-2 hover:bg-[#00D9FF]/10 rounded-lg text-[#00D9FF] border border-transparent hover:border-[#00D9FF]/20"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); remove(index); }}
                                                className="p-2 hover:bg-red-500/10 rounded-lg text-red-400 border border-transparent hover:border-red-500/20"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-2 rounded-lg bg-white/5 border border-white/5 group-hover:border-[#00D9FF]/30 group-hover:bg-[#00D9FF]/10 transition-all">
                                        <PlusCircle className="w-5 h-5 text-gray-700 group-hover:text-[#00D9FF] transition-colors" />
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* No footer button needed as per user request */}

            {/* Member Details Pop-up Modal */}
            {typeof document !== 'undefined' && createPortal(
                <AnimatePresence>
                    {isModalOpen && editingIndex !== null && (
                        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-black/90 backdrop-blur-md"
                                onClick={() => setIsModalOpen(false)}
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="bg-[#0a192f] border border-[#00D9FF]/40 w-full max-w-md rounded-3xl shadow-[0_0_100px_rgba(0,0,0,1)] relative overflow-hidden z-[1000000]"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="p-6 border-b border-[#00D9FF]/10 flex items-center justify-between bg-gradient-to-r from-[#1A1A2E] to-[#0a192f]">
                                    <h4 className="text-white font-black text-sm uppercase tracking-widest flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-[#00D9FF]/10 border border-[#00D9FF]/30">
                                            <User className="w-4 h-4 text-[#00D9FF]" />
                                        </div>
                                        {editingIndex !== null && (() => {
                                            const currentName = watch(`teamMembers.${editingIndex}.name`);
                                            return currentName && currentName.length > 0
                                                ? currentName.toUpperCase()
                                                : `OPERATIVE ${String(editingIndex + 1).padStart(2, '0')} ENROLLMENT`;
                                        })()}
                                    </h4>
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar bg-[#0a192f]/50">
                                    <div className="grid grid-cols-1 gap-6">
                                        <FormField
                                            control={control}
                                            name={`teamMembers.${editingIndex}.name`}
                                            render={({ field }) => (
                                                <OceanFormItem label="Candidate Identity" icon={User}>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            placeholder="Enter Full Name"
                                                            className="bg-transparent border-none focus-visible:ring-0 px-0 h-auto text-base"
                                                            onBlur={(e) => {
                                                                const formatted = capitalizeName(e.target.value);
                                                                field.onChange(formatted);
                                                                field.onBlur();
                                                            }}
                                                        />
                                                    </FormControl>
                                                </OceanFormItem>
                                            )}
                                        />

                                        <FormField
                                            control={control}
                                            name={`teamMembers.${editingIndex}.email`}
                                            render={({ field }) => (
                                                <OceanFormItem label="Communication Link" icon={User}>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            placeholder="operative@domain.com"
                                                            className="bg-transparent border-none focus-visible:ring-0 px-0 h-auto text-base"
                                                        />
                                                    </FormControl>
                                                </OceanFormItem>
                                            )}
                                        />

                                        <FormField
                                            control={control}
                                            name={`teamMembers.${editingIndex}.phone`}
                                            render={({ field }) => (
                                                <OceanFormItem label="Direct Comms Protocol" icon={User}>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            placeholder="+91-0000000000"
                                                            className="bg-transparent border-none focus-visible:ring-0 px-0 h-auto text-base font-mono tracking-wider"
                                                            onKeyDown={preventNonNumeric}
                                                            onChange={(e) => {
                                                                const formatted = formatStrictPhone(e.target.value);
                                                                field.onChange(formatted);
                                                            }}
                                                        />
                                                    </FormControl>
                                                </OceanFormItem>
                                            )}
                                        />

                                        {/* College Selection for Member */}
                                        <FormField
                                            control={control}
                                            name={`teamMembers.${editingIndex}.college`}
                                            render={({ field }) => (
                                                <OceanFormItem label="Base Station" icon={User}>
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className="bg-transparent border-none focus:ring-0 px-0 h-auto text-base text-white">
                                                                <SelectValue placeholder="Select Base Station" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent className="bg-[#0a192f] border-[#00D9FF]/20 text-white">
                                                            {collegeOptions.map((c: string) => (
                                                                <SelectItem key={c} value={c} className="hover:bg-cyan-500/10 focus:bg-cyan-500/10 cursor-pointer">
                                                                    {c}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </OceanFormItem>
                                            )}
                                        />

                                        {/* Custom College for Member */}
                                        {watch(`teamMembers.${editingIndex}.college`) === 'Other' && (
                                            <FormField
                                                control={control}
                                                name={`teamMembers.${editingIndex}.collegeCustom` as any}
                                                render={({ field }) => (
                                                    <OceanFormItem label="Custom Base Station" icon={User}>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                placeholder="Enter College Name"
                                                                className="bg-transparent border-none focus-visible:ring-0 px-0 h-auto text-base"
                                                            />
                                                        </FormControl>
                                                    </OceanFormItem>
                                                )}
                                            />
                                        )}

                                        <div className="grid grid-cols-2 gap-4">
                                            <FormField
                                                control={control}
                                                name={`teamMembers.${editingIndex}.branch`}
                                                render={({ field }) => (
                                                    <OceanFormItem label="Deployment" icon={User}>
                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className="bg-transparent border-none focus:ring-0 px-0 h-auto text-base text-white">
                                                                    <SelectValue placeholder="Branch" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent className="bg-[#0a192f] border-[#00D9FF]/20 text-white">
                                                                {BRANCHES.map((b) => (
                                                                    <SelectItem key={b} value={b} className="hover:bg-cyan-500/10 focus:bg-cyan-500/10 cursor-pointer text-xs">
                                                                        {b}
                                                                    </SelectItem>
                                                                ))}
                                                                <SelectItem value="Other" className="hover:bg-cyan-500/10 focus:bg-cyan-500/10 cursor-pointer text-xs">Other</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </OceanFormItem>
                                                )}
                                            />

                                            <FormField
                                                control={control}
                                                name={`teamMembers.${editingIndex}.yearOfStudy`}
                                                render={({ field }) => (
                                                    <OceanFormItem label="Cycle" icon={User}>
                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className="bg-transparent border-none focus:ring-0 px-0 h-auto text-base text-white">
                                                                    <SelectValue placeholder="Year" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent className="bg-[#0a192f] border-[#00D9FF]/20 text-white">
                                                                {YEARS_OF_STUDY.map((y) => (
                                                                    <SelectItem key={y} value={y} className="hover:bg-cyan-500/10 focus:bg-cyan-500/10 cursor-pointer text-xs">
                                                                        {y} Year
                                                                    </SelectItem>
                                                                ))}
                                                                <SelectItem value="Other" className="hover:bg-cyan-500/10 focus:bg-cyan-500/10 cursor-pointer text-xs">Other</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </OceanFormItem>
                                                )}
                                            />
                                        </div>

                                        {/* Custom Branch for Member */}
                                        {watch(`teamMembers.${editingIndex}.branch`) === 'Other' && (
                                            <FormField
                                                control={control}
                                                name={`teamMembers.${editingIndex}.branchCustom` as any}
                                                render={({ field }) => (
                                                    <OceanFormItem label="Custom Deployment" icon={User}>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                placeholder="Enter Branch Name"
                                                                className="bg-transparent border-none focus-visible:ring-0 px-0 h-auto text-base"
                                                            />
                                                        </FormControl>
                                                    </OceanFormItem>
                                                )}
                                            />
                                        )}

                                        {/* Custom Year for Member */}
                                        {watch(`teamMembers.${editingIndex}.yearOfStudy`) === 'Other' && (
                                            <FormField
                                                control={control}
                                                name={`teamMembers.${editingIndex}.yearCustom` as any}
                                                render={({ field }) => (
                                                    <OceanFormItem label="Custom Cycle" icon={User}>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                placeholder="Enter Year / Designation"
                                                                className="bg-transparent border-none focus-visible:ring-0 px-0 h-auto text-base"
                                                            />
                                                        </FormControl>
                                                    </OceanFormItem>
                                                )}
                                            />
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="w-full mt-2 py-4 bg-[#00D9FF] text-[#0a192f] font-black uppercase tracking-[0.3em] text-xs rounded-2xl shadow-[0_0_20px_rgba(0,217,255,0.4)] hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(0,217,255,0.6)] transition-all flex items-center justify-center gap-2 group/btn"
                                    >
                                        <CheckCircle2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                                        SAVE OPERATIVE DETAILS
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </div>
    );
};

export default TeamMembersStep;
