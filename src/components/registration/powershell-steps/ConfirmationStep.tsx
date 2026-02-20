import { useFormContext } from 'react-hook-form';
import { CheckCircle } from 'lucide-react';
import type { RegistrationFormData } from '@/types/registration';

const ConfirmationStep = () => {
    const { watch } = useFormContext<RegistrationFormData>();
    const data = watch();

    return (
        <div className="space-y-6">
            <div className="text-[#00FF00] mb-6">
                <div className="mb-2">&gt; CONFIRM-REGISTRATION</div>
                <div className="text-gray-400 text-sm">Review your information before submitting</div>
            </div>

            <div className="p-6 bg-black/50 border-2 border-[#00FF00]/30 rounded space-y-4">
                <div className="flex items-center gap-2 text-[#00FF00] font-bold border-b border-[#00FF00]/30 pb-2">
                    <CheckCircle className="w-5 h-5" />
                    REGISTRATION SUMMARY
                </div>

                {(data.registrationType ?? 'team') === 'solo' ? (
                    <div className="space-y-3 text-sm">
                        <div>
                            <span className="text-gray-400">&gt; Name:</span>
                            <span className="text-white ml-2">{data.participant?.name || 'Not provided'}</span>
                        </div>
                        <div>
                            <span className="text-gray-400">&gt; Email:</span>
                            <span className="text-white ml-2">{data.participant?.email || 'Not provided'}</span>
                        </div>
                        <div>
                            <span className="text-gray-400">&gt; Phone:</span>
                            <span className="text-white ml-2">{data.participant?.phone || 'Not provided'}</span>
                        </div>
                        <div>
                            <span className="text-gray-400">&gt; College:</span>
                            <span className="text-white ml-2">{data.participant?.college || 'Not provided'}</span>
                        </div>
                        <div>
                            <span className="text-gray-400">&gt; Branch:</span>
                            <span className="text-white ml-2">{data.participant?.branch || 'Not selected'}</span>
                        </div>
                        <div>
                            <span className="text-gray-400">&gt; Year:</span>
                            <span className="text-white ml-2">{data.participant?.yearOfStudy || 'Not selected'}</span>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4 text-sm">
                        <div>
                            <span className="text-gray-400">&gt; Team Name:</span>
                            <span className="text-white ml-2 font-bold">{data.teamName || 'Not provided'}</span>
                        </div>

                        <div className="border-t border-[#0178D4]/30 pt-3">
                            <div className="text-[#00FF00] font-bold mb-2">TEAM LEADER</div>
                            <div className="space-y-2 ml-4">
                                <div>
                                    <span className="text-gray-400">Name:</span>
                                    <span className="text-white ml-2">{data.teamLeader?.name || 'Not provided'}</span>
                                </div>
                                <div>
                                    <span className="text-gray-400">Email:</span>
                                    <span className="text-white ml-2">{data.teamLeader?.email || 'Not provided'}</span>
                                </div>
                                <div>
                                    <span className="text-gray-400">Phone:</span>
                                    <span className="text-white ml-2">{data.teamLeader?.phone || 'Not provided'}</span>
                                </div>
                            </div>
                        </div>

                        {data.teamMembers && data.teamMembers.length > 0 && (
                            <div className="border-t border-[#0178D4]/30 pt-3">
                                <div className="text-[#00FF00] font-bold mb-2">TEAM MEMBERS</div>
                                {data.teamMembers.map((member, idx) => (
                                    <div key={idx} className="ml-4 mb-3 pb-3 border-b border-gray-700 last:border-0">
                                        <div className="text-white font-bold mb-1">Member {idx + 1}</div>
                                        <div className="space-y-1 ml-2 text-xs">
                                            <div>
                                                <span className="text-gray-400">Name:</span>
                                                <span className="text-white ml-2">{member.name}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-400">Email:</span>
                                                <span className="text-white ml-2">{member.email}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="p-4 bg-[#00FF00]/10 border border-[#00FF00] rounded text-sm">
                <div className="text-[#00FF00] font-bold mb-2">⚡ READY TO SUBMIT</div>
                <div className="text-gray-300">
                    Click "SUBMIT" to complete your registration. You will receive a confirmation email shortly.
                </div>
            </div>
        </div>
    );
};

export default ConfirmationStep;
