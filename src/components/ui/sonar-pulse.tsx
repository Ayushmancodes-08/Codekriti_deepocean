import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Pulse {
    id: number;
    x: number;
    y: number;
}

export const SonarPulse = () => {
    const [pulses, setPulses] = useState<Pulse[]>([]);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const newPulse = { id: Date.now(), x: e.clientX, y: e.clientY };
            setPulses(prev => [...prev, newPulse]);

            // Makeup sound effect (optional/future) or just visual
        };

        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, []);

    return (
        <AnimatePresence>
            {pulses.map(pulse => (
                <motion.div
                    key={pulse.id}
                    initial={{ opacity: 0.8, scale: 0, x: "-50%", y: "-50%" }}
                    animate={{ opacity: 0, scale: 2 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    style={{
                        position: 'fixed',
                        left: pulse.x,
                        top: pulse.y,
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        border: '2px solid rgba(0, 217, 255, 0.5)',
                        backgroundColor: 'rgba(0, 217, 255, 0.1)',
                        pointerEvents: 'none',
                        zIndex: 9998,
                        boxShadow: '0 0 20px rgba(0, 217, 255, 0.4)'
                    }}
                    onAnimationComplete={() => {
                        setPulses(prev => prev.filter(p => p.id !== pulse.id));
                    }}
                />
            ))}
        </AnimatePresence>
    );
};
