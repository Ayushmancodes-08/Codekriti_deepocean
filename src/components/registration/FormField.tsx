import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FormFieldProps {
    label: string;
    icon?: ReactNode;
    error?: string;
    children: ReactNode;
}

const FormField = ({ label, icon, error, children }: FormFieldProps) => {
    return (
        <div className="space-y-2">
            <label className="flex items-center gap-2 text-cyan-300 font-medium">
                {icon && <span className="text-cyan-500">{icon}</span>}
                {label}
            </label>

            {children}

            <AnimatePresence>
                {error && (
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-red-400 text-sm flex items-center gap-1"
                    >
                        <span>⚠</span>
                        {error}
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FormField;
