import { motion } from "framer-motion";

const ClosedBoard = () => {
    return (
        <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center relative overflow-hidden font-sans">
            {/* Background ambient lighting */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[60vw] md:h-[60vw] bg-red-900/10 blur-[120px] rounded-full pointer-events-none" />

            <motion.div
                initial={{ rotate: -3, y: -50, opacity: 0 }}
                animate={{
                    rotate: [-2, 2, -1.5, 1.5, -2],
                    y: 0,
                    opacity: 1
                }}
                transition={{
                    rotate: {
                        duration: 4,
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatType: "mirror"
                    },
                    y: { duration: 1, ease: "easeOut" },
                    opacity: { duration: 0.8 }
                }}
                className="relative z-10 w-full max-w-2xl px-4 flex flex-col items-center origin-top mt-12"
            >
                {/* The strings hanging from top */}
                <div className="absolute -top-32 left-1/4 w-[2px] h-36 bg-gradient-to-b from-neutral-800 to-neutral-400 shadow-sm origin-top"></div>
                <div className="absolute -top-32 right-1/4 w-[2px] h-36 bg-gradient-to-b from-neutral-800 to-neutral-400 shadow-sm origin-top"></div>

                {/* String hooks on the board */}
                <div className="absolute -top-3 left-1/4 -ml-[7px] w-4 h-5 border-[3px] border-neutral-400 rounded-full border-b-0 shadow-sm z-20"></div>
                <div className="absolute -top-3 right-1/4 -mr-[7px] w-4 h-5 border-[3px] border-neutral-400 rounded-full border-b-0 shadow-sm z-20"></div>

                {/* The Board */}
                <div className="bg-neutral-900/90 border-4 border-neutral-700 rounded-xl p-8 md:p-16 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden backdrop-blur-xl w-full">
                    {/* Wood texture / subtle gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                    <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

                    <div className="text-center space-y-6 relative z-10">
                        <motion.h1
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="text-4xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 uppercase tracking-widest drop-shadow-lg"
                        >
                            We Are Closed Now!!
                        </motion.h1>
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.9, duration: 0.8 }}
                            className="w-full h-[2px] bg-gradient-to-r from-transparent via-neutral-600 to-transparent my-4"
                        />
                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 1.1, duration: 0.8 }}
                            className="text-2xl md:text-4xl font-bold text-neutral-300 tracking-wide"
                        >
                            See You Next Year
                        </motion.p>
                    </div>

                    {/* Screws in corners */}
                    <div className="absolute top-4 left-4 w-4 h-4 rounded-full bg-neutral-800 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] border border-neutral-600">
                        <div className="w-full h-[1px] bg-neutral-900 absolute top-1/2 -mt-[0.5px] rotate-45"></div>
                    </div>
                    <div className="absolute top-4 right-4 w-4 h-4 rounded-full bg-neutral-800 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] border border-neutral-600">
                        <div className="w-full h-[1px] bg-neutral-900 absolute top-1/2 -mt-[0.5px] rotate-[110deg]"></div>
                    </div>
                    <div className="absolute bottom-4 left-4 w-4 h-4 rounded-full bg-neutral-800 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] border border-neutral-600">
                        <div className="w-full h-[1px] bg-neutral-900 absolute top-1/2 -mt-[0.5px] rotate-[20deg]"></div>
                    </div>
                    <div className="absolute bottom-4 right-4 w-4 h-4 rounded-full bg-neutral-800 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] border border-neutral-600">
                        <div className="w-full h-[1px] bg-neutral-900 absolute top-1/2 -mt-[0.5px] rotate-[75deg]"></div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ClosedBoard;
