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
        <div className="space-y-1.5 group">
            <label className="flex items-center gap-2 text-[11px] uppercase font-bold text-gray-400 ml-1 tracking-wider transition-colors group-focus-within:text-[#00D9FF]">
                <Icon className="w-3.5 h-3.5 text-[#00D9FF]/70 group-focus-within:text-[#00D9FF] group-focus-within:animate-pulse" />
                {label}
            </label>

            <div className="relative">
                {children}
                <div className="absolute inset-0 rounded-lg pointer-events-none border border-[#00D9FF]/0 group-focus-within:border-[#00D9FF]/30 transition-all duration-300 shadow-[inset_0_0_10px_rgba(0,217,255,0)] group-focus-within:shadow-[inset_0_0_10px_rgba(0,217,255,0.1)]" />
            </div>

            <AnimatePresence mode="wait">
                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, y: -10 }}
                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -10 }}
                        className="overflow-hidden"
                    >
                        <div className="text-red-400 text-[10px] flex items-center gap-1.5 bg-red-500/5 px-2 py-1 rounded border border-red-500/20 mt-1">
                            <div className="w-1 h-1 bg-red-400 rounded-full animate-pulse" />
                            <span>{error}</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default OceanInput;
