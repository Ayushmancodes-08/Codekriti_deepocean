import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle } from 'lucide-react';

const faqs = [
    {
        question: "How big can my team be?",
        answer: "Teams can range from 2 to 4 members. Solo divers are welcome to find a crew in our Discord lounge!"
    },
    {
        question: "Is this event beginner-friendly?",
        answer: "Absolutely! The ocean is vast enough for everyone. We have mentorship tracks specifically designed for first-time hackers."
    },
    {
        question: "How much does it cost?",
        answer: "CodeKriti 4.0 is completely free for all admitted participants. We provide meals, swag, and a place to rest."
    },
    {
        question: "What should I bring?",
        answer: "Bring your laptop, charger, toiletries for an overnight stay, and your ID. We'll handle the food, drinks, and Wi-Fi."
    },
    {
        question: "Can I start working on my project beforehand?",
        answer: "No. To ensure fairness, all projects must be built during the 24-hour hackathon period. You can bring ideas, not code."
    }
];

const FAQSection = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="relative py-24 min-h-screen flex items-center justify-center overflow-hidden">
            {/* Reusing Video Background - Scene 4 (adjust index if needed, assuming 3 is abstract/scene-4) 
                 Actually, VideoBackground prop 'activeIndex' controls which video is shown.
                 If we want Scene 4 specifically, we might need to modify VideoBackground usage or just overlay it here.
                 For now, let's use a dark overlay + simple video loop if available, or just transparency if the main VideoBackground covers it?
                 Main VideoBackground covers the whole page usually. 
                 But section-specific background was requested. 
                 Let's place a dedicated absolute video container.
             */}

            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-black/80 z-10" />
                {/* Placeholder for Scene 4 if we had the specific file path, otherwise using a dark gradient fallback which matches the theme beautifully */}
                <div className="absolute inset-0 bg-gradient-to-b from-black via-cyan-950/20 to-black z-0" />
            </div>

            <div className="container mx-auto px-4 relative z-10 max-w-4xl">
                <div className="text-center mb-16">
                    <span className="text-cyan-400 font-bold tracking-widest uppercase text-sm mb-2">Knowledge Base</span>
                    <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6 text-rough-blue">
                        Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Questions</span>
                    </h2>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="group">
                            <button
                                onClick={() => setOpenIndex(active => active === index ? null : index)}
                                className={`w-full text-left p-6 rounded-2xl glass-card transition-all duration-300 flex items-center justify-between
                                    ${openIndex === index ? 'bg-cyan-950/30 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.15)]' : 'hover:bg-white/5 border-white/10'}`}
                            >
                                <span className={`font-display font-bold text-lg md:text-xl transition-colors ${openIndex === index ? 'text-cyan-400' : 'text-white'}`}>
                                    {faq.question}
                                </span>
                                <span className={`p-2 rounded-full transition-all duration-300 ${openIndex === index ? 'bg-cyan-500 text-black rotate-180' : 'bg-white/10 text-white group-hover:bg-white/20'}`}>
                                    {openIndex === index ? <Minus size={20} /> : <Plus size={20} />}
                                </span>
                            </button>

                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="p-6 pt-2 text-blue-100/80 leading-relaxed text-lg border-l-2 border-cyan-500/30 ml-6 my-2">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>

                {/* Decorative Elements */}
                <div className="mt-12 text-center">
                    <p className="text-white/40">Still have questions?</p>
                    <a href="mailto:support@codekriti.com" className="text-cyan-400 hover:text-cyan-300 font-bold mt-2 inline-flex items-center gap-2 transition-colors">
                        <HelpCircle size={18} /> Contact Support
                    </a>
                </div>
            </div>
        </section>
    );
};

export default FAQSection;
