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
    // Watch form values to update summary in real-time
    const watchedValues = useWatch();
    const { formState: { } } = useFormContext<RegistrationFormData>();

    // Safely cast watched values (handling potential undefined during initial render)
    const formData = watchedValues as Partial<RegistrationFormData>;

    // Get entry fee from event configuration or calculate dynamic fee
    const currentEvent = EVENTS.find(e => e.id === formData.eventId);

    let entryFee = currentEvent?.entryFee || 'Free';

    // Dynamic fee logic for DevXtreme
    if (formData.eventId === 'devxtreme') {
        const isTeamReg = (formData.registrationType ?? 'team') === 'team';
        const college = isTeamReg
            ? (formData as any).teamLeader?.college
            : (formData as any).participant?.college;
        if (college) {
            const normalizedCollege = college.toLowerCase().trim();
            if (normalizedCollege.includes('pmec') || normalizedCollege.includes('parala maharaja')) {
                entryFee = '₹400';
            } else {
                entryFee = '₹500';
            }
        } else {
            // Default display before input
            entryFee = '₹500';
        }
    }

    // Determine type and count
    const isTeam = (formData.registrationType ?? 'team') === 'team';
    const teamData = isTeam ? (formData as any) : null;
    const memberCount = isTeam && teamData.teamMembers ? teamData.teamMembers.length : 0;
    const requiredMembers = (formData.squadSize || 1) - 1;

    // Validation Regexes for instant sync feedback
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(\+91\s\d{5}\s\d{5}|\d{5}\s\d{5}|\d{10}|\+91\d{10})$/;

    // Helper to check if a participant/leader is fully valid
    const isParticipantValid = (p: any) => {
        return !!(p?.name && p?.email && p?.phone && p?.college && p?.branch && p?.yearOfStudy) &&
            emailRegex.test(p.email) &&
            phoneRegex.test(p.phone);
    };

    // Dynamic status checks for UI indicators
    const hasLeader = isTeam ? isParticipantValid(teamData.teamLeader) : isParticipantValid((formData as any).participant);
    const hasTeamName = isTeam ? !!teamData.teamName : true;
    const membersComplete = isTeam ? memberCount >= requiredMembers : true;

    // DevXtreme specific check
    const isDevXtremeComplete = formData.eventId === 'devxtreme'
        ? !!((formData as any).problemStatement && (formData as any).solution)
        : true;

    // Manual readiness check: field presence + format validation
    const isReady = hasTeamName && hasLeader && membersComplete && isDevXtremeComplete;

    return (
        <div className="h-full flex flex-col space-y-4">
            <div className="flex items-center gap-3 border-b border-[#00D9FF]/10 pb-4 shrink-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00D9FF]/20 to-blue-600/20 border border-[#00D9FF]/30 flex items-center justify-center shadow-[0_0_20px_rgba(0,217,255,0.15)] transition-transform hover:scale-105">
                    <ClipboardList className="w-5 h-5 text-[#00D9FF]" />
                </div>
                <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-0.5">SQUAD_STATUS</h3>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                        <p className="text-[#00D9FF]/60 text-[10px] font-bold uppercase tracking-widest leading-none">Real-time Terminal Output</p>
                    </div>
                </div>
            </div>

            <div className="flex-grow space-y-4 overflow-y-auto custom-scrollbar pr-2 min-h-0">
                <div className="relative bg-gradient-to-br from-[#0a192f]/90 to-[#112240]/90 border border-[#00D9FF]/20 rounded-2xl p-5 overflow-hidden group/card shadow-[0_4px_30px_rgba(0,0,0,0.3)] shrink-0">
                    <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />

                    {/* Corner accents */}
                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#00D9FF]/40" />
                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#00D9FF]/40" />
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#00D9FF]/40" />
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#00D9FF]/40" />

                    <div className="relative z-10 space-y-4">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <p className="text-gray-500 text-[9px] font-black uppercase tracking-[0.3em]">ACCESS_PROTOCOL</p>
                                <p className="text-white font-black text-xl tracking-tighter leading-none">{isTeam ? 'TEAM PASS' : 'SOLO ENTRY'}</p>
                            </div>
                            <div className="px-3 py-1 rounded-full bg-[#00D9FF]/10 text-[#00D9FF] text-[10px] font-black border border-[#00D9FF]/30 shadow-[0_0_15px_rgba(0,217,255,0.2)] uppercase tracking-widest italic translate-y-[-2px]">
                                {eventName}
                            </div>
                        </div>

                        <div className="flex items-center gap-3 py-1">
                            <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent via-[#00D9FF]/40 to-transparent" />
                            <div className="w-1 h-1 rounded-full bg-[#00D9FF] shadow-[0_0_8px_#00D9FF]" />
                            <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent via-[#00D9FF]/40 to-transparent" />
                        </div>

                        <div className="space-y-2.5">
                            <div className="flex justify-between items-center text-[11px] p-3 bg-white/[0.03] border border-white/[0.08] rounded-xl group-hover/card:bg-white/[0.06] transition-all duration-300">
                                <span className="text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
                                    <div className="w-1 h-1 bg-gray-500 rounded-full" />
                                    Squad Size
                                </span>
                                <span className="text-[#00D9FF] font-black tracking-tight">{formData.squadSize || 1} UNIT{formData.squadSize !== 1 ? 'S' : ''}</span>
                            </div>
                            {isTeam && (
                                <div className="flex justify-between items-center text-[11px] p-3 bg-white/[0.03] border border-white/[0.08] rounded-xl group-hover/card:bg-white/[0.06] transition-all duration-300">
                                    <span className="text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
                                        <div className="w-1 h-1 bg-gray-500 rounded-full" />
                                        Units Synced
                                    </span>
                                    <span className={cn(
                                        "font-black tracking-tight",
                                        memberCount >= requiredMembers ? "text-green-400" : "text-yellow-400"
                                    )}>
                                        {memberCount} / {requiredMembers}
                                    </span>
                                </div>
                            )}
                            <div className="flex justify-between items-center text-[11px] p-4 bg-[#00D9FF]/5 border border-[#00D9FF]/20 rounded-xl group-hover/card:bg-[#00D9FF]/10 transition-all duration-300 shadow-inner">
                                <span className="text-[#00D9FF] font-black uppercase tracking-[0.2em] italic">ENTRY_CREDITS</span>
                                <span className="text-white font-black text-lg tracking-tighter">{entryFee}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Status Indicators */}
                <div className="space-y-2.5 px-2 py-2 bg-white/[0.02] rounded-2xl border border-white/[0.05]">
                    <div className="flex items-center gap-2 mb-2 px-1">
                        <div className="w-1 h-3 bg-cyan-500 rounded-full" />
                        <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Verification Checklist</span>
                    </div>
                    <StatusItem active={hasTeamName} label="Base Identification" />
                    <StatusItem active={hasLeader} label="Commander Protocol" />
                    {isTeam && (
                        <StatusItem active={membersComplete} label={`Sub-Unit Sync (${memberCount}/${requiredMembers})`} />
                    )}
                    {formData.eventId === 'devxtreme' && (
                        <StatusItem active={isDevXtremeComplete} label="Hackathon PS & Solution" />
                    )}
                </div>
            </div>

            {/* Action Button */}
            <div className="pt-2 pb-1 mt-auto shrink-0">
                <Button
                    onClick={onSubmit}
                    disabled={isSubmitting || !isReady}
                    className={cn(
                        "w-full h-14 relative overflow-hidden rounded-2xl font-black uppercase tracking-[0.3em] text-xs transition-all duration-500 group",
                        isReady && !isSubmitting
                            ? "bg-[#00D9FF] text-[#0a192f] shadow-[0_0_30px_rgba(0,217,255,0.4)] hover:shadow-[0_0_50px_rgba(0,217,255,0.6)] hover:scale-[1.02]"
                            : "bg-gray-800 text-gray-500 opacity-40 grayscale"
                    )}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/40 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                    <div className="relative flex items-center justify-center gap-3">
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span className="italic">PROCESSING_REQUEST...</span>
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
                    <p className="text-[10px] text-center text-red-400/60 mt-3 font-bold uppercase tracking-widest animate-pulse italic">
                        Missing Required Operational Data
                    </p>
                )}
            </div>
        </div>
    );
};

const StatusItem = ({ active, label }: { active: boolean; label: string }) => (
    <div className={cn(
        "flex items-center gap-3 transition-all duration-300",
        active ? "opacity-100" : "opacity-30"
    )}>
        <div className={cn(
            "w-5 h-5 rounded-lg flex items-center justify-center border transition-all",
            active ? "bg-green-500/20 border-green-500/50 shadow-[0_0_10px_rgba(34,197,94,0.3)]" : "bg-white/5 border-white/10"
        )}>
            {active ? <CheckCircle2 className="w-3 h-3 text-green-400" /> : <div className="w-1.5 h-1.5 rounded-full bg-white/20" />}
        </div>
        <span className={cn(
            "text-[10px] font-bold uppercase tracking-wider",
            active ? "text-green-400" : "text-gray-500"
        )}>
            {label}
        </span>
    </div>
);

export default RegistrationSummary;
