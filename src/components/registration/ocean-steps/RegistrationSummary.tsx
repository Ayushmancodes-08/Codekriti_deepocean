import { useFormContext, useWatch } from 'react-hook-form';
import { CheckCircle2, ClipboardList, Loader2, ArrowRight } from 'lucide-react';
import type { RegistrationFormData } from '@/types/registration';
import { EVENTS } from '@/types/registration';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface RegistrationSummaryProps {
    isSubmitting: boolean;
    onSubmit: () => void;
    eventName: string;
    buttonText?: string;
}

const RegistrationSummary = ({ isSubmitting, onSubmit, eventName, buttonText = "Complete Registration" }: RegistrationSummaryProps) => {
    const watchedValues = useWatch();
    const { formState: { } } = useFormContext<RegistrationFormData>();

    const formData = watchedValues as Partial<RegistrationFormData>;

    const currentEvent = EVENTS.find(e => e.id === formData.eventId);
    let entryFee = currentEvent?.entryFee || 'Free';

    if (formData.eventId === 'devxtreme') {
        const isTeamReg = (formData.registrationType ?? 'team') === 'team';
        const college = isTeamReg
            ? (formData as any).teamLeader?.college
            : (formData as any).participant?.college;
        if (college) {
            const normalizedCollege = college.toLowerCase().trim();
            entryFee = (normalizedCollege.includes('pmec') || normalizedCollege.includes('parala maharaja')) ? '₹400' : '₹500';
        } else {
            entryFee = '₹500';
        }
    }

    const isTeam = (formData.registrationType ?? 'team') === 'team';
    const teamData = isTeam ? (formData as any) : null;
    const memberCount = isTeam && teamData.teamMembers ? teamData.teamMembers.length : 0;
    const requiredMembers = (formData.squadSize || 1) - 1;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(\+91\s\d{5}\s\d{5}|\d{5}\s\d{5}|\d{10}|\+91\d{10})$/;

    const isParticipantValid = (p: any) =>
        !!(p?.name && p?.email && p?.phone && p?.college && p?.branch && p?.yearOfStudy) &&
        emailRegex.test(p.email) &&
        phoneRegex.test(p.phone);

    const hasLeader = isTeam ? isParticipantValid(teamData.teamLeader) : isParticipantValid((formData as any).participant);
    const hasTeamName = isTeam ? !!teamData.teamName : true;
    const membersComplete = isTeam ? memberCount >= requiredMembers : true;

    const isDevXtremeComplete = formData.eventId === 'devxtreme'
        ? !!((formData as any).abstractFile)
        : true;

    const isReady = hasTeamName && hasLeader && membersComplete && isDevXtremeComplete;

    return (
        <div className="flex flex-col gap-3 h-full">
            {/* Header - compact */}
            <div className="flex items-center gap-2 border-b border-[#00D9FF]/10 pb-3 shrink-0">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00D9FF]/20 to-blue-600/20 border border-[#00D9FF]/30 flex items-center justify-center">
                    <ClipboardList className="w-4 h-4 text-[#00D9FF]" />
                </div>
                <div>
                    <h3 className="text-xs font-black text-white uppercase tracking-[0.15em]">SQUAD_STATUS</h3>
                    <div className="flex items-center gap-1.5">
                        <div className="w-1 h-1 rounded-full bg-cyan-400 animate-pulse" />
                        <p className="text-[#00D9FF]/60 text-[9px] font-bold uppercase tracking-widest leading-none">Live Sync</p>
                    </div>
                </div>
            </div>

            {/* Summary card - compact */}
            <div className="relative bg-gradient-to-br from-[#0a192f]/90 to-[#112240]/90 border border-[#00D9FF]/20 rounded-xl p-3 overflow-hidden shrink-0">
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#00D9FF]/40" />
                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#00D9FF]/40" />
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#00D9FF]/40" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#00D9FF]/40" />

                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-gray-500 text-[8px] font-black uppercase tracking-[0.2em]">ACCESS_PROTOCOL</p>
                            <p className="text-white font-black text-base tracking-tighter leading-tight">{isTeam ? 'TEAM PASS' : 'SOLO ENTRY'}</p>
                        </div>
                        <div className="px-2 py-0.5 rounded-full bg-[#00D9FF]/10 text-[#00D9FF] text-[9px] font-black border border-[#00D9FF]/30 uppercase tracking-wider italic">
                            {eventName}
                        </div>
                    </div>

                    <div className="h-px bg-gradient-to-r from-transparent via-[#00D9FF]/30 to-transparent" />

                    <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-[10px] px-2 py-1.5 bg-white/[0.03] border border-white/[0.08] rounded-lg">
                            <span className="text-gray-400 font-bold uppercase tracking-wider">Squad Size</span>
                            <span className="text-[#00D9FF] font-black">{formData.squadSize || 1} {(formData.squadSize || 1) !== 1 ? 'Units' : 'Unit'}</span>
                        </div>
                        {isTeam && (
                            <div className="flex justify-between items-center text-[10px] px-2 py-1.5 bg-white/[0.03] border border-white/[0.08] rounded-lg">
                                <span className="text-gray-400 font-bold uppercase tracking-wider">Units Synced</span>
                                <span className={cn("font-black", memberCount >= requiredMembers ? "text-green-400" : "text-yellow-400")}>
                                    {memberCount} / {requiredMembers}
                                </span>
                            </div>
                        )}
                        <div className="flex justify-between items-center text-[10px] px-2 py-1.5 bg-[#00D9FF]/5 border border-[#00D9FF]/20 rounded-lg">
                            <span className="text-[#00D9FF] font-black uppercase tracking-wider italic">ENTRY_CREDITS</span>
                            <span className="text-white font-black text-sm">{entryFee}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Verification checklist - compact */}
            <div className="space-y-1.5 px-2 py-2 bg-white/[0.02] rounded-xl border border-white/[0.05] shrink-0">
                <div className="flex items-center gap-2 mb-1.5 px-1">
                    <div className="w-1 h-3 bg-cyan-500 rounded-full" />
                    <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Checklist</span>
                </div>
                <StatusItem active={hasTeamName} label="Base ID" />
                <StatusItem active={hasLeader} label="Commander" />
                {isTeam && <StatusItem active={membersComplete} label={`Members (${memberCount}/${requiredMembers})`} />}
                {formData.eventId === 'devxtreme' && <StatusItem active={isDevXtremeComplete} label="Hackathon Abstract" />}
            </div>

            {/* Action Button - always at bottom, never hidden */}
            <div className="mt-auto shrink-0 pt-1">
                <Button
                    onClick={onSubmit}
                    disabled={isSubmitting || !isReady}
                    className={cn(
                        "w-full h-12 relative overflow-hidden rounded-xl font-black uppercase tracking-[0.25em] text-xs transition-all duration-500 group",
                        isReady && !isSubmitting
                            ? "bg-[#00D9FF] text-[#0a192f] shadow-[0_0_25px_rgba(0,217,255,0.4)] hover:shadow-[0_0_40px_rgba(0,217,255,0.6)] hover:scale-[1.02]"
                            : "bg-gray-800 text-gray-500 opacity-40 grayscale"
                    )}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    <div className="relative flex items-center justify-center gap-2">
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span className="italic">PROCESSING...</span>
                            </>
                        ) : (
                            <>
                                <span className="italic">{buttonText}</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
                            </>
                        )}
                    </div>
                </Button>
                {!isReady && !isSubmitting && (
                    <p className="text-[9px] text-center text-red-400/60 mt-2 font-bold uppercase tracking-widest animate-pulse italic">
                        Fill all required fields
                    </p>
                )}
            </div>
        </div>
    );
};

const StatusItem = ({ active, label }: { active: boolean; label: string }) => (
    <div className={cn("flex items-center gap-2 transition-all duration-300", active ? "opacity-100" : "opacity-30")}>
        <div className={cn(
            "w-4 h-4 rounded-md flex items-center justify-center border transition-all shrink-0",
            active ? "bg-green-500/20 border-green-500/50 shadow-[0_0_8px_rgba(34,197,94,0.3)]" : "bg-white/5 border-white/10"
        )}>
            {active ? <CheckCircle2 className="w-2.5 h-2.5 text-green-400" /> : <div className="w-1 h-1 rounded-full bg-white/20" />}
        </div>
        <span className={cn("text-[9px] font-bold uppercase tracking-wider truncate", active ? "text-green-400" : "text-gray-500")}>
            {label}
        </span>
    </div>
);

export default RegistrationSummary;
