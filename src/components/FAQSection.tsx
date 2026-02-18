import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const faqs = [
    {
        question: "What is CodeKriti 4.0?",
        answer: "CodeKriti 4.0 is a two-day tech battlefield where ideas turn into prototypes, logic turns into code, and teams compete to dominate. Hackathons, coding wars, pitch battles — all in one arena."
    },
    {
        question: "When & Where?",
        answer: "Two high-voltage days at PMEC. From morning coding clashes to overnight hackathon grind — it's non-stop."
    },
    {
        question: "Who can participate?",
        answer: "Undergraduate students ready to compete. Hackathon welcomes teams from other colleges. Other events are exclusive to PMEC."
    },
    {
        question: "What is the team size?",
        answer: "Hackathon: 3–5 members. Innovation Challenge: 2–3 members. Tech Maze: 3 members. Algo to Code: Solo — just you vs the problems."
    },
    {
        question: "Is there a registration fee?",
        answer: "Yes. Small investment. Serious competition. ₹30–₹90 for intra-college events. ₹400–₹500 for the hackathon."
    },
    {
        question: "Will food and accommodation be provided?",
        answer: "Hackathon participants get dinner and breakfast. Work. Code. Repeat."
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
        <section className="relative py-20 min-h-[50vh] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-black/90 z-10" />
                <div className="absolute inset-0 bg-gradient-to-b from-black via-cyan-950/20 to-black z-0" />
            </div>

            <div className="container mx-auto px-4 relative z-10 max-w-6xl">
                <div className="text-center mb-12">
                    <span className="text-cyan-400 font-bold tracking-widest uppercase text-sm mb-2 opacity-80">Knowledge Base</span>
                    <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
                        Freq. Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Questions</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="group h-fit">
                            <button
                                onClick={() => setOpenIndex(active => active === index ? null : index)}
                                className={`w-full text-left p-4 rounded-xl glass-card transition-all duration-300 flex items-center justify-between border
                                    ${openIndex === index
                                        ? 'bg-cyan-950/30 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                                        : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'}`}
                            >
                                <span className={`font-display font-medium text-base md:text-lg transition-colors pr-4 ${openIndex === index ? 'text-cyan-400' : 'text-foreground/90'}`}>
                                    {faq.question}
                                </span>
                                <span className={`p-1 rounded-full transition-all duration-300 flex-shrink-0 ${openIndex === index ? 'bg-cyan-500 text-black rotate-180' : 'bg-white/10 text-white group-hover:bg-white/20'}`}>
                                    {openIndex === index ? <Minus size={16} /> : <Plus size={16} />}
                                </span>
                            </button>

                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="p-4 pt-2 text-foreground/70 text-sm md:text-base leading-relaxed border-l-2 border-cyan-500/30 ml-4 my-2">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQSection;
