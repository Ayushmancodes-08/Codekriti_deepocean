import React from "react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { motion } from "framer-motion";
import { Code, Trophy, Users, Rocket } from "lucide-react";

/**
 * About Section with scroll-driven animation effect
 * Showcases CodeKriti 4.0 features with a 3D perspective scroll effect
 */
export function AboutScrollSection() {
    return (
        <section id="about" className="relative bg-gradient-to-b from-black via-slate-950 to-black">
            <ContainerScroll
                titleComponent={
                    <>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-cyan-400 font-body text-sm uppercase tracking-widest mb-4"
                        >
                            About The Event
                        </motion.p>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-4xl md:text-[5rem] font-display font-bold text-white leading-tight"
                        >
                            Dive Into <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
                                CodeKriti 4.0
                            </span>
                        </motion.h2>
                    </>
                }
            >
                {/* Content inside the scroll container */}
                <div className="h-full w-full p-6 md:p-10 flex flex-col justify-between">
                    {/* Main description */}
                    <div className="mb-8">
                        <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-4">
                            The Ultimate Tech Hackathon
                        </h3>
                        <p className="text-gray-300 font-body text-sm md:text-base leading-relaxed max-w-3xl">
                            CodeKriti 4.0 is a 48-hour hackathon where innovation meets the deep ocean of technology.
                            Dive into challenges that push your limits, collaborate with brilliant minds, and
                            emerge with solutions that could change the world. This year, we're exploring the
                            digital depths like never before.
                        </p>
                    </div>

                    {/* Feature grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        <FeatureCard
                            icon={<Code className="w-6 h-6" />}
                            title="48 Hours"
                            description="Non-stop coding"
                        />
                        <FeatureCard
                            icon={<Users className="w-6 h-6" />}
                            title="500+"
                            description="Participants"
                        />
                        <FeatureCard
                            icon={<Trophy className="w-6 h-6" />}
                            title="₹1 Lakh"
                            description="Prize Pool"
                        />
                        <FeatureCard
                            icon={<Rocket className="w-6 h-6" />}
                            title="4 Events"
                            description="Epic challenges"
                        />
                    </div>

                    {/* Visual element - Ocean wave decoration */}
                    <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-cyan-500/10 to-transparent rounded-b-2xl pointer-events-none" />
                </div>
            </ContainerScroll>
        </section>
    );
}

function FeatureCard({
    icon,
    title,
    description
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
}) {
    return (
        <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center group hover:border-cyan-500/50 transition-all duration-300"
        >
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center text-cyan-400 group-hover:text-cyan-300 transition-colors">
                {icon}
            </div>
            <h4 className="font-display font-bold text-white text-lg">{title}</h4>
            <p className="font-body text-xs text-gray-400">{description}</p>
        </motion.div>
    );
}

export default AboutScrollSection;
