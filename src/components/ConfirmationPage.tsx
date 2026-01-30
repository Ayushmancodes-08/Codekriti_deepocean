import React from 'react';
import { motion } from 'framer-motion';
import { Download, CheckCircle, Mail, User, Users, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { RegistrationData } from '../lib/schemas';
import {
    isSingleParticipantRegistration,
    getParticipantName,
    getParticipantEmail,
    getParticipantPhone,
    getEventConfig,
} from '../lib/formUtils';
import { downloadConfirmationHTML, printConfirmation } from '../lib/downloadConfirmation';

interface ConfirmationPageProps {
    confirmationId: string;
    registrationData: RegistrationData;
    onReset?: () => void;
}

export const ConfirmationPage = React.forwardRef<HTMLDivElement, ConfirmationPageProps>(
    ({ confirmationId, registrationData, onReset }, ref) => {
        const participantName = getParticipantName(registrationData);
        const participantEmail = getParticipantEmail(registrationData);
        const participantPhone = getParticipantPhone(registrationData);
        const eventConfig = getEventConfig(registrationData.eventType);
        const isSingle = isSingleParticipantRegistration(registrationData);

        const handleDownload = () => {
            downloadConfirmationHTML(confirmationId, registrationData);
        };

        const handlePrint = () => {
            printConfirmation(confirmationId, registrationData);
        };

        return (
            <motion.div
                ref={ref}
                className="w-full max-w-3xl mx-auto p-6 md:p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                {/* Success Icon with Animation */}
                <motion.div
                    className="flex justify-center mb-8"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
                >
                    <div className="relative">
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur-xl opacity-50"
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.5, 0.3, 0.5],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                        />
                        <div className="relative bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full p-6 shadow-2xl">
                            <CheckCircle className="w-16 h-16 text-white" strokeWidth={2.5} />
                        </div>
                    </div>
                </motion.div>

                {/* Success Message */}
                <motion.div
                    className="text-center mb-8"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                        Registration Confirmed!
                    </h1>
                    <p className="text-lg text-white/70">
                        Welcome to CodeKriti 4.0 2026 🌊
                    </p>
                </motion.div>

                {/* Confirmation ID Card */}
                <motion.div
                    className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-6 mb-6"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <p className="text-sm text-cyan-400 font-semibold uppercase tracking-wider mb-2">
                        Confirmation ID
                    </p>
                    <p className="text-3xl md:text-4xl font-bold text-white font-mono tracking-wider">
                        {confirmationId}
                    </p>
                    <p className="text-sm text-white/60 mt-2">
                        Please save this ID for your records
                    </p>
                </motion.div>

                {/* Registration Summary */}
                <motion.div
                    className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-6 space-y-6"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    {/* Event Details */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Calendar className="w-5 h-5 text-cyan-400" />
                            <h3 className="text-lg font-semibold text-white">Event Details</h3>
                        </div>
                        <div className="bg-white/5 rounded-lg p-4 border-l-4 border-cyan-500">
                            <p className="text-xl font-bold text-white mb-1">{eventConfig.name}</p>
                            <p className="text-sm text-white/70">{eventConfig.description}</p>
                        </div>
                    </div>

                    {/* Participant/Team Leader Details */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            {isSingle ? (
                                <User className="w-5 h-5 text-cyan-400" />
                            ) : (
                                <Users className="w-5 h-5 text-cyan-400" />
                            )}
                            <h3 className="text-lg font-semibold text-white">
                                {isSingle ? 'Participant' : 'Team Leader'} Details
                            </h3>
                        </div>
                        <div className="bg-white/5 rounded-lg p-4 space-y-2">
                            <p className="text-lg font-semibold text-white">{participantName}</p>
                            <div className="flex items-center gap-2 text-sm text-white/70">
                                <Mail className="w-4 h-4" />
                                <span>{participantEmail}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-white/70">
                                <span>📱</span>
                                <span>{participantPhone}</span>
                            </div>
                        </div>
                    </div>

                    {/* Team Members (if applicable) */}
                    {!isSingle && 'members' in registrationData && (
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <Users className="w-5 h-5 text-cyan-400" />
                                <h3 className="text-lg font-semibold text-white">
                                    Team Members ({registrationData.members.length})
                                </h3>
                            </div>
                            <div className="space-y-3">
                                {registrationData.members.map((member, index) => (
                                    <div
                                        key={index}
                                        className="bg-white/5 rounded-lg p-4 border-l-2 border-cyan-500/50"
                                    >
                                        <p className="font-semibold text-white mb-1">{member.name}</p>
                                        <p className="text-sm text-white/60">{member.email}</p>
                                        <p className="text-sm text-white/60">
                                            {member.college} - {member.branch}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Important Information */}
                <motion.div
                    className="bg-gradient-to-br from-orange-500/10 to-amber-500/10 backdrop-blur-sm border border-orange-500/30 rounded-2xl p-6 mb-8"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <p className="text-orange-400 font-semibold mb-3 flex items-center gap-2">
                        <span>📌</span>
                        Important Information
                    </p>
                    <ul className="space-y-2 text-sm text-white/80">
                        <li className="flex items-start gap-2">
                            <span className="text-orange-400 mt-0.5">•</span>
                            <span>You will receive an email confirmation shortly</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-orange-400 mt-0.5">•</span>
                            <span>Keep your confirmation ID handy for the event day</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-orange-400 mt-0.5">•</span>
                            <span>Check your email for further updates and event details</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-orange-400 mt-0.5">•</span>
                            <span>Download your confirmation for offline access</span>
                        </li>
                    </ul>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                >
                    <Button
                        onClick={handleDownload}
                        className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center gap-2 min-h-11 touch-manipulation focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                    >
                        <Download className="w-5 h-5" />
                        Download Confirmation
                    </Button>
                    <Button
                        onClick={handlePrint}
                        variant="outline"
                        className="border-2 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 font-semibold py-3 px-6 rounded-lg transition-all duration-200 min-h-11 touch-manipulation focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                    >
                        Print Confirmation
                    </Button>
                </motion.div>

                {/* Reset Button */}
                {onReset && (
                    <motion.div
                        className="text-center mt-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                    >
                        <button
                            onClick={onReset}
                            className="text-white/60 hover:text-white transition-colors duration-200 text-sm underline focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded px-2 py-1"
                        >
                            Register for Another Event
                        </button>
                    </motion.div>
                )}
            </motion.div>
        );
    }
);

ConfirmationPage.displayName = 'ConfirmationPage';
