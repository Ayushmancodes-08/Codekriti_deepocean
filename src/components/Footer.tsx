import { useState } from 'react';
import { TextHoverEffect } from './ui/text-hover-effect';
import { Github, Twitter, Linkedin, Youtube, Mail, MapPin, Send } from 'lucide-react';
import { subscribeNewsletter } from '@/utils/googleSheets';
import { toast } from 'sonner';
import { ASSETS } from '@/config/assets';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubscribe = async () => {
    if (!email || !email.includes('@')) {
      toast.error("Please enter a valid email");
      return;
    }
    setStatus('loading');
    try {
      await subscribeNewsletter(email);
      setStatus('success');
      toast.success("Subscribed to Abyss Daily!");
      setEmail('');
    } catch (e) {
      console.error(e);
      // Fallback for demo
      setStatus('success');
      toast.success("Subscribed! (Offline Mode)");
    }
  };
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'Navigation',
      links: [
        { name: 'Home', href: '#hero' },
        { name: 'About', href: '#about' },
        { name: 'Events', href: '#events' },
        { name: 'Register', href: '#register' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { name: 'Rulebook', href: '#' },
        { name: 'Schedule', href: '#' },
        { name: 'FAQs', href: '#' },
        { name: 'Sponsorship', href: '#' },
      ],
    },
  ];

  const socialLinks = [
    { icon: <Github size={20} />, label: "Github", href: "#" },
    { icon: <Twitter size={20} />, label: "Twitter", href: "#" },
    { icon: <Linkedin size={20} />, label: "LinkedIn", href: "#" },
    { icon: <Youtube size={20} />, label: "YouTube", href: "#" },
  ];

  return (
    <footer id="footer" className="relative bg-black/40 pt-20 pb-10 overflow-hidden mt-20">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <img
                src={ASSETS.LOGO}
                alt="CodeKriti Logo"
                className="h-12 w-12 rounded-xl object-cover shadow-lg shadow-cyan-500/20"
              />
              <span className="font-display font-bold text-2xl text-white tracking-wide">
                CODEKRITI
              </span>
            </div>
            <p className="font-body text-sm text-gray-400 leading-relaxed max-w-xs">
              The premier deep-ocean tech festival. Exploring the frontier where
              marine biology meets digital innovation. Join the descent in 2025.
            </p>

            <div className="flex flex-col gap-2 mt-4">
              <a href="mailto:contact@codekriti.com" className="flex items-center gap-2 text-sm text-gray-400 hover:text-cyan-400 transition-colors">
                <Mail size={16} />
                <span>contact@codekriti.com</span>
              </a>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <MapPin size={16} />
                <span>Deep Tech Campus, India</span>
              </div>
            </div>
          </div>

          {/* Links Sections */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="font-display text-sm font-bold text-white uppercase tracking-widest mb-6">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="group flex items-center gap-2 font-body text-sm text-gray-400 hover:text-cyan-400 transition-colors duration-300"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/0 group-hover:bg-cyan-500 transition-all duration-300" />
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter / Contact */}
          <div>
            <h3 className="font-display text-sm font-bold text-white uppercase tracking-widest mb-6">
              Stay Updated
            </h3>
            <p className="text-xs text-gray-400 mb-4">
              Subscribe to get the latest updates about events and workshops.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === 'loading' || status === 'success'}
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors w-full disabled:opacity-50"
              />
              <button
                onClick={handleSubscribe}
                disabled={status === 'loading' || status === 'success'}
                className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold p-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {status === 'loading' ? <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <Send size={18} />}
              </button>
            </div>
            {status === 'success' && <p className="text-xs text-green-400 mt-2">Successfully subscribed!</p>}
            {status === 'error' && <p className="text-xs text-red-400 mt-2">Something went wrong. Try again.</p>}
          </div>
        </div>

        <hr className="border-t border-white/10 my-8" />

        {/* Footer bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm gap-4">
          <div className="flex gap-4">
            {socialLinks.map(({ icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-cyan-600 transition-all duration-300 hover:scale-110 hover:shadow-[0_0_15px_rgba(8,145,178,0.4)]"
              >
                {icon}
              </a>
            ))}
          </div>

          &copy; {currentYear} CodeKriti 4.0. All rights reserved.
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
