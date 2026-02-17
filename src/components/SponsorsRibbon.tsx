import { motion } from 'framer-motion';

const sponsors = [
    "Algo to Code", "Tech Maze", "Innovation Challenge", "DevXtreme",
    "Algo to Code", "Tech Maze", "Innovation Challenge", "DevXtreme",
    "Algo to Code", "Tech Maze", "Innovation Challenge", "DevXtreme"
];

const SponsorsRibbon = () => {
    return (
        <div className="relative w-full overflow-hidden py-8 md:py-14">
            {/* The Ribbon Itself */}
            <div className="relative w-[110%] -left-[5%] bg-[#050A14]/95 border-y-2 border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.2)] transform -rotate-1 skew-x-12 scale-105 py-3 md:py-4 backdrop-blur-xl flex items-center justify-center">

                {/* Side Gradients for fade effect */}
                <div className="absolute inset-y-0 left-0 w-20 md:w-40 bg-gradient-to-r from-[#050A14] via-[#050A14]/80 to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-20 md:w-40 bg-gradient-to-l from-[#050A14] via-[#050A14]/80 to-transparent z-10 pointer-events-none" />

                <motion.div
                    className="flex whitespace-nowrap min-w-full gap-12 md:gap-32 pl-12 md:pl-32 items-center"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{
                        repeat: Infinity,
                        ease: "linear",
                        duration: 35
                    }}
                >
                    {/* Render list twice for seamless loop */}
                    {[...sponsors, ...sponsors].map((sponsor, i) => (
                        <div key={i} className="flex items-center gap-4 group cursor-default transform skew-x-[-12deg]">
                            <span className="text-xl md:text-2xl font-display font-bold text-cyan-100/30 group-hover:text-cyan-400 group-hover:drop-shadow-[0_0_8px_rgba(0,217,255,0.8)] transition-all duration-300 uppercase tracking-[0.25em]">
                                {sponsor}
                            </span>
                            {/* Decorative separating dot */}
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-800/50 group-hover:bg-cyan-400 group-hover:shadow-[0_0_15px_#22d3ee] transition-all duration-500" />
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default SponsorsRibbon;
