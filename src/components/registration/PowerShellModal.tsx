import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Terminal } from 'lucide-react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { registrationSchema, EVENTS, SOLO_STEPS, TEAM_STEPS, type RegistrationFormData } from '@/types/registration';
import EventSelectionStep from './powershell-steps/EventSelectionStep';
import SoloDetailsStep from './powershell-steps/SoloDetailsStep';
import TeamInfoStep from './powershell-steps/TeamInfoStep';
import TeamMembersStep from './powershell-steps/TeamMembersStep';
import ConfirmationStep from './powershell-steps/ConfirmationStep';

interface PowerShellModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const PowerShellModal = ({ isOpen, onClose }: PowerShellModalProps) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
    const [squadSize, setSquadSize] = useState<number>(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isSolo = squadSize === 1;
    const steps = isSolo ? SOLO_STEPS : TEAM_STEPS;
    const maxSteps = steps.length;

    const methods = useForm<RegistrationFormData>({
        resolver: zodResolver(registrationSchema),
        mode: 'onBlur',
        defaultValues: {
            registrationType: 'team',
            teamMembers: [],
        } as any,
    });

    const { handleSubmit, setValue, trigger } = methods;

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
        // Add more validation as needed
        return true;
    };

    const handleNext = async () => {
        const isValid = await validateCurrentStep();

        if (isValid) {
            if (currentStep < maxSteps) {
                setCurrentStep(currentStep + 1);
            }
        } else {
            toast.error('> ERROR: Please complete all required fields');
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
            console.log('> EXECUTING: Submit-Registration');
            console.log('> DATA:', data);

            await new Promise((resolve) => setTimeout(resolve, 2000));

            toast.success('> SUCCESS: Registration completed successfully');
            onClose();

            methods.reset();
            setCurrentStep(1);
            setSelectedEvent(null);
            setSquadSize(1);
        } catch (error) {
            console.error('> ERROR:', error);
            toast.error('> ERROR: Registration failed. Please retry.');
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
            // Solo workflow
            switch (currentStep) {
                case 2:
                    return <SoloDetailsStep />;
                case 3:
                    return <ConfirmationStep />;
                default:
                    return null;
            }
        } else {
            // Team workflow
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
                    className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    {/* PowerShell Terminal Window */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="w-full max-w-5xl max-h-[90vh] relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Terminal Container */}
                        <div className="bg-[#012456] border-2 border-[#0178D4] shadow-2xl shadow-blue-500/20 rounded-lg overflow-hidden font-mono">
                            {/* Title Bar */}
                            <div className="bg-[#0178D4] px-4 py-2 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-white">
                                    <Terminal className="w-4 h-4" />
                                    <span className="text-sm font-semibold">
                                        Windows PowerShell - Registration Terminal
                                    </span>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="text-white hover:bg-red-600 w-8 h-8 flex items-center justify-center rounded transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Terminal Header */}
                            <div className="bg-[#002B5C] border-b border-[#0178D4] px-6 py-4">
                                <div className="text-[#00FF00] text-sm space-y-1">
                                    <div>CodeKriti 4.0 Registration System v2.0</div>
                                    <div className="text-gray-400">
                                        PS C:\CodeKriti\Registration&gt; {steps[currentStep - 1].command}
                                    </div>
                                </div>
                            </div>

                            {/* Progress Indicator */}
                            <div className="bg-[#001A3D] px-6 py-3 border-b border-[#0178D4]/50">
                                <div className="flex items-center gap-2 text-xs">
                                    {steps.map((step, idx) => (
                                        <div key={step.step} className="flex items-center gap-2">
                                            <div
                                                className={`px-3 py-1 rounded ${currentStep === step.step
                                                        ? 'bg-[#00FF00] text-black font-bold'
                                                        : currentStep > step.step
                                                            ? 'bg-[#0178D4] text-white'
                                                            : 'bg-gray-700 text-gray-400'
                                                    }`}
                                            >
                                                {step.command}
                                            </div>
                                            {idx < steps.length - 1 && (
                                                <ChevronRight className="w-4 h-4 text-gray-600" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Terminal Content */}
                            <div className="bg-[#012456] p-6 overflow-y-auto max-h-[calc(90vh-220px)] text-white">
                                <FormProvider {...methods}>
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <AnimatePresence mode="wait">
                                            <motion.div
                                                key={currentStep}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                {renderStep()}
                                            </motion.div>
                                        </AnimatePresence>
                                    </form>
                                </FormProvider>
                            </div>

                            {/* Terminal Footer - Command Line */}
                            <div className="bg-[#002B5C] border-t border-[#0178D4] px-6 py-4">
                                <div className="flex items-center justify-between gap-4">
                                    <button
                                        type="button"
                                        onClick={handleBack}
                                        disabled={currentStep === 1}
                                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded text-sm transition-colors"
                                    >
                                        &lt; BACK
                                    </button>

                                    <div className="text-gray-400 text-xs">
                                        Step [{currentStep}/{maxSteps}]
                                    </div>

                                    {currentStep < maxSteps ? (
                                        <button
                                            type="button"
                                            onClick={handleNext}
                                            className="px-6 py-2 bg-[#00FF00] hover:bg-[#00DD00] text-black font-bold rounded text-sm transition-colors"
                                        >
                                            NEXT &gt;
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={handleSubmit(onSubmit)}
                                            disabled={isSubmitting}
                                            className="px-6 py-2 bg-[#00FF00] hover:bg-[#00DD00] disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold rounded text-sm transition-colors flex items-center gap-2"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <motion.div
                                                        className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full"
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                                    />
                                                    SUBMITTING...
                                                </>
                                            ) : (
                                                'SUBMIT >'
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default PowerShellModal;
