import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { registrationSchema, REGISTRATION_STEPS, type RegistrationFormData } from '@/types/registration';
import PersonalInfoStep from './steps/PersonalInfoStep';
import AcademicInfoStep from './steps/AcademicInfoStep';
import EventSelectionStep from './steps/EventSelectionStep';
import TeamInfoStep from './steps/TeamInfoStep';
import FinalDetailsStep from './steps/FinalDetailsStep';
import ProgressIndicator from './ProgressIndicator';

interface RegistrationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const RegistrationModal = ({ isOpen, onClose }: RegistrationModalProps) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const methods = useForm<RegistrationFormData>({
        resolver: zodResolver(registrationSchema),
        mode: 'onBlur',
        defaultValues: {
            fullName: '',
            email: '',
            phone: '',
            institution: '',
            degree: undefined,
            graduationYear: new Date().getFullYear(),
            selectedEvents: [],
            teamName: '',
            teamMembers: [],
            dietaryRestrictions: '',
            tshirtSize: undefined,
            agreeToTerms: false,
        },
    });

    const { handleSubmit, trigger } = methods;

    // Validate current step before proceeding
    const validateStep = async (step: number): Promise<boolean> => {
        let fieldsToValidate: (keyof RegistrationFormData)[] = [];

        switch (step) {
            case 1:
                fieldsToValidate = ['fullName', 'email', 'phone'];
                break;
            case 2:
                fieldsToValidate = ['institution', 'degree', 'graduationYear'];
                break;
            case 3:
                fieldsToValidate = ['selectedEvents'];
                break;
            case 4:
                // Team info is optional
                return true;
            case 5:
                fieldsToValidate = ['tshirtSize', 'agreeToTerms'];
                break;
        }

        const result = await trigger(fieldsToValidate);
        return result;
    };

    const handleNext = async () => {
        const isValid = await validateStep(currentStep);

        if (isValid) {
            if (currentStep < 5) {
                setCurrentStep(currentStep + 1);
            }
        } else {
            toast.error('Please fill in all required fields correctly');
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
            // TODO: Replace with actual API call
            console.log('Registration data:', data);

            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 2000));

            toast.success('Registration successful! Check your email for confirmation.');
            onClose();

            // Reset form
            methods.reset();
            setCurrentStep(1);
        } catch (error) {
            console.error('Registration error:', error);
            toast.error('Registration failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <PersonalInfoStep />;
            case 2:
                return <AcademicInfoStep />;
            case 3:
                return <EventSelectionStep />;
            case 4:
                return <TeamInfoStep />;
            case 5:
                return <FinalDetailsStep />;
            default:
                return null;
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    {/* Modal Container - Deep-Sea Scanner Terminal Theme */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="w-full max-w-4xl max-h-[90vh] relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Ocean-themed Terminal Container */}
                        <div className="relative bg-gradient-to-br from-blue-950/95 via-cyan-950/90 to-teal-900/95 rounded-2xl shadow-2xl border border-cyan-500/30 overflow-hidden">
                            {/* Animated Scanner Lines */}
                            <motion.div
                                className="absolute inset-0 pointer-events-none"
                                style={{
                                    background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 255, 0.03) 2px, rgba(0, 255, 255, 0.03) 4px)',
                                }}
                            >
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent h-32"
                                    animate={{
                                        y: ['-100%', '200%'],
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: 'linear',
                                    }}
                                />
                            </motion.div>

                            {/* Glowing Corner Accents */}
                            <div className="absolute top-0 left-0 w-32 h-32 bg-cyan-500/20 blur-3xl rounded-full" />
                            <div className="absolute bottom-0 right-0 w-32 h-32 bg-teal-500/20 blur-3xl rounded-full" />

                            {/* Header */}
                            <div className="relative border-b border-cyan-500/30 bg-gradient-to-r from-cyan-950/50 to-teal-950/50 p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-2xl font-bold text-cyan-300 tracking-wide flex items-center gap-2">
                                            <span className="text-cyan-400">▸</span>
                                            DEEP-SEA REGISTRATION TERMINAL
                                        </h2>
                                        <p className="text-cyan-400/70 text-sm mt-1 font-mono">
                                            {REGISTRATION_STEPS[currentStep - 1].description}
                                        </p>
                                    </div>

                                    <button
                                        onClick={onClose}
                                        className="text-cyan-300 hover:text-cyan-100 hover:bg-cyan-500/20 p-2 rounded-lg transition-all"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                {/* Progress Indicator */}
                                <ProgressIndicator currentStep={currentStep} totalSteps={5} />
                            </div>

                            {/* Form Content */}
                            <div className="relative p-8 overflow-y-auto max-h-[calc(90vh-250px)]">
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

                            {/* Footer - Navigation */}
                            <div className="relative border-t border-cyan-500/30 bg-gradient-to-r from-cyan-950/50 to-teal-950/50 p-6">
                                <div className="flex items-center justify-between">
                                    <button
                                        type="button"
                                        onClick={handleBack}
                                        disabled={currentStep === 1}
                                        className="flex items-center gap-2 px-6 py-3 rounded-lg bg-cyan-900/30 text-cyan-300 hover:bg-cyan-800/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all border border-cyan-500/30"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                        Back
                                    </button>

                                    <div className="text-cyan-400/70 font-mono text-sm">
                                        Step {currentStep} of {REGISTRATION_STEPS.length}
                                    </div>

                                    {currentStep < 5 ? (
                                        <button
                                            type="button"
                                            onClick={handleNext}
                                            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 text-white hover:from-cyan-400 hover:to-teal-400 transition-all shadow-lg shadow-cyan-500/30"
                                        >
                                            Next
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={handleSubmit(onSubmit)}
                                            disabled={isSubmitting}
                                            className="flex items-center gap-2 px-8 py-3 rounded-lg bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:from-teal-400 hover:to-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-teal-500/30"
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
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default RegistrationModal;
