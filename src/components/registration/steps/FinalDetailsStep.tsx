import { useFormContext } from 'react-hook-form';
import { motion } from 'framer-motion';
import { ShoppingBag, FileText, CheckSquare } from 'lucide-react';
import type { RegistrationFormData } from '@/types/registration';
import FormField from '../FormField';

const FinalDetailsStep = () => {
    const { register, formState: { errors }, watch } = useFormContext<RegistrationFormData>();
    const agreeToTerms = watch('agreeToTerms');

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="mb-8">
                <h3 className="text-2xl font-bold text-cyan-300 mb-2">Final Details</h3>
                <p className="text-cyan-400/70">Just a few more things before you dive in!</p>
            </div>

            <FormField
                label="T-Shirt Size"
                icon={<ShoppingBag className="w-5 h-5" />}
                error={errors.tshirtSize?.message}
            >
                <select
                    {...register('tshirtSize')}
                    className="w-full px-4 py-3 bg-cyan-950/30 border border-cyan-500/30 rounded-lg text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                >
                    <option value="" className="bg-cyan-950">Select size</option>
                    <option value="XS" className="bg-cyan-950">XS</option>
                    <option value="S" className="bg-cyan-950">S</option>
                    <option value="M" className="bg-cyan-950">M</option>
                    <option value="L" className="bg-cyan-950">L</option>
                    <option value="XL" className="bg-cyan-950">XL</option>
                    <option value="XXL" className="bg-cyan-950">XXL</option>
                </select>
            </FormField>

            <FormField
                label="Dietary Restrictions (Optional)"
                icon={<FileText className="w-5 h-5" />}
                error={errors.dietaryRestrictions?.message}
            >
                <textarea
                    {...register('dietaryRestrictions')}
                    rows={3}
                    placeholder="Any allergies or dietary preferences we should know about?"
                    className="w-full px-4 py-3 bg-cyan-950/30 border border-cyan-500/30 rounded-lg text-cyan-100 placeholder-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all resize-none"
                />
            </FormField>

            {/* Terms and Conditions */}
            <div className="mt-8 p-6 bg-cyan-950/20 border border-cyan-500/30 rounded-lg">
                <h4 className="text-cyan-300 font-semibold mb-3 flex items-center gap-2">
                    <CheckSquare className="w-5 h-5" />
                    Terms & Conditions
                </h4>

                <div className="max-h-40 overflow-y-auto pr-2 mb-4 text-sm text-cyan-400/70 space-y-2">
                    <p>
                        By registering for CodeKriti 4.0 2026, you agree to:
                    </p>
                    <ul className="list-disc list-inside space-y-1 pl-2">
                        <li>Abide by all event rules and code of conduct</li>
                        <li>Provide accurate and truthful information</li>
                        <li>Respect fellow participants and organizers</li>
                        <li>Grant permission for photography/videography during the event</li>
                        <li>Understand that registration does not guarantee participation</li>
                        <li>Accept that event details may change with notice</li>
                    </ul>
                </div>

                <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative mt-1">
                        <input
                            {...register('agreeToTerms')}
                            type="checkbox"
                            className="sr-only peer"
                        />
                        <div className={`w-5 h-5 border-2 rounded transition-all ${agreeToTerms
                                ? 'bg-cyan-500 border-cyan-500'
                                : 'bg-cyan-950/30 border-cyan-500/30 group-hover:border-cyan-500/50'
                            }`}>
                            {agreeToTerms && (
                                <motion.svg
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-full h-full text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={3}
                                        d="M5 13l4 4L19 7"
                                    />
                                </motion.svg>
                            )}
                        </div>
                    </div>
                    <span className="text-cyan-300 text-sm">
                        I accept the terms and conditions and confirm that all information provided is accurate
                    </span>
                </label>

                {errors.agreeToTerms && (
                    <p className="text-red-400 text-sm mt-2">{errors.agreeToTerms.message}</p>
                )}
            </div>

            {/* Success Preview */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 p-6 bg-gradient-to-r from-teal-500/10 to-emerald-500/10 border border-teal-500/30 rounded-lg"
            >
                <h4 className="text-teal-300 font-semibold mb-2">🎉 Almost There!</h4>
                <p className="text-teal-400/70 text-sm">
                    Click "Complete Registration" to finalize your submission. You'll receive a confirmation email shortly.
                </p>
            </motion.div>
        </motion.div>
    );
};

export default FinalDetailsStep;
