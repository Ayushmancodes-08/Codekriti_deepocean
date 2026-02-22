import { motion } from 'framer-motion';

const items = [
    "Algo to Code", "Tech Maze", "Innovation Challenge", "DevXtreme", "Designathon",
    "Algo to Code", "Tech Maze", "Innovation Challenge", "DevXtreme", "Designathon",
    "Algo to Code", "Tech Maze", "Innovation Challenge", "DevXtreme", "Designathon",
];

const SponsorsRibbon = () => (
    <div className="relative w-full overflow-hidden py-6 md:py-12">
        {/*
         * On mobile: no skew — avoids the ~110% width overflow bleed.
         * On md+: gentle -1deg tilt + skew-x-12 for the angled ribbon look.
         */}
        <div className="relative w-full md:w-[110%] md:-left-[5%] bg-[#050A14]/95 border-y-2 border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.2)] md:-rotate-1 md:skew-x-12 md:scale-105 py-3 md:py-4 backdrop-blur-xl flex items-center justify-center overflow-hidden">

            {/* Edge fades */}
            <div className="absolute inset-y-0 left-0 w-16 md:w-40 bg-gradient-to-r from-[#050A14] via-[#050A14]/80 to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-16 md:w-40 bg-gradient-to-l from-[#050A14] via-[#050A14]/80 to-transparent z-10 pointer-events-none" />

            <motion.div
                className="flex whitespace-nowrap min-w-full gap-8 md:gap-24 pl-8 md:pl-24 items-center"
                animate={{ x: ['0%', '-50%'] }}
                transition={{ repeat: Infinity, ease: 'linear', duration: 20 }}
            >
                {[...items, ...items].map((item, i) => (
                    <div
                        key={i}
                        /* Counter-skew only on md+ so text stays readable */
                        className="flex items-center gap-3 md:gap-4 group cursor-default md:transform md:skew-x-[-12deg]"
                    >
                        <span className="text-base md:text-2xl font-display font-bold text-cyan-100/30 group-hover:text-cyan-400 group-hover:drop-shadow-[0_0_8px_rgba(0,217,255,0.8)] transition-all duration-300 uppercase tracking-[0.2em] md:tracking-[0.25em]">
                            {item}
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-800/50 group-hover:bg-cyan-400 group-hover:shadow-[0_0_15px_#22d3ee] transition-all duration-500 flex-shrink-0" />
                    </div>
                ))}
            </motion.div>
        </div>
    </div>
);

export default SponsorsRibbon;
