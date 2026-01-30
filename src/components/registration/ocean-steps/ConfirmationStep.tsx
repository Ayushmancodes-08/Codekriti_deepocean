import { useFormContext } from 'react-hook-form';
import { CheckCircle, Users, User } from 'lucide-react';
import type { RegistrationFormData } from '@/types/registration';

const ConfirmationStep = () => {
    const { watch } = useFormContext<RegistrationFormData>();
    const data = watch();

    return (
        <div className="space-y-6">
            <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00D9FF] to-blue-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#00D9FF]/30">
                    <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Confirm Your Registration</h3>
                <p className="text-gray-400">Review your information before diving in</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-[#00D9FF]/10 to-blue-500/10 border-2 border-[#00D9FF]/30 rounded-xl space-y-6">
                {data.registrationType === 'solo' ? (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-[#00D9FF] font-bold pb-3 border-b border-[#00D9FF]/30">
                            <User className="w-5 h-5" />
                            Solo Participant
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-gray-500 mb-1">Name</p>
                                <p className="text-white font-medium">{data.participant?.name || '-'}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 mb-1">Email</p>
                                <p className="text-white font-medium">{data.participant?.email || '-'}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 mb-1">Phone</p>
                                <p className="text-white font-medium">{data.participant?.phone || '-'}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 mb-1">College</p>
                                <p className="text-white font-medium">{data.participant?.college || '-'}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 mb-1">Branch</p>
                                <p className="text-white font-medium">{data.participant?.branch || '-'}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 mb-1">Year</p>
                                <p className="text-white font-medium">{data.participant?.yearOfStudy || '-'}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between pb-3 border-b border-[#00D9FF]/30">
                            <div className="flex items-center gap-2 text-[#00D9FF] font-bold">
                                <Users className="w-5 h-5" />
                                Team Registration
                            </div>
                            <p className="text-white font-bold">{data.teamName || 'Team Name'}</p>
                        </div>

                        {/* Team Leader */}
                        <div className="p-4 bg-[#1A1A2E]/50 rounded-lg border border-[#00D9FF]/20">
                            <p className="text-cyan-400 font-bold mb-3 flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Team Leader
                            </p>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <p className="text-gray-500 text-xs mb-1">Name</p>
                                    <p className="text-white">{data.teamLeader?.name || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs mb-1">Email</p>
                                    <p className="text-white">{data.teamLeader?.email || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs mb-1">Phone</p>
                                    <p className="text-white">{data.teamLeader?.phone || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs mb-1">College</p>
                                    <p className="text-white">{data.teamLeader?.college || '-'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Team Members */}
                        {data.teamMembers && data.teamMembers.length > 0 && (
                            <div>
                                <p className="text-white font-bold mb-3">Team Members ({data.teamMembers.length})</p>
                                <div className="space-y-3">
                                    {data.teamMembers.map((member, idx) => (
                                        <div key={idx} className="p-3 bg-[#1A1A2E]/30 rounded-lg border border-[#00D9FF]/10">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-white font-medium">{member.name}</p>
                                                    <p className="text-gray-400 text-xs">{member.email}</p>
                                                </div>
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00D9FF] to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                                                    {idx + 1}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Newsletter Subscription */}
            <div className="p-4 rounded-xl border border-[#00D9FF]/30 bg-[#1A1A2E]/50 flex items-start gap-3">
                <input
                    type="checkbox"
                    id="subscribe"
                    className="mt-1 w-4 h-4 rounded border-gray-600 bg-black/50 text-[#00D9FF] focus:ring-[#00D9FF] focus:ring-offset-0"
                    {...useFormContext().register('subscribe')}
                />
                <label htmlFor="subscribe" className="text-sm text-gray-300 cursor-pointer select-none">
                    <span className="text-white font-bold block mb-1">Subscribe to Abyss Daily</span>
                    Get daily updates, match schedules, and exclusive CodeKriti news delivered to your inbox.
                </label>
            </div>

            <div className="p-4 bg-gradient-to-r from-[#00D9FF]/20 to-blue-500/20 border border-[#00D9FF]/50 rounded-xl">
                <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-[#00D9FF]" />
                    <div>
                        <p className="text-white font-bold">Ready to Submit!</p>
                        <p className="text-gray-300 text-sm">Click "Complete Registration" to finish</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationStep;
