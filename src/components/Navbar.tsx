import { useState, useEffect } from 'react';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { Menu, X } from 'lucide-react';
import { ASSETS } from '@/config/assets';


const navItems = [
  { name: 'Home', href: '#hero', id: 'hero' },
  { name: 'About', href: '#about', id: 'about' },
  { name: 'Events', href: '#events', id: 'events' },
  { name: 'Timeline', href: '#schedule', id: 'schedule' },
  { name: 'Register', href: '#register', id: 'register' },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { activeSectionId } = useScrollProgress();

  useEffect(() => {
    let rafId: number | null = null;

    const handleScroll = () => {
      if (rafId) return;

      rafId = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 50);
        rafId = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  // Close mobile menu when a link is clicked
  const handleLinkClick = () => setIsMobileMenuOpen(false);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 modal-open:hidden transition-all duration-500 ease-out transform ${scrolled
        ? 'glass-card py-2 shadow-lg'
        : 'py-4 md:py-6 translate-y-0 opacity-100'
        }`}
    >
      <nav className="container mx-auto px-4 md:px-6 flex items-center justify-between relative z-50 h-[56px] md:h-auto"> {/* Enforce 56px height on mobile */}
        {/* Logo */}
        <a
          href="#hero"
          className="flex items-center gap-3 touch-manipulation focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg transition-transform duration-200 hover:scale-105 active:scale-95"
          aria-label="CODEKRITI 4.0 - Home"
        >
          <div className="relative">
            <img
              src={ASSETS.LOGO}
              alt="CodeKriti Logo"
              className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover border border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] group-hover:border-cyan-400"
            />
            <div className="absolute inset-0 rounded-full bg-cyan-500/10 blur-lg -z-10 animate-pulse" />
          </div>
          <div className="flex flex-col -gap-1">
            <span className="font-display font-bold text-base md:text-xl text-foreground text-glow leading-none"> {/* Smaller text on mobile */}
              CODEKRITI
            </span>
            <span className="font-display text-[8px] md:text-[10px] text-primary tracking-[0.2em] font-medium">
              4.0 EDITION
            </span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const isActive = activeSectionId === item.id;
            return (
              <a
                key={item.name}
                href={item.href}
                className={`relative font-body text-sm font-medium transition-colors duration-300 group px-2 py-1.5 rounded touch-manipulation focus:outline-none ${isActive ? 'text-primary' : 'text-foreground/80 hover:text-primary active:text-primary'
                  }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.name}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full group-active:w-full'
                  }`} />
              </a>
            );
          })}
        </div>

        {/* Desktop CTA Button */}
        <div className="hidden md:block">
          <a
            href="/assets/Brochurecokekriti.pdf"
            download="CodeKriti_Brochure.pdf"
            className="dive-in-btn relative px-6 py-2.5 rounded-full font-display font-semibold text-sm overflow-hidden group touch-manipulation cursor-pointer transition-transform duration-200 hover:scale-105 active:scale-95 inline-block"
            aria-label="Download Brochure"
          >
            <span className="relative z-10 text-white">Download Brochure</span>
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden relative z-50 p-2 text-white/80 hover:text-white transition-transform active:scale-90"
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu Slide-Down */}
      <div className={`md:hidden absolute top-full left-0 w-full overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-screen opacity-100 shadow-2xl' : 'max-h-0 opacity-0'}`}>
        <div className="bg-dark-blue border-t border-cyan-500/20 backdrop-blur-xl flex flex-col">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={handleLinkClick}
              className={`px-4 py-4 border-b border-white/5 font-display font-medium text-base tracking-wide transition-colors duration-200 
                ${activeSectionId === item.id
                  ? 'text-cyan-400 bg-cyan-950/20 border-l-4 border-l-cyan-400 pl-3'
                  : 'text-white/80 hover:text-white hover:bg-white/5 border-l-4 border-l-transparent'
                }`}
            >
              {item.name}
            </a>
          ))}

          <div className="p-4">
            <a
              href="/assets/Brochurecokekriti.pdf"
              download="CodeKriti_Brochure.pdf"
              onClick={handleLinkClick}
              className="block w-full py-3 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-display font-bold uppercase tracking-wider shadow-lg shadow-cyan-900/20 active:scale-95 transition-transform h-[44px] text-center flex items-center justify-center" // Ensure 44px height
            >
              Download Brochure
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
