import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { Menu, X } from 'lucide-react';



const navItems = [
  { name: 'Home', href: '#hero', id: 'hero' },
  { name: 'About', href: '#about', id: 'about' },
  { name: 'Events', href: '#events', id: 'events' },
  { name: 'Register', href: '#register', id: 'register' },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { activeSectionId } = useScrollProgress();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  // Close mobile menu when a link is clicked
  const handleLinkClick = () => setIsMobileMenuOpen(false);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'glass-card py-3' : 'py-6'
        }`}
    >
      <nav className="container mx-auto px-6 flex items-center justify-between relative z-50">
        {/* Logo */}
        <motion.a
          href="#hero"
          className="flex items-center gap-3 touch-manipulation focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="CODEKRITI 4.0 - Home"
        >
          <div className="relative">
            <img
              src="/images/codekriti-logo.jpg"
              alt="CodeKriti Logo"
              className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
            />
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-lg -z-10" />
          </div>
          <div className="flex flex-col -gap-1">
            <span className="font-display font-bold text-lg md:text-xl text-foreground text-glow leading-none">
              CODEKRITI
            </span>
            <span className="font-display text-[8px] md:text-[10px] text-primary tracking-[0.2em] font-medium">
              4.0 EDITION
            </span>
          </div>
        </motion.a>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item, index) => {
            const isActive = activeSectionId === item.id;
            return (
              <motion.a
                key={item.name}
                href={item.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
                className={`relative font-body text-sm font-medium transition-colors duration-300 group px-2 py-1.5 rounded touch-manipulation focus:outline-none ${isActive ? 'text-primary' : 'text-foreground/80 hover:text-primary active:text-primary'
                  }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.name}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full group-active:w-full'
                  }`} />
              </motion.a>
            );
          })}
        </div>

        {/* Desktop CTA Button */}
        <div className="hidden md:block">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.preventDefault();
              const eventsSection = document.getElementById('events');
              if (eventsSection) {
                // ... same scroll logic ...
                const start = window.scrollY;
                const target = eventsSection.getBoundingClientRect().top + window.scrollY;
                const distance = target - start;
                const duration = 1000;
                const startTime = performance.now();

                const animate = (currentTime: number) => {
                  const elapsed = currentTime - startTime;
                  const progress = Math.min(elapsed / duration, 1);
                  const ease = progress < 0.5
                    ? 8 * progress * progress * progress * progress
                    : 1 - Math.pow(-2 * progress + 2, 4) / 2;

                  window.scrollTo(0, start + distance * ease);

                  if (elapsed < duration) requestAnimationFrame(animate);
                };
                requestAnimationFrame(animate);
              }
            }}
            className="dive-in-btn relative px-6 py-2.5 rounded-full font-display font-semibold text-sm overflow-hidden group touch-manipulation cursor-pointer"
            aria-label="Dive In"
          >
            <span className="relative z-10 text-white">Dive In</span>
          </motion.button>
        </div>

        {/* Mobile Menu Toggle */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={toggleMobileMenu}
          className="md:hidden relative z-50 p-2 text-white/80 hover:text-white"
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </motion.button>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[#0a192f]/95 backdrop-blur-xl md:hidden flex flex-col items-center justify-center gap-8"
          >
            {navItems.map((item, index) => (
              <motion.a
                key={item.name}
                href={item.href}
                onClick={handleLinkClick}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                className={`text-2xl font-display font-bold tracking-widest ${activeSectionId === item.id ? 'text-cyan-400' : 'text-white/70'
                  }`}
              >
                {item.name}
              </motion.a>
            ))}

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              onClick={() => {
                handleLinkClick();
                // ... same scroll logic trigger ...
                const eventsSection = document.getElementById('events');
                if (eventsSection) eventsSection.scrollIntoView({ behavior: 'smooth' });
              }}
              className="mt-4 px-8 py-3 rounded-full bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 font-bold uppercase tracking-widest"
            >
              Dive In
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
