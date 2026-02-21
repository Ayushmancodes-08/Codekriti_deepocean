import { useFormContext, useWatch } from 'react-hook-form';
import { CheckCircle2, ClipboardList, Loader2, ArrowRight } from 'lucide-react';
import type { RegistrationFormData } from '@/types/registration';
import { EVENTS } from '@/types/registration';

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
        <div className="h-full flex flex-col space-y-3">
            <div className="flex items-center gap-3 border-b border-[#00D9FF]/10 pb-3 shrink-0">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00D9FF]/20 to-blue-600/20 border border-[#00D9FF]/30 flex items-center justify-center shadow-[0_0_15px_rgba(0,217,255,0.1)]">
                    <ClipboardList className="w-4 h-4 text-[#00D9FF]" />
                </div>
                <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-widest">SQUAD STATUS</h3>
                    <p className="text-[#00D9FF]/50 text-[9px] font-medium uppercase tracking-tighter">Mission Live Overview</p>
                </div>
            </div>

            <div className="flex-grow space-y-3 overflow-y-auto custom-scrollbar pr-1 min-h-0">
                <div className="relative bg-gradient-to-br from-[#1A1A2E]/80 to-[#0a192f]/80 border border-[#00D9FF]/20 rounded-xl p-4 overflow-hidden group shrink-0">
                    {/* Holographic Grain Effect */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />

                    <div className="relative z-10 space-y-3">
                        <div className="flex justify-between items-start">
                            <div className="space-y-0.5">
                                <p className="text-gray-500 text-[8px] font-bold uppercase tracking-[0.2em]">ACCESS TYPE</p>
                                <p className="text-white font-black text-base tracking-tight">{isTeam ? 'TEAM PASS' : 'SOLO ENTRY'}</p>
                            </div>
                            <div className="px-2 py-0.5 rounded-full bg-[#00D9FF]/10 text-[#00D9FF] text-[9px] font-black border border-[#00D9FF]/20 shadow-[0_0_10px_rgba(0,217,255,0.1)] uppercase tracking-wider">
                                {eventName}
                            </div>
                        </div>

                        {/* High-tech divider */}
                        <div className="flex items-center gap-2 py-0.5">
                            <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent via-[#00D9FF]/30 to-transparent" />
                            <div className="w-1 h-1 rounded-full bg-[#00D9FF]/50" />
                            <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent via-[#00D9FF]/30 to-transparent" />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-[10px] p-2 bg-white/[0.02] border border-white/[0.05] rounded-lg group-hover:bg-white/[0.05] transition-colors">
                                <span className="text-gray-400 font-medium uppercase tracking-wider">Squad Size</span>
                                <span className="text-[#00D9FF] font-black">{formData.squadSize || 1} UNIT{formData.squadSize !== 1 ? 'S' : ''}</span>
                            </div>
                            {isTeam && (
                                <div className="flex justify-between items-center text-[10px] p-2 bg-white/[0.02] border border-white/[0.05] rounded-lg group-hover:bg-white/[0.05] transition-colors">
                                    <span className="text-gray-400 font-medium uppercase tracking-wider">Units Synced</span>
                                    <span className={`font-black ${memberCount >= requiredMembers ? 'text-green-400' : 'text-yellow-400'}`}>
                                        {memberCount} / {requiredMembers}
                                    </span>
                                </div>
                            )}
                            <div className="flex justify-between items-center text-[10px] p-2.5 bg-[#00D9FF]/5 border border-[#00D9FF]/10 rounded-lg group-hover:bg-[#00D9FF]/10 transition-colors">
                                <span className="text-[#00D9FF] font-bold uppercase tracking-widest">Entry Credits</span>
                                <span className="text-white font-black text-sm">{entryFee}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Status Indicators */}
                <div className="space-y-2 px-1">
                    <StatusItem active={hasTeamName} label="Base Identification" />
                    <StatusItem active={hasLeader} label="Commander Protocol" />
                    {isTeam && (
                        <StatusItem active={membersComplete} label={`Sub-Unit Sync (${memberCount}/${requiredMembers})`} />
                    )}
                </div>
            </div>

            {/* Action Button */}
            <div className="pt-0 pb-1 mt-auto shrink-0">
                <button
                    onClick={onSubmit}
                    disabled={isSubmitting || !isReady}
                    className="w-full group relative overflow-hidden rounded-xl bg-[#00D9FF] p-3.5 font-black text-[#0a192f] uppercase tracking-[0.2em] text-xs shadow-[0_0_30px_rgba(0,217,255,0.4)] transition-all hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(0,217,255,0.6)] disabled:opacity-30 disabled:hover:scale-100 disabled:cursor-not-allowed group"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/40 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                    <div className="relative flex items-center justify-center gap-2">
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>Processing...</span>
                            </>
                        ) : (
                            <>
                                <span>{buttonText}</span>
                                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </div>
                </button>
            </div>
        </div>
    );
};

const StatusItem = ({ active, label }: { active: boolean; label: string }) => (
    <div className={`flex items-center gap-3 transition-all duration-300 ${active ? 'opacity-100' : 'opacity-30'}`}>
        <div className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all ${active ? 'bg-green-500/20 border-green-500/50 shadow-[0_0_10px_rgba(34,197,94,0.3)]' : 'bg-white/5 border-white/10'
            }`}>
            {active ? <CheckCircle2 className="w-3 h-3 text-green-400" /> : <div className="w-1.5 h-1.5 rounded-full bg-white/20" />}
        </div>
        <span className={`text-[10px] font-bold uppercase tracking-wider ${active ? 'text-green-400' : 'text-gray-500'}`}>
            {label}
        </span>
    </div>
);

export default RegistrationSummary;
