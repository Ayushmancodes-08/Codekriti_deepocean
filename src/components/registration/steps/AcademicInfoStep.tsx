import { useFormContext } from 'react-hook-form';
import { motion } from 'framer-motion';
import { GraduationCap, Building2, Calendar } from 'lucide-react';
import type { RegistrationFormData } from '@/types/legacy-registration';
import FormField from '../FormField';

const AcademicInfoStep = () => {
    const { register, formState: { errors } } = useFormContext<RegistrationFormData>();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="mb-8">
                <h3 className="text-2xl font-bold text-cyan-300 mb-2">Academic Details</h3>
                <p className="text-cyan-400/70">Tell us about your educational background</p>
            </div>

            <FormField
                label="Institution Name"
                icon={<Building2 className="w-5 h-5" />}
                error={errors.institution?.message}
            >
                <input
                    {...register('institution')}
                    type="text"
                    placeholder="Your college or university"
                    className="w-full px-4 py-3 bg-cyan-950/30 border border-cyan-500/30 rounded-lg text-cyan-100 placeholder-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                />
            </FormField>

            <FormField
                label="Degree Level"
                icon={<GraduationCap className="w-5 h-5" />}
                error={errors.degree?.message}
            >
                <select
                    {...register('degree')}
                    className="w-full px-4 py-3 bg-cyan-950/30 border border-cyan-500/30 rounded-lg text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                >
                    <option value="" className="bg-cyan-950">Select degree level</option>
                    <option value="undergraduate" className="bg-cyan-950">Undergraduate</option>
                    <option value="postgraduate" className="bg-cyan-950">Postgraduate</option>
                    <option value="phd" className="bg-cyan-950">PhD</option>
                    <option value="other" className="bg-cyan-950">Other</option>
                </select>
            </FormField>

            <FormField
                label="Expected Graduation Year"
                icon={<Calendar className="w-5 h-5" />}
                error={errors.graduationYear?.message}
            >
                <input
                    {...register('graduationYear', { valueAsNumber: true })}
                    type="number"
                    min="2024"
                    max="2030"
                    placeholder="2026"
                    className="w-full px-4 py-3 bg-cyan-950/30 border border-cyan-500/30 rounded-lg text-cyan-100 placeholder-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                />
            </FormField>
        </motion.div>
    );
};

export default AcademicInfoStep;
