import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
    {
        question: "What is CodeKriti 4.0?",
        answer: "CodeKriti 4.0 is a two-day tech battlefield where ideas turn into prototypes, logic turns into code, and teams compete to dominate. Hackathons, coding wars, pitch battles — all in one arena."
    },
    {
        question: "When & Where?",
        answer: "Two high-voltage days at PMEC. From morning coding clashes to the 8-hour hackathon grind — it's non-stop."
    },
    {
        question: "Who can participate?",
        answer: "Undergraduate students ready to compete. All events are Inter-College and welcome participants from all institutions."
    },
    {
        question: "What is the team size?",
        answer: "Hackathon: 3–5 members. Innovation Challenge: 2–3 members. Tech Maze: 3 members. Algo to Code: Solo — just you vs the problems."
    },
    {
        question: "Is there a registration fee?",
        answer: "Yes. Small investment. Serious competition. Registration fees range from ₹30–₹500 depending on the event."
    },
    {
        question: "Will food & accommodation be provided?",
        answer: "Hackathon participants get refreshments. Work. Code. Repeat."
    },
    {
        question: "What are the themes/tracks?",
        answer: "Real-world problem statements under a defined theme. No random coding — build solutions that actually matter."
    },
    {
        question: "What should I bring?",
        answer: "Laptop. Charger. College ID. And the mindset to compete, not just participate."
    },
    {
        question: "Can I use pre-built templates?",
        answer: "Libraries? Yes. Copy-paste projects? No chance. Originality wins here."
    },
    {
        question: "Will there be prizes?",
        answer: "Yes. Cash prizes across all events. Up to ₹10,000+ in the hackathon alone. Win money. Win recognition. Win respect."
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
