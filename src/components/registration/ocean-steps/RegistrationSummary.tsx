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
    const { formState: { isValid } } = useFormContext<RegistrationFormData>();

    // Safely cast watched values (handling potential undefined during initial render)
    const formData = watchedValues as Partial<RegistrationFormData>;

    // Get entry fee from event configuration or calculate dynamic fee
    const currentEvent = EVENTS.find(e => e.id === formData.eventId);

    let entryFee = currentEvent?.entryFee || 'Free';

    // Dynamic fee logic for DevXtreme
    if (formData.eventId === 'devxtreme') {
        const isTeamReg = formData.registrationType === 'team';
        const college = isTeamReg ? formData.teamLeader?.college : (formData as any).participant?.college;
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
    const isTeam = formData.registrationType === 'team';
    const memberCount = isTeam && formData.teamMembers ? formData.teamMembers.length : 0;
    const requiredMembers = (formData.squadSize || 1) - 1;

    // Calculate progress/completion
    const hasLeader = isTeam ? !!(formData.teamLeader?.name && formData.teamLeader?.email) : !!((formData as any).participant?.name);
    const hasTeamName = isTeam ? !!formData.teamName : true;
    const membersComplete = isTeam ? memberCount >= requiredMembers : true;

    const isReady = isValid && hasLeader && hasTeamName && membersComplete;

    return (
        <div className="h-full flex flex-col space-y-6">
            <div className="flex items-center gap-3 border-b border-[#00D9FF]/20 pb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00D9FF] to-blue-500 flex items-center justify-center shadow-lg shadow-[#00D9FF]/20">
                    <ClipboardList className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-white leading-tight">Registration Status</h3>
                    <p className="text-[#00D9FF]/60 text-xs">Live Overview</p>
                </div>
            </div>

            <div className="flex-grow space-y-4">
                <div className="bg-[#1A1A2E]/80 border border-[#00D9FF]/30 rounded-xl p-5 space-y-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-400 text-xs uppercase tracking-wider">Registration Type</p>
                            <p className="text-[#00D9FF] font-bold text-lg">{isTeam ? 'Team Pass' : 'Solo Entry'}</p>
                        </div>
                        <div className="px-2 py-1 rounded bg-[#00D9FF]/10 text-[#00D9FF] text-xs font-bold border border-[#00D9FF]/30">
                            {eventName}
                        </div>
                    </div>

                    <div className="space-y-4 pt-2 border-t border-[#00D9FF]/10">
                        <div className="flex justify-between items-center text-sm p-2 bg-[#00D9FF]/5 rounded">
                            <span className="text-gray-300">Squad Size</span>
                            <span className="text-white font-bold">{formData.squadSize || 1} Members</span>
                        </div>
                        {isTeam && (
                            <div className="flex justify-between items-center text-sm p-2 bg-[#00D9FF]/5 rounded">
                                <span className="text-gray-300">Members Added</span>
                                <span className={`${memberCount >= requiredMembers ? 'text-[#00D9FF]' : 'text-orange-400'} font-bold`}>
                                    {memberCount} / {requiredMembers}
                                </span>
                            </div>
                        )}
                        <div className="flex justify-between items-center text-sm p-2 bg-[#00D9FF]/5 rounded">
                            <span className="text-gray-300">Entry Fee</span>
                            <span className="text-[#00D9FF] font-bold">{entryFee}</span>
                        </div>
                    </div>
                </div>

                {/* Status Indicators */}
                <div className="space-y-2">
                    <div className={`flex items-center gap-2 text-sm ${hasTeamName ? 'text-green-400' : 'text-gray-500'}`}>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Team Details</span>
                    </div>
                    <div className={`flex items-center gap-2 text-sm ${hasLeader ? 'text-green-400' : 'text-gray-500'}`}>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Leader Information</span>
                    </div>
                    {isTeam && (
                        <div className={`flex items-center gap-2 text-sm ${membersComplete ? 'text-green-400' : 'text-gray-500'}`}>
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Team Members ({memberCount}/{requiredMembers})</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Action Button */}
            <div className="pt-4">
                <button
                    onClick={onSubmit}
                    disabled={isSubmitting || !isReady}
                    className="w-full group relative overflow-hidden rounded-xl bg-gradient-to-r from-[#00D9FF] to-blue-600 p-4 font-bold text-white shadow-[0_0_20px_rgba(0,217,255,0.3)] transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(0,217,255,0.5)] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
                >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    <div className="relative flex items-center justify-center gap-2">
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Processing...</span>
                            </>
                        ) : (
                            <>
                                <span>{buttonText}</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </div>
                </button>
                {!isReady && (
                    <p className="text-center text-red-400/80 text-xs mt-2">
                        Please complete all fields above
                    </p>
                )}
            </div>
        </div>
    );
};

export default RegistrationSummary;
