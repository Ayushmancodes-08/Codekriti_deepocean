import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Waves, Users, User } from 'lucide-react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { registrationSchema, SOLO_STEPS, TEAM_STEPS, EVENTS, type RegistrationFormData } from '@/types/registration';
import EventSelectionStep from './ocean-steps/EventSelectionStep';
import SoloDetailsStep from './ocean-steps/SoloDetailsStep';
import TeamInfoStep from './ocean-steps/TeamInfoStep';
import TeamMembersStep from './ocean-steps/TeamMembersStep';
import ConfirmationStep from './ocean-steps/ConfirmationStep';

import { submitRegistration } from '@/utils/googleSheets';
import DigitalTicket from './DigitalTicket';

interface OceanRegistrationModalProps {
    isOpen: boolean;
    onClose: () => void;
    preSelectedEventId?: string | null;
}

const OceanRegistrationModal = ({ isOpen, onClose, preSelectedEventId }: OceanRegistrationModalProps) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
    const [squadSize, setSquadSize] = useState<number>(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [ticketData, setTicketData] = useState<any>(null); // For Digital Ticket

    // Helper to close and reset state
    const handleClose = () => {
        setTicketData(null);
        setCurrentStep(1);
        setSelectedEvent(null);
        onClose();
    };

    const isSolo = squadSize === 1;
    const steps = isSolo ? SOLO_STEPS : TEAM_STEPS;
    const maxSteps = steps.length;

    const methods = useForm<RegistrationFormData>({
        resolver: zodResolver(registrationSchema),
        mode: 'onBlur',
    });

    const { handleSubmit, setValue } = methods;

    // Handle pre-selected event
    useEffect(() => {
        if (preSelectedEventId && isOpen) {
            setSelectedEvent(preSelectedEventId);
            setValue('eventId', preSelectedEventId);

            // Auto-determine squad size based on event
            const eventConfig = {
                'algotocode': 1,
                'designathon': 1,
                'techmaze': 3,
                'devxtreme': 4
            };
            const size = eventConfig[preSelectedEventId as keyof typeof eventConfig] || 1;
            setSquadSize(size);
            setValue('squadSize', size as any);
            setValue('registrationType', size === 1 ? 'solo' : 'team');

            // Skip to next step if event is pre-selected
            setCurrentStep(2);
        }
    }, [preSelectedEventId, isOpen, setValue]);

    // Body scroll lock
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = '0px'; // Prevent layout shift
        } else {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        }
        return () => {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        };
    }, [isOpen]);

    // ESC key handler
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                handleClose();
            }
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    const handleEventSelection = (eventId: string, size: number) => {
        setSelectedEvent(eventId);
        setSquadSize(size);
        setValue('eventId', eventId);
        setValue('squadSize', size as any);
        setValue('registrationType', size === 1 ? 'solo' : 'team');
    };

    const validateCurrentStep = async (): Promise<boolean> => {
        if (currentStep === 1) {
            return selectedEvent !== null;
        }
        return true;
    };

    const handleNext = async () => {
        const isValid = await validateCurrentStep();

        if (isValid) {
            if (currentStep < maxSteps) {
                setCurrentStep(currentStep + 1);
            }
        } else {
            toast.error('Please complete all required fields');
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const onSubmit = async (data: RegistrationFormData) => {
        setIsSubmitting(true);

        try {
            console.log('Registration data:', data);

            // Get Event Name for Sheet Name
            const eventConfig = EVENTS.find(e => e.id === data.eventId);
            const sheetEventName = eventConfig ? eventConfig.name : data.eventId;

            // Structure data for Google Sheet
            const sheetData = {
                teamName: data.registrationType === 'team' ? data.teamName : 'Solo - ' + data.participant.name,
                leaderName: data.registrationType === 'team' ? data.teamLeader.name : data.participant.name,
                email: data.registrationType === 'team' ? data.teamLeader.email : data.participant.email,
                phone: data.registrationType === 'team' ? data.teamLeader.phone : data.participant.phone,
                members: data.registrationType === 'team' ? data.teamMembers.map(m => m.name) : [],
                year: data.registrationType === 'team' ? data.teamLeader.yearOfStudy : data.participant.yearOfStudy,
                branch: data.registrationType === 'team' ? data.teamLeader.branch : data.participant.branch,
                college: data.registrationType === 'team' ? data.teamLeader.college : data.participant.college,
                event: sheetEventName, // Send Name instead of ID
                subscribe: !!data.subscribe
            };

            // Send to Google Script
            // Use real submission logic
            const response = await submitRegistration(sheetData);

            if (response.status === 'success') {
                toast.success('🌊 Registration successful! Dive deep with us!');

                // Set data for Digital Ticket
                setTicketData({
                    name: sheetData.leaderName,
                    teamName: sheetData.teamName,
                    event: sheetData.event,
                    id: response.id || 'CK-PENDING', // Use Backend ID
                    qrPayload: response.qrData, // Use Backend Secure QR
                    date: new Date().toLocaleDateString()
                });
            } else {
                throw new Error(response.message || 'Registration failed');
            }

        } catch (error: any) {
            console.error('Registration error:', error);
            // Show ACTUAL error
            toast.error(error.message || 'Registration failed. Please check your connection.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStep = () => {
        if (currentStep === 1) {
            return (
                <EventSelectionStep
                    selectedEvent={selectedEvent}
                    squadSize={squadSize}
                    onSelect={handleEventSelection}
                />
            );
        }

        if (isSolo) {
            switch (currentStep) {
                case 2:
                    return <SoloDetailsStep />;
                case 3:
                    return <ConfirmationStep />;
                default:
                    return null;
            }
        } else {
            switch (currentStep) {
                case 2:
                    return <TeamInfoStep />;
                case 3:
                    return <TeamMembersStep squadSize={squadSize} />;
                case 4:
                    return <ConfirmationStep />;
                default:
                    return null;
            }
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={handleClose}
                >
                    {/* Ocean Rock Modal Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="w-full max-w-5xl max-h-[90vh] relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {ticketData ? (
                            <DigitalTicket data={ticketData} onClose={handleClose} />
                        ) : (
                            <div
                                className="relative rounded-2xl shadow-2xl border border-[#00D9FF]/30 overflow-hidden"
                                style={{
                                    backgroundImage: `url('/images/sea-rock-texture.png')`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                }}
                            >
                                {/* Dark overlay to make text readable */}
                                <div className="absolute inset-0 bg-gradient-to-br from-[#0a192f]/95 via-[#112240]/90 to-[#0a192f]/95" />

                                {/* Animated Water Effect */}
                                <div className="absolute inset-0 opacity-10 pointer-events-none">
                                    <motion.div
                                        className="absolute inset-0"
                                        style={{
                                            background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0, 217, 255, 0.1) 3px, rgba(0, 217, 255, 0.1) 6px)',
                                        }}
                                        animate={{
                                            y: [0, -6],
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: 'linear',
                                        }}
                                    />
                                </div>

                                {/* Glow Effects - Subtle Blue Only */}
                                <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#00D9FF]/5 rounded-full blur-2xl" />
                                <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-cyan-500/5 rounded-full blur-2xl" />
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/3 rounded-full blur-3xl" />

                                {/* Header */}
                                <div className="relative border-b border-[#00D9FF]/20 bg-[#0a192f]/80 backdrop-blur-sm px-8 py-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-blue-900/50 border border-blue-700/50 flex items-center justify-center">
                                                <Waves className="w-6 h-6 text-[#00D9FF]" />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-bold bg-gradient-to-r from-[#00D9FF] via-cyan-300 to-blue-400 bg-clip-text text-transparent">
                                                    Deep Dive Registration
                                                </h2>
                                                <p className="text-[#00D9FF]/70 text-sm mt-1">
                                                    {steps[currentStep - 1].description}
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={onClose}
                                            className="text-[#00D9FF] hover:text-white hover:bg-[#00D9FF]/10 p-2 rounded-lg transition-all"
                                        >
                                            <X className="w-6 h-6" />
                                        </button>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="mt-6 space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-[#00D9FF]/80 font-medium">
                                                Step {currentStep} of {maxSteps}
                                            </span>
                                            <span className="text-gray-400">
                                                {Math.round((currentStep / maxSteps) * 100)}% Complete
                                            </span>
                                        </div>
                                        <div className="h-2 bg-[#0a192f]/50 rounded-full overflow-hidden border border-[#00D9FF]/20">
                                            <motion.div
                                                className="h-full bg-[#00D9FF]"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(currentStep / maxSteps) * 100}%` }}
                                                transition={{ duration: 0.5, ease: 'easeOut' }}
                                            />
                                        </div>
                                    </div>

                                    {/* Step Indicators */}
                                    <div className="mt-4 flex items-center gap-2">
                                        {steps.map((step, idx) => (
                                            <div key={step.step} className="flex items-center gap-2 flex-1">
                                                <div
                                                    className={`relative px-3 py-2 rounded-lg text-xs font-medium transition-all ${currentStep === step.step
                                                        ? 'bg-blue-900 text-white border border-blue-700'
                                                        : currentStep > step.step
                                                            ? 'bg-blue-900/50 text-[#00D9FF] border border-[#00D9FF]/30'
                                                            : 'bg-[#0a192f]/50 text-gray-500 border border-gray-700'
                                                        }`}
                                                >
                                                    {step.command.replace(/-/g, ' ')}
                                                </div>
                                                {idx < steps.length - 1 && (
                                                    <ChevronRight className="w-4 h-4 text-gray-600 flex-shrink-0" />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="relative p-8 overflow-y-auto max-h-[calc(90vh-320px)]">
                                    <FormProvider {...methods}>
                                        <form onSubmit={handleSubmit(onSubmit)}>
                                            <AnimatePresence mode="wait">
                                                <motion.div
                                                    key={currentStep}
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: -20 }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    {renderStep()}
                                                </motion.div>
                                            </AnimatePresence>
                                        </form>
                                    </FormProvider>
                                </div>

                                {/* Footer */}
                                <div className="relative border-t border-[#00D9FF]/20 bg-[#0a192f]/80 backdrop-blur-sm px-8 py-6">
                                    <div className="flex items-center justify-between gap-4">
                                        <button
                                            type="button"
                                            onClick={handleBack}
                                            disabled={currentStep === 1}
                                            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0a192f] text-[#00D9FF] hover:bg-[#00D9FF]/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-[#00D9FF]/30 font-medium"
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                            Back
                                        </button>

                                        <div className="flex items-center gap-2 text-sm text-gray-400">
                                            {isSolo ? <User className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                                            <span>{isSolo ? 'Solo Registration' : `Team of ${squadSize}`}</span>
                                        </div>

                                        {currentStep < maxSteps ? (
                                            <button
                                                type="button"
                                                onClick={handleNext}
                                                className="flex items-center gap-2 px-8 py-3 rounded-xl bg-[#00D9FF]/20 text-[#00D9FF] hover:bg-[#00D9FF]/30 border border-[#00D9FF]/30 hover:border-[#00D9FF]/50 hover:shadow-lg hover:shadow-[#00D9FF]/10 transition-all font-bold"
                                            >
                                                Next
                                                <ChevronRight className="w-5 h-5" />
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={handleSubmit(onSubmit)}
                                                disabled={isSubmitting}
                                                className="flex items-center gap-2 px-8 py-3 rounded-xl bg-[#00D9FF]/20 text-[#00D9FF] hover:bg-[#00D9FF]/30 border border-[#00D9FF]/30 hover:border-[#00D9FF]/50 hover:shadow-lg hover:shadow-cyan-500/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold"
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <motion.div
                                                            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                                            animate={{ rotate: 360 }}
                                                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                                        />
                                                        Submitting...
                                                    </>
                                                ) : (
                                                    <>
                                                        Complete Registration
                                                        <ChevronRight className="w-5 h-5" />
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default OceanRegistrationModal;
