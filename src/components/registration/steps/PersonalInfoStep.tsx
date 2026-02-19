import { useFormContext } from 'react-hook-form';
import { motion } from 'framer-motion';
import { User, Mail, Phone } from 'lucide-react';
import type { RegistrationFormData } from '@/types/legacy-registration';
import FormField from '../FormField';

const PersonalInfoStep = () => {
    const { register, formState: { errors } } = useFormContext<RegistrationFormData>();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="mb-8">
                <h3 className="text-2xl font-bold text-cyan-300 mb-2">Personal Information</h3>
                <p className="text-cyan-400/70">Let's start with the basics</p>
            </div>

            <FormField
                label="Full Name"
                icon={<User className="w-5 h-5" />}
                error={errors.fullName?.message}
            >
                <input
                    {...register('fullName')}
                    type="text"
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 bg-cyan-950/30 border border-cyan-500/30 rounded-lg text-cyan-100 placeholder-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                />
            </FormField>

            <FormField
                label="Email Address"
                icon={<Mail className="w-5 h-5" />}
                error={errors.email?.message}
            >
                <input
                    {...register('email')}
                    type="email"
                    placeholder="your.email@example.com"
                    className="w-full px-4 py-3 bg-cyan-950/30 border border-cyan-500/30 rounded-lg text-cyan-100 placeholder-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                />
            </FormField>

            <FormField
                label="Phone Number"
                icon={<Phone className="w-5 h-5" />}
                error={errors.phone?.message}
            >
                <input
                    {...register('phone')}
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    className="w-full px-4 py-3 bg-cyan-950/30 border border-cyan-500/30 rounded-lg text-cyan-100 placeholder-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                />
            </FormField>
        </motion.div>
    );
};

export default PersonalInfoStep;
