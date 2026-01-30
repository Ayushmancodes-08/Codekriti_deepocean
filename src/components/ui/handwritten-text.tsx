import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface HandwrittenTextProps {
    text: string;
    className?: string;
    delay?: number;
}

const HandwrittenText = ({ text, className = '', delay = 0 }: HandwrittenTextProps) => {
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        let currentIndex = 0;
        const timeout = setTimeout(() => {
            const interval = setInterval(() => {
                if (currentIndex <= text.length) {
                    setDisplayedText(text.slice(0, currentIndex));
                    currentIndex++;
                } else {
                    clearInterval(interval);
                }
            }, 50); // Pen writing speed

            return () => clearInterval(interval);
        }, delay);

        return () => clearTimeout(timeout);
    }, [text, delay]);

    return (
        <motion.span
            className={`inline-block ${className}`}
            style={{
                fontFamily: "'Caveat', 'Permanent Marker', cursive",
                textShadow: '0 0 10px rgba(0, 217, 255, 0.3)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: delay / 1000 }}
        >
            {displayedText}
            {displayedText.length < text.length && (
                <motion.span
                    className="inline-block w-0.5 h-full bg-[#00D9FF] ml-1"
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                />
            )}
        </motion.span>
    );
};

export default HandwrittenText;
