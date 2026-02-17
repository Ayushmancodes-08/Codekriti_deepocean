import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface OceanInputProps {
    label: string;
    icon: LucideIcon;
    error?: string;
    children: ReactNode;
}

const OceanInput = ({ label, icon: Icon, error, children }: OceanInputProps) => {
    return (
        <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm md:text-base font-medium text-gray-300">
                <Icon className="w-4 h-4 text-[#00D9FF]" />
                {label}
            </label>

            {children}

            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="text-cyan-400 text-xs flex items-center gap-2 bg-cyan-500/10 px-3 py-2 rounded-lg border border-cyan-500/30"
                    >
                        <div className="w-1 h-1 bg-cyan-400 rounded-full" />
                        <span>{error}</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default OceanInput;
