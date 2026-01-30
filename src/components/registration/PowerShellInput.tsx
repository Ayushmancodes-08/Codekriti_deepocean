import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PowerShellInputProps {
    label: string;
    error?: string;
    children: ReactNode;
}

const PowerShellInput = ({ label, error, children }: PowerShellInputProps) => {
    return (
        <div className="space-y-2">
            <label className="block text-white font-bold text-sm">
                {label}
            </label>

            {children}

            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="text-red-500 text-xs flex items-center gap-1 bg-red-500/10 px-3 py-2 rounded border border-red-500/30"
                    >
                        <span>⚠</span>
                        <span>{error}</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PowerShellInput;
