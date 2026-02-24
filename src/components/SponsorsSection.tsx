import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const sponsors = [
    {
        name: "Nexus Infotech",
        logo: "/sponsors/nexus.jpeg",
    },
    {
        name: "CGR International",
        logo: "/sponsors/CGR_Oointernational.png",
    },
    {
        name: "Bharat Infocom",
        logo: "/sponsors/BharatInfo.png",
    }
];

const SponsorsSection = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });

    return (
        <section ref={ref} className="relative py-16 sm:py-20 md:py-24 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-black/60" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-cyan-900/10 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-4xl">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-10 sm:mb-12"
                >
                    <span className="inline-block text-cyan-400 font-bold tracking-widest uppercase text-xs sm:text-sm mb-3 opacity-80 px-4 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-950/20">
                        Our Supporters
                    </span>
                    <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-3 leading-tight">
                        Partners &{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Sponsors</span>
                    </h2>
                    <p className="font-body text-gray-400 mt-4 max-w-2xl mx-auto text-sm sm:text-base">
                        The organizations powering this deep dive into innovation and technology.
                    </p>
                </motion.div>

                {/* ── Translucent Glass Container (same style as Register Section) ── */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.15 }}
                    className="glass-card rounded-3xl p-6 sm:p-10 md:p-14 relative overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(8,145,178,0.1)]"
                >
                    {/* Decorative corner glows */}
                    <div className="absolute -top-16 -right-16 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

                    {/* Logos */}
                    <div className="relative z-10 flex flex-wrap md:flex-nowrap items-center justify-center gap-6 sm:gap-8 lg:gap-12">
                        {sponsors.map((sponsor, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                                transition={{ duration: 0.5, delay: 0.3 + index * 0.15 }}
                                className="group flex items-center justify-center p-2 sm:p-3"
                            >
                                <img
                                    src={sponsor.logo}
                                    alt={sponsor.name}
                                    className="w-32 sm:w-44 md:w-52 lg:w-60 h-auto object-contain rounded-xl sm:rounded-2xl opacity-80 transition-all duration-300 group-hover:opacity-100 group-hover:scale-110 shadow-lg"
                                />
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default SponsorsSection;
