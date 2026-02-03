import { TextHoverEffect } from './ui/text-hover-effect';
import { ASSETS } from '@/config/assets';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Social links or just keep the T D I G for now as per design
  // If the bottom social links are still there, they might need the icons.
  // I will check if I should remove the bottom social links block or keep it.
  // The screenshot showed the Copyright line. The social icons were moved up in my new design (col 1).
  // So likely I should remove the bottom social links block.


  return (
    <footer id="footer" className="relative bg-black/40 pt-20 pb-10 overflow-hidden mt-20">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16 border-t border-white/5 pt-16 mt-16">
          {/* Brand Info */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-blue-600/10 rounded-xl border border-white/10">
                <img
                  src={ASSETS.LOGO}
                  alt="CodeKriti Logo"
                  className="h-8 w-8 object-contain"
                />
              </div>
              <span className="font-display font-bold text-xl text-white tracking-wide">
                CodeKriti <span className="text-cyan-400">4.0</span>
              </span>
            </div>
            <p className="font-body text-sm text-gray-400 leading-relaxed max-w-sm">
              Dive deep into innovation at the most anticipated hackathon of the
              year. Where technology meets the mystery of the deep ocean.
            </p>
            {/* Socials moved here or kept at bottom? Screenshot shows T D I G buttons. */}
            <div className="flex gap-3 mt-2">
              {/* Simple icon buttons */}
              {['T', 'D', 'I', 'G'].map((initial, idx) => (
                <div key={idx} className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-gray-400 hover:text-white hover:bg-cyan-500/20 hover:border-cyan-500/50 cursor-pointer transition-all">
                  {initial}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-lg font-bold text-white mb-6">
              Quick Links
            </h3>
            <ul className="space-y-4">
              {[
                { name: 'Home', href: '#hero' },
                { name: 'About', href: '#about' },
                { name: 'Events', href: '#events' },
                { name: 'Timeline', href: '#schedule' },
                { name: 'Contact', href: '#contact' }
              ].map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-cyan-400 transition-colors text-sm font-medium"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-display text-lg font-bold text-white mb-6">
              Resources
            </h3>
            <ul className="space-y-4">
              {[
                { name: 'Participant Guide', href: '#' },
                { name: 'Rules & Guidelines', href: '#' },
                { name: 'FAQ', href: '#' },
                { name: 'Sponsor Us', href: '#' }
              ].map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-cyan-400 transition-colors text-sm font-medium"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr className="border-t border-white/10 my-8" />

        {/* Footer bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm gap-4 text-gray-500">
          <div>
            &copy; {currentYear} CodeKriti 4.0 - Deep Ocean Edition. All rights reserved.
          </div>

          <div className="flex items-center gap-1">
            Made with <span className="text-red-500 animate-pulse">❤</span> by Team DeepOcean
          </div>
        </div>
      </div>

      {/* Hidden Admin Trigger */}
      <button
        onClick={() => {
          const pass = prompt("Enter Protocol Access Code:");
          if (pass === "deep-dive-admin") {
            window.dispatchEvent(new CustomEvent('OPEN_BROADCAST_MODAL', { detail: pass }));
          }
        }}
        className="absolute bottom-2 right-2 opacity-5 hover:opacity-100 transition-opacity text-white"
      >
        <span className="text-[10px] font-mono">CMD</span>
      </button>

      {/* Text hover effect - Large Background Text */}
      <div className="w-full flex justify-center items-center opacity-50 pointer-events-none select-none mt-10">
        <div className="h-[200px] w-full max-w-5xl">
          <TextHoverEffect text="CODEKRITI" />
        </div>
      </div>

      {/* Background Gradient */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 100%, rgba(6,182,212,0.15) 0%, rgba(0,0,0,0) 60%)",
        }}
      />
    </footer >
  );
};

export default Footer;
