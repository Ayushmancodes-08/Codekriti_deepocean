import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const faqs = [
    {
        question: "What is CodeKriti 4.0?",
        answer: "CodeKriti 4.0 is a 24-hour national-level hackathon where innovators dive into the 'Digital Abyss' to solve real-world problems. It's a test of endurance, creativity, and coding skills."
    },
    {
        question: "When and where is it happening?",
        answer: "The event is scheduled for March 6-7, 2026, at the PMEC Academic Block (Deep Sea Arena). Mark your calendars!"
    },
    {
        question: "Who can participate?",
        answer: "It's open to all college students! Whether you're a freshie or a final year veteran, if you can code (or design/pitch), you're welcome aboard."
    },
    {
        question: "What is the team size?",
        answer: "Teams must have between 2 to 4 members. Solo participation isn't allowed, but you can find teammates in our community Discord."
    },
    {
        question: "Is there a registration fee?",
        answer: "Zero. CodeKriti 4.0 is completely free for all admitted teams. We believe talent shouldn't have a price tag."
    },
    {
        question: "Will food and accommodation be provided?",
        answer: "Yes! We cover all meals, snacks, and drinks during the hackathon. Resting areas will also be available for those quick power naps."
    },
    {
        question: "What are the themes/tracks?",
        answer: "We focus on Open Innovation with a special spotlight on 'Ocean Tech' & 'Digital Depths', but you're free to build on EdTech, FinTech, HealthTech, or any domain."
    },
    {
        question: "What should I bring?",
        answer: "Your laptop, chargers, extension cords (recommended), toiletries for the overnight stay, and your college ID card."
    },
    {
        question: "Can I use pre-built templates?",
        answer: "No. All major code must be written during the 24-hour period. You can use standard libraries, frameworks, and APIs, but no pre-made projects."
    },
    {
        question: "Will there be prizes?",
        answer: "Oh yes. We have a prize pool of over ₹1 Lakh+ including cash prizes, swags, licenses, and intern opportunities."
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
