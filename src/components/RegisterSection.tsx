import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import OceanRegistrationModal from './registration/OceanRegistrationModal';
// PERFORMANCE: Disabled Bubbles
// import Bubbles from './Bubbles';

const Seaweed = ({ className }: { className?: string }) => (
  <svg className={`seaweed pointer-events-none ${className}`} viewBox="0 0 100 150">
    <path d="M50 150 Q40 100 50 50 Q60 0 50 -50" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
    <path d="M50 150 Q60 110 50 70 Q40 30 50 -10" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" opacity="0.7" />
    <path d="M50 150 Q30 120 50 90 Q70 60 50 30" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity="0.5" />
  </svg>
);

const RegisterSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRegisterClick = () => {
    setIsModalOpen(true);
  };

  return (
    <section id="register" ref={ref} className="relative min-h-screen py-32 flex items-center overflow-hidden">
      {/* PERFORMANCE: Disabled Bubbles */}
      {/* <Bubbles /> */}
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto glass-card rounded-3xl p-8 md:p-16 relative overflow-hidden splash-effect border border-white/10 shadow-[0_0_50px_rgba(8,145,178,0.1)]"
        >
          {/* Decorative elements */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="absolute top-0 right-0 p-8 text-primary/10">
            <Seaweed className="w-32 h-48 rotate-12" />
          </div>
          <div className="absolute bottom-0 left-0 p-8 text-accent/10">
            <Seaweed className="w-24 h-36 -rotate-12" />
          </div>

          <div className="text-center relative z-10">
            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="font-display text-4xl md:text-6xl font-bold text-foreground mb-4 leading-tight"
            >
              READY TO <span className="text-primary">COMPETE?</span>
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="font-body text-base md:text-lg text-foreground/70 mb-8 max-w-2xl mx-auto"
            >
              Registration closes March 5, 2026. Don't miss your chance to be part of history.
            </motion.p>

            {/* REGISTER NOW Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <button
                id="register-btn-container"
                onClick={handleRegisterClick}
                className="group relative px-10 py-5 font-bold text-lg rounded-full overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/15 focus:outline-none focus:ring-0"
              >
                {/* Animated gradient background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-[#00D9FF]"
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  style={{ backgroundSize: '200% 100%' }}
                />
                <span className="relative z-10 inline-flex items-center gap-3 text-white font-display text-xl uppercase tracking-wider">
                  REGISTER NOW
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-200" />
                </span>
              </button>
            </motion.div>

            {/* Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="mt-12 flex flex-col md:flex-row gap-6 justify-center items-center"
            >
              <div className="flex items-center gap-3 text-foreground/80">
                <span className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-accent text-xs">✓</span>
                <span className="font-body text-sm font-medium">Official Certification from CodeKriti</span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Info row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            { label: 'Venue', value: 'PMEC ACADEMIC BLOCK' },
            { label: 'Dates', value: 'March 6-7, 2026' },
            { label: 'Contact', value: 'codingclubpmec@gmail.com' },
          ].map((item) => (
            <div key={item.label} className="glass-card rounded-2xl p-6 border border-white/5 text-center">
              <div className="text-[10px] text-primary/50 uppercase tracking-[0.2em] font-bold mb-1">{item.label}</div>
              <div className="font-display text-lg font-medium text-foreground">{item.value}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Ocean-Themed Registration Modal */}
      <OceanRegistrationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
};

export default RegisterSection;
