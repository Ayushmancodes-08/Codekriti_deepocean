import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
    {
        question: "What is Code Kriti 4.0?",
        answer: "Code Kriti 4.0 is a two-day tech battlefield where ideas become prototypes, logic becomes code, and teams compete to lead the arena. From hackathons and coding contests to design and innovation challenges, it's the flagship techfest of Parala Maharaja Engineering College."
    },
    {
        question: "When & Where?",
        answer: "The action unfolds at PMEC on 6th–7th March — two high-voltage days packed with coding clashes, intense competitions, and an 8-hour hackathon grind. Expect non-stop innovation from start to finish."
    },
    {
        question: "What is the team size?",
        answer: "Team size varies by event. The Hackathon (DevXtreme) allows teams of 3–4 members, the Innovation Challenge requires 2 members, and Tech Maze permits teams of 2–3 members. Algo to Code is an individual event (solo participation), while Designathon is also conducted individually focusing on a UI/UX project."
    },
    {
        question: "Will food & accommodation be provided?",
        answer: "Refreshments will be provided for hackathon participants. Accommodation will not be provided for any participants."
    },
    {
        question: "Will there be prizes?",
        answer: "Yes. Cash prizes worth ₹16,000 across events, along with recognition and certificates for top performers."
    },
    {
        question: "Is prior experience required?",
        answer: "No prior experience is required. Code Kriti 4.0 welcomes participants of all skill levels — from beginners eager to learn to experienced innovators ready to compete. Enthusiasm, creativity, and the willingness to challenge yourself matter most."
    },
    {
        question: "Can participants join multiple events?",
        answer: "Yes, participants may register for multiple events provided the schedules do not overlap. They must ensure their availability for each event they choose to participate in."
    }
];

const FAQSection = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="relative py-16 sm:py-20 md:py-24 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-black/90" />
                <div className="absolute inset-0 bg-gradient-to-b from-black via-cyan-950/20 to-black" />
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-6xl">

                {/* Header */}
                <div className="text-center mb-10 sm:mb-14">
                    <span className="inline-block text-cyan-400 font-bold tracking-widest uppercase text-xs sm:text-sm mb-3 opacity-80 px-4 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-950/20">
                        Knowledge Base
                    </span>
                    <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-3 leading-tight">
                        Frequently Asked{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Questions</span>
                    </h2>
                </div>

                {/*
                 * Grid:
                 *   mobile/tablet → 1 col (stacked, easy to scroll)
                 *   lg+           → 2 col
                 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                    {faqs.map((faq, index) => {
                        const isOpen = openIndex === index;
                        return (
                            <div key={index} className="group h-fit">
                                <button
                                    onClick={() => setOpenIndex(isOpen ? null : index)}
                                    aria-expanded={isOpen}
                                    aria-controls={`faq-body-${index}`}
                                    id={`faq-btn-${index}`}
                                    className={`
                                        w-full text-left px-4 sm:px-5 py-4 rounded-xl
                                        flex items-center justify-between gap-3
                                        border transition-all duration-300
                                        min-h-[56px] touch-manipulation
                                        ${isOpen
                                            ? 'bg-cyan-950/30 border-cyan-500/50 shadow-[0_0_18px_rgba(6,182,212,0.1)]'
                                            : 'bg-white/5 border-white/8 hover:bg-white/8 hover:border-white/15'}
                                    `}
                                >
                                    <span className={`font-display font-medium text-sm sm:text-base leading-snug transition-colors pr-2 ${isOpen ? 'text-cyan-400' : 'text-white/90'}`}>
                                        {faq.question}
                                    </span>
                                    <ChevronDown
                                        className={`w-4 h-4 flex-shrink-0 transition-all duration-300 ${isOpen ? 'text-cyan-400 rotate-180' : 'text-gray-400'}`}
                                        aria-hidden="true"
                                    />
                                </button>

                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.div
                                            id={`faq-body-${index}`}
                                            role="region"
                                            aria-labelledby={`faq-btn-${index}`}
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.22, ease: 'easeInOut' }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-4 sm:px-5 py-3 text-gray-400 text-sm sm:text-base leading-relaxed border-l-2 border-cyan-500/30 mx-4 mt-1 mb-2">
                                                {faq.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default FAQSection;
