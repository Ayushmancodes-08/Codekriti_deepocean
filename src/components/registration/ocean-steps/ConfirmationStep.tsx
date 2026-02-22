import { useFormContext } from 'react-hook-form';
import { CheckCircle, Users, User } from 'lucide-react';
import type { RegistrationFormData } from '@/types/registration';

const ConfirmationStep = () => {
    const methods = useFormContext<RegistrationFormData>();
    const { watch, register } = methods;
    const data = watch();

    return (
        <div className="space-y-6">
            <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                    <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Confirm Your Registration</h3>
                <p className="text-gray-400 text-sm">Review your information before final submission</p>
            </div>

            <div className="p-6 bg-[#0a192f] border border-cyan-500/20 rounded-xl space-y-6 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
                {data.registrationType === 'solo' ? (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-cyan-400 font-bold pb-3 border-b border-gray-700">
                            <User className="w-5 h-5" />
                            Solo Participant
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-gray-500 mb-1">Name</p>
                                <p className="text-white font-medium">{data.participant.name || '-'}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 mb-1">Email</p>
                                <p className="text-white font-medium break-all">{data.participant.email || '-'}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 mb-1">Phone</p>
                                <p className="text-white font-medium">{data.participant.phone || '-'}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 mb-1">College</p>
                                <p className="text-white font-medium">{data.participant.college || '-'}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 mb-1">Branch</p>
                                <p className="text-white font-medium">{data.participant.branch || '-'}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 mb-1">Year</p>
                                <p className="text-white font-medium">{data.participant.yearOfStudy || '-'}</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between pb-3 border-b border-gray-700">
                            <div className="flex items-center gap-2 text-cyan-400 font-bold">
                                <Users className="w-5 h-5" />
                                Team Registration
                            </div>
                            <p className="text-white font-bold">{(data as any).teamName || 'Team Name'}</p>
                        </div>

                        {/* Team Leader */}
                        <div className="p-4 bg-[#112240] rounded-lg border border-gray-700">
                            <p className="text-cyan-400 font-bold mb-3 flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Team Leader
                            </p>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <p className="text-gray-500 text-xs mb-1">Name</p>
                                    <p className="text-white">{(data as any).teamLeader?.name || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs mb-1">Email</p>
                                    <p className="text-white break-all">{(data as any).teamLeader?.email || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs mb-1">Phone</p>
                                    <p className="text-white">{(data as any).teamLeader?.phone || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs mb-1">College</p>
                                    <p className="text-white">{(data as any).teamLeader?.college || '-'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Team Members */}
                        {(data as any).teamMembers && (data as any).teamMembers.length > 0 && (
                            <div>
                                <p className="text-white font-bold mb-3 text-sm">Team Members ({(data as any).teamMembers.length})</p>
                                <div className="space-y-3">
                                    {(data as any).teamMembers.map((member: any, idx: number) => (
                                        <div key={idx} className="p-3 bg-[#112240] rounded-lg border border-gray-700">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-white font-medium text-sm">{member.name}</p>
                                                    <p className="text-gray-400 text-xs">{member.email}</p>
                                                </div>
                                                <div className="w-6 h-6 rounded-full bg-cyan-900/50 flex items-center justify-center text-cyan-400 text-xs font-bold border border-cyan-500/30">
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
            <div className="p-4 rounded-xl border border-gray-700 bg-[#0a192f] flex items-start gap-3 hover:border-cyan-500/30 transition-colors">
                <input
                    type="checkbox"
                    id="subscribe"
                    className="mt-1 w-4 h-4 rounded border-gray-600 bg-[#112240] text-cyan-500 focus:ring-cyan-500 focus:ring-offset-0"
                    {...register('subscribe')}
                />
                <label htmlFor="subscribe" className="text-sm text-gray-400 cursor-pointer select-none">
                    <span className="text-white font-medium block mb-1">Subscribe to CodeKriti Newsletter</span>
                    Get updates, match schedules, and exclusive news delivered to your inbox.
                </label>
            </div>

            <div className="p-4 bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/20 rounded-xl">
                <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                    <div>
                        <p className="text-emerald-100 font-bold text-sm">Ready to Submit!</p>
                        <p className="text-emerald-400/70 text-xs">Click "Complete Registration" to finish</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationStep;
