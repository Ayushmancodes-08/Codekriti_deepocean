import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, MotionValue } from 'framer-motion';

// --- asset configuration ---
const ASSETS_OCEAN = {
    manta: '/assets/ocean/manta_ray_1769969274048.png',
    jellyfish: '/assets/ocean/jellyfish_blue_1769969257533.png',
    octopus: '/assets/ocean/octopus_purple_1769969223447.png',
    blueTang: '/assets/ocean/fish_blue_tang_1769969189595.png',
    kelp: '/assets/ocean/kelp_seaweed_tall_1769969577936.png',
    seaGrass: '/assets/ocean/sea_grass_cluster_1769969611847.png',
    rockMossy: '/assets/ocean/rock_mossy_single_1769969645447.png',
    seaStones: '/assets/ocean/sea_stones_cluster_1769969544640.png',
    octopusStone: '/assets/ocean/octopus_wrapped_stone_1769969561487.png',
    anemone: '/assets/ocean/anemone_colorful_1769969629357.png',
    clownfish: '/assets/ocean/fish_clownfish_1769969172414.png',
    coralPink: '/assets/ocean/coral_pink_branching_1769969596186.png',
    coralFan: '/assets/ocean/coral_fan_seafan_1769969707382.png',
    fishSchool: '/assets/ocean/fish_school_1769969295035.png',
    turtle: '/assets/ocean/sea_turtle_1769969240193.png',
    whale: '/assets/ocean/whale_humpback_1769969206274.png',
};

// --- sub-components ---

const ParallaxLayer = ({
    children,
    depth, // 0 to 1
    className = "",
    smoothProgress
}: {
    children: React.ReactNode;
    depth: number;
    className?: string;
    smoothProgress: MotionValue<number>;
}) => {
    // Parallax: Deeper layers move slower/less
    const yRange = depth * 500;
    const y = useTransform(smoothProgress, [0, 1], [`-${yRange * 0.3}px`, `${yRange * 0.6}px`]);

    return (
        <motion.div style={{ y }} className={`absolute inset-0 pointer-events-none ${className}`}>
            {children}
        </motion.div>
    );
};

const UnderwaterTransition = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 60,
        damping: 20,
        restDelta: 0.001
    });

    return (
        <section ref={containerRef} className="relative w-full h-[160vh] overflow-hidden bg-[#000814]">

            {/* --- 1. Top Wave Transition (Seamless Entry) --- */}
            <div className="absolute top-0 left-0 w-full h-48 z-20 pointer-events-none">
                <div className="w-full h-full bg-gradient-to-b from-background to-transparent" />
                {/* Decorative Wave SVG */}
                <svg className="absolute -top-1 left-0 w-full h-full text-[#000814] fill-current opacity-90 transform rotate-180" viewBox="0 0 1440 320" preserveAspectRatio="none">
                    <path d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,128C960,128,1056,192,1152,208C1248,224,1344,192,1392,176L1440,160V320H1392C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320H0Z" />
                </svg>
            </div>

            {/* --- 2. Deep Sea Background --- */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#0f2e4a_0%,#051829_40%,#000814_100%)] z-0" />

            {/* God Rays (Subtle & Ambient) */}
            <motion.div
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 z-0 bg-[linear-gradient(110deg,transparent_40%,rgba(6,182,212,0.05)_45%,transparent_50%)]"
            />
            {/* Floating Dust Particles (Seamless Loop) */}
            <motion.div
                className="absolute inset-0 z-10 opacity-30"
                style={{
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ccircle cx=\'50\' cy=\'50\' r=\'1\' fill=\'white\'/%3E%3C/svg%3E")',
                    backgroundSize: '200px 200px'
                }}
                animate={{ backgroundPosition: ['0px 0px', '100px 100px'] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />


            {/* --- LAYER 1: Farthest / Slowest (Depth 0.2) --- */}
            <ParallaxLayer depth={0.2} smoothProgress={smoothProgress} className="z-10 mix-blend-screen opacity-50">
                {/* Whale Silhouette (Very Deep) */}
                <motion.img
                    src={ASSETS_OCEAN.whale}
                    alt="Whale Background"
                    className="absolute top-[10%] left-[-20%] w-[800px] blur-sm opacity-20 rotate-12"
                    animate={{ x: ['100vw', '-50vw'] }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                />

                {/* Distant School (Seamless flow) */}
                <motion.img
                    src={ASSETS_OCEAN.fishSchool}
                    alt="Distant School"
                    className="absolute top-1/3 right-0 w-96 opacity-30 grayscale blur-[2px]"
                    animate={{ x: [0, -100] }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                />
            </ParallaxLayer>


            {/* --- LAYER 2: Mid-Distance Environment (Depth 0.5) --- */}
            <ParallaxLayer depth={0.5} smoothProgress={smoothProgress} className="z-20">
                {/* Rock Formation Left */}
                <div className="absolute top-[40%] left-[-5%] w-96 opacity-70">
                    <motion.img
                        src={ASSETS_OCEAN.seaStones}
                        alt="Rocks"
                        className="w-full drop-shadow-2xl"
                    />
                    {/* Vegetation on Rocks */}
                    <motion.img
                        src={ASSETS_OCEAN.seaGrass}
                        alt="SeaGrass"
                        className="absolute -top-20 left-10 w-48 opacity-80"
                        animate={{ skewX: [-2, 2, -2] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    />
                </div>

                {/* Rock Formation Right */}
                <div className="absolute top-[50%] right-[-10%] w-[500px] opacity-80">
                    <motion.img
                        src={ASSETS_OCEAN.rockMossy}
                        alt="Mossy Rock"
                        className="w-full brightness-75"
                    />
                    {/* Octopus Hiding */}
                    <motion.img
                        src={ASSETS_OCEAN.octopusStone}
                        alt="Hiding Octopus"
                        className="absolute top-10 right-20 w-48"
                        style={{ filter: 'brightness(0.8)' }}
                    />
                </div>

                {/* Central Mid-layer Fish */}
                <motion.img
                    src={ASSETS_OCEAN.fishSchool}
                    alt="Fish School Mid"
                    className="absolute bottom-1/3 left-1/4 w-[600px] opacity-80"
                    animate={{ x: [-50, 50, -50], y: [0, 20, 0] }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                />
            </ParallaxLayer>


            {/* --- LAYER 3: Main Subject Creatures (Depth 0.8) --- */}
            <ParallaxLayer depth={0.8} smoothProgress={smoothProgress} className="z-30">

                {/* Manta Ray - Hero (Seamless glide across) */}
                <motion.div
                    className="absolute top-[20%] w-full"
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
                >
                    <motion.img
                        src={ASSETS_OCEAN.manta}
                        alt="Manta Ray"
                        className="w-[300px] md:w-[600px] drop-shadow-2xl"
                        animate={{ y: [0, 40, 0], rotateZ: [-2, 2, -2] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    />
                </motion.div>

                {/* Jellyfish Cluster - Drifting Upwards (Anti-gravity) */}
                <motion.div className="absolute top-[40%] left-[20%]">
                    <motion.img
                        src={ASSETS_OCEAN.jellyfish}
                        alt="Jellyfish Main"
                        className="w-32 md:w-48 drop-shadow-[0_0_25px_rgba(6,182,212,0.4)]"
                        animate={{ y: [0, -30, 0], rotate: [-5, 5, -5] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    />
                </motion.div>

                {/* Turtle - Cruising Diagonal */}
                <motion.div
                    className="absolute bottom-[30%] right-[10%]"
                    animate={{ x: [0, -50, 0], y: [0, -20, 0] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                >
                    <motion.img
                        src={ASSETS_OCEAN.turtle}
                        alt="Turtle"
                        className="w-48 md:w-80 opacity-95"
                        animate={{ rotate: [0, 5, 0] }}
                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    />
                </motion.div>

                {/* Blue Tang - Quick Darting */}
                <motion.img
                    src={ASSETS_OCEAN.blueTang}
                    alt="Dory"
                    className="absolute top-[60%] left-[40%]"
                    style={{ width: '100px' }}
                    animate={{
                        x: [0, 200, 400],
                        y: [0, -50, 20],
                        opacity: [1, 1, 0] // Fade out as it leaves
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeOut" }}
                />
            </ParallaxLayer>


            {/* --- LAYER 4: Foreground Vegetation & Detail (Depth 1.2) --- */}
            <ParallaxLayer depth={1.2} smoothProgress={smoothProgress} className="z-40 pointer-events-none">

                {/* Large Kelp Forest - Left */}
                <div className="absolute bottom-[-10%] left-[-5%] flex items-end">
                    <motion.img
                        src={ASSETS_OCEAN.kelp}
                        alt="Kelp L1"
                        className="w-64 md:w-96 blur-[1px] brightness-75"
                        style={{ transformOrigin: 'bottom center' }}
                        animate={{ rotate: [-3, 3, -3] }}
                        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.img
                        src={ASSETS_OCEAN.kelp}
                        alt="Kelp L2"
                        className="w-48 md:w-80 -ml-20 mb-10 blur-[2px] brightness-50"
                        style={{ transformOrigin: 'bottom center' }}
                        animate={{ rotate: [2, -4, 2] }}
                        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    />
                </div>

                {/* Coral Reef & Anemone - Right */}
                <div className="absolute bottom-0 right-0 flex flex-col items-end">
                    {/* Pink Coral */}
                    <motion.img
                        src={ASSETS_OCEAN.coralPink}
                        alt="Coral FG"
                        className="w-64 md:w-[400px] -mb-10 mr-10 drop-shadow-2xl"
                        animate={{ scale: [1, 1.02, 1] }} // Breathing effect
                        transition={{ duration: 5, repeat: Infinity }}
                    />

                    {/* Sea Grass */}
                    <div className="absolute bottom-0 right-20">
                        <motion.img
                            src={ASSETS_OCEAN.seaGrass}
                            alt="Sea Grass FG"
                            className="w-64 blur-[0.5px]"
                            style={{ transformOrigin: 'bottom center' }}
                            animate={{ skewX: [4, -4, 4] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        />
                    </div>

                    {/* Anemone Cluster */}
                    <div className="absolute bottom-10 right-[30%] w-48 md:w-72">
                        <motion.img
                            src={ASSETS_OCEAN.anemone}
                            alt="Anemone"
                            className="w-full relative z-10"
                        />
                        <motion.img
                            src={ASSETS_OCEAN.clownfish}
                            alt="Nemo"
                            className="absolute -top-8 right-10 w-20 z-0"
                            animate={{
                                x: [0, 20, 0],
                                y: [0, -10, 0],
                                rotate: [0, 10, 0]
                            }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        />
                    </div>
                </div>

                {/* Foreground Particles - Rising fast */}
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={`fg-particle-${i}`}
                        className="absolute rounded-full bg-white/10 backdrop-blur-sm"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: '120%',
                            width: Math.random() * 15 + 5,
                            height: Math.random() * 15 + 5,
                        }}
                        animate={{ y: '-150vh' }}
                        transition={{
                            duration: Math.random() * 5 + 8,
                            repeat: Infinity,
                            delay: Math.random() * 10,
                            ease: "linear"
                        }}
                    />
                ))}

            </ParallaxLayer>

            {/* Bottom Gradient Fade to next section (Seamless) */}
            <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-background via-background/80 to-transparent z-50" />

        </section>
    );
};

export default UnderwaterTransition;
