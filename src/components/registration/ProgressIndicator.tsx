import { motion } from 'framer-motion';
import { REGISTRATION_STEPS } from '@/types/legacy-registration';

interface ProgressIndicatorProps {
    currentStep: number;
    totalSteps: number;
}

const ProgressIndicator = ({ currentStep, totalSteps }: ProgressIndicatorProps) => {
    return (
        <div className="mt-6">
            {/* Progress Bar */}
            <div className="relative h-2 bg-cyan-900/30 rounded-full overflow-hidden">
                <motion.div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                />

                {/* Animated glow effect */}
                <motion.div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-400/50 to-teal-400/50 rounded-full blur-sm"
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                />
            </div>

            {/* Step Indicators */}
            <div className="flex justify-between mt-4">
                {REGISTRATION_STEPS.map((step) => (
                    <div
                        key={step.step}
                        className="flex flex-col items-center gap-2 flex-1"
                    >
                        {/* Step Circle */}
                        <motion.div
                            initial={false}
                            animate={{
                                scale: step.step === currentStep ? 1.1 : 1,
                                backgroundColor: step.step <= currentStep
                                    ? 'rgba(6, 182, 212, 0.3)'
                                    : 'rgba(6, 182, 212, 0.1)',
                            }}
                            className={`relative w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${step.step <= currentStep
                                ? 'border-cyan-400 text-cyan-300'
                                : 'border-cyan-700/50 text-cyan-700'
                                }`}
                        >
                            {/* Icon */}
                            <span className="text-lg">{step.icon}</span>

                            {/* Pulse effect for current step */}
                            {step.step === currentStep && (
                                <motion.div
                                    className="absolute inset-0 rounded-full border-2 border-cyan-400"
                                    initial={{ scale: 1, opacity: 1 }}
                                    animate={{ scale: 1.5, opacity: 0 }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: Infinity,
                                        ease: 'easeOut',
                                    }}
                                />
                            )}
                        </motion.div>

                        {/* Step Label */}
                        <div className="text-center">
                            <p
                                className={`text-xs font-medium transition-colors ${step.step <= currentStep ? 'text-cyan-300' : 'text-cyan-700'
                                    }`}
                            >
                                {step.title}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProgressIndicator;
