import { useState, useEffect, useCallback } from 'react';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { Menu, X } from 'lucide-react';
import { ASSETS } from '@/config/assets';

const navItems = [
    { name: 'Home',     href: '#hero',     id: 'hero' },
    { name: 'About',    href: '#about',    id: 'about' },
    { name: 'Events',   href: '#events',   id: 'events' },
    { name: 'Timeline', href: '#schedule', id: 'schedule' },
    { name: 'Register', href: '#register', id: 'register' },
];

const Navbar = () => {
    const [scrolled, setScrolled]         = useState(false);
    const [drawerOpen, setDrawerOpen]     = useState(false);
    const { activeSectionId }             = useScrollProgress();

    /* ── scroll detection ── */
    useEffect(() => {
        let rafId: number | null = null;
        const onScroll = () => {
            if (rafId) return;
            rafId = requestAnimationFrame(() => {
                setScrolled(window.scrollY > 50);
                rafId = null;
            });
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => { window.removeEventListener('scroll', onScroll); if (rafId) cancelAnimationFrame(rafId); };
    }, []);

    /* ── body scroll lock when drawer open ── */
    useEffect(() => {
        if (drawerOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [drawerOpen]);

    /* ── close drawer on Escape ── */
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setDrawerOpen(false); };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, []);

    const openDrawer  = useCallback(() => setDrawerOpen(true),  []);
    const closeDrawer = useCallback(() => setDrawerOpen(false), []);

    return (
        <>
            <header
                    className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ease-out ${
                        scrolled
                            ? 'glass-card py-2 shadow-[0_4px_30px_rgba(0,0,0,0.5)] border-b border-cyan-500/10'
                            : 'py-4 md:py-6'
                    }`}
            >
                <nav className="container mx-auto px-4 md:px-6 flex items-center justify-between h-14 md:h-auto">

                    {/* Logo */}
                    <a
                        href="#hero"
                        className="flex items-center gap-2.5 touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg transition-transform duration-200 hover:scale-105 active:scale-95"
                        aria-label="CODEKRITI 4.0 – Home"
                        onClick={closeDrawer}
                    >
                        <div className="relative flex-shrink-0">
                            <img
                                src={ASSETS.LOGO}
                                alt="CodeKriti Logo"
                                className="w-10 h-10 md:w-13 md:h-13 rounded-full object-cover border border-cyan-400/50 shadow-[0_0_12px_rgba(6,182,212,0.3)]"
                            />
                            <div className="absolute inset-0 rounded-full bg-cyan-500/10 blur-lg -z-10 animate-pulse" />
                        </div>
                        <div className="flex flex-col -gap-0.5">
                            <span className="font-display font-bold text-sm md:text-xl text-white text-glow leading-none">CODEKRITI</span>
                            <span className="font-display text-[8px] md:text-[10px] text-primary tracking-[0.2em] font-medium">4.0 EDITION</span>
                        </div>
                    </a>

                    {/* Desktop nav */}
                    <div className="hidden md:flex items-center gap-8">
                        {navItems.map((item) => {
                            const isActive = activeSectionId === item.id;
                            return (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className={`relative font-body text-sm font-medium transition-all duration-300 group px-2 py-1.5 rounded focus:outline-none ${
                                        isActive
                                            ? 'text-primary drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]'
                                            : 'text-foreground/80 hover:text-primary'
                                    }`}
                                    aria-current={isActive ? 'page' : undefined}
                                >
                                    {item.name}
                                    <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 ${
                                        isActive ? 'w-full' : 'w-0 group-hover:w-full'
                                    }`} />
                                </a>
                            );
                        })}
                    </div>

                    {/* Desktop CTA */}
                    <div className="hidden md:block">
                        <a
                            href="/assets/Brochurecokekriti.pdf"
                            download="CodeKriti_Brochure.pdf"
                            className="dive-in-btn relative px-6 py-2.5 rounded-full font-display font-semibold text-sm overflow-hidden group touch-manipulation cursor-pointer transition-transform duration-200 hover:scale-105 active:scale-95 inline-block"
                        >
                            <span className="relative z-10 text-white">Download Brochure</span>
                        </a>
                    </div>

                    {/* Mobile hamburger — min 44×44 touch target */}
                    <button
                        onClick={openDrawer}
                        className="md:hidden flex items-center justify-center w-11 h-11 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all active:scale-90 touch-manipulation"
                        aria-label="Open navigation menu"
                        aria-expanded={drawerOpen}
                        aria-controls="mobile-drawer"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </nav>
            </header>

            {/* ── Mobile Drawer ── */}
            {/* Backdrop */}
            <div
                id="mobile-drawer-backdrop"
                onClick={closeDrawer}
                className={`md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
                    drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
                aria-hidden="true"
            />

            {/* Slide-in panel */}
            <nav
                id="mobile-drawer"
                role="dialog"
                aria-modal="true"
                aria-label="Navigation menu"
                className={`md:hidden fixed top-0 right-0 bottom-0 z-50 w-72 max-w-[85vw] flex flex-col bg-[#050A14]/98 border-l border-cyan-500/20 backdrop-blur-xl shadow-2xl transition-transform duration-300 ease-out ${
                    drawerOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                {/* Drawer header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 flex-shrink-0">
                    <span className="font-display font-bold text-base text-white">Navigation</span>
                    <button
                        onClick={closeDrawer}
                        className="flex items-center justify-center w-11 h-11 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all active:scale-90 touch-manipulation"
                        aria-label="Close navigation menu"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Nav links */}
                <div className="flex-1 overflow-y-auto py-3">
                    {navItems.map((item) => {
                        const isActive = activeSectionId === item.id;
                        return (
                            <a
                                key={item.name}
                                href={item.href}
                                onClick={closeDrawer}
                                className={`flex items-center min-h-[52px] px-5 py-3 font-display font-medium text-base tracking-wide transition-colors duration-200 border-l-[3px] ${
                                    isActive
                                        ? 'text-cyan-400 bg-cyan-950/30 border-l-cyan-400'
                                        : 'text-white/80 hover:text-white hover:bg-white/5 border-l-transparent'
                                }`}
                            >
                                {item.name}
                            </a>
                        );
                    })}
                </div>

                {/* Drawer footer CTA */}
                <div className="p-5 border-t border-white/5 flex-shrink-0">
                    <a
                        href="/assets/Brochurecokekriti.pdf"
                        download="CodeKriti_Brochure.pdf"
                        onClick={closeDrawer}
                        className="flex items-center justify-center w-full h-12 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-display font-bold text-sm uppercase tracking-wider shadow-lg active:scale-95 transition-transform touch-manipulation"
                    >
                        Download Brochure
                    </a>
                </div>
            </nav>
        </>
    );
};

export default Navbar;
