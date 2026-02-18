import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { subscribeNewsletter } from '@/utils/supabaseClient';
import { ASSETS } from '@/config/assets';
import { Mail, Twitter, MessageCircle, Instagram, Github, Lock } from 'lucide-react';

const Footer = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setMessage('');
    setIsError(false);

    try {
      await subscribeNewsletter(email);
      setMessage('Thanks for subscribing!');
      setEmail('');
      setTimeout(() => setMessage(''), 5000);
    } catch (error) {
      console.error('Newsletter error:', error);
      setMessage('Something went wrong. Please try again.');
      setIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer id="footer" className="relative z-10 bg-black/40 pt-12 pb-8 overflow-hidden border-t border-white/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12 mb-8">
          {/* Brand Info */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="p-1 rounded-full border border-cyan-500/30">
                <img
                  src={ASSETS.LOGO}
                  alt="CodeKriti Logo"
                  loading="lazy"
                  className="h-10 w-10 rounded-full object-cover shadow-[0_0_10px_rgba(6,182,212,0.3)]"
                />
              </div>
              <span className="font-display font-bold text-xl text-white tracking-wide">
                CodeKriti <span className="text-cyan-400">4.0</span>
              </span>
            </div>
            <p className="font-body text-sm text-gray-400 leading-relaxed max-w-sm">
              Dive deep into innovation at the most anticipated hackathon of the year. Where technology meets the mystery of the deep ocean.
            </p>
            {/* Social Icons */}
            <div className="flex gap-3 mt-2">
              {[
                { icon: Twitter, href: '#', label: 'Twitter' },
                { icon: MessageCircle, href: '#', label: 'Discord' }, // Using MessageCircle as Discord placeholder
                { icon: Instagram, href: '#', label: 'Instagram' },
                { icon: Github, href: '#', label: 'Github' }
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-cyan-500/20 hover:border-cyan-500/50 cursor-pointer transition-all touch-manipulation"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}


            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-base md:text-lg font-bold text-white mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { name: 'Home', href: '#hero' },
                { name: 'About', href: '#about' },
                { name: 'Events', href: '#events' },
                { name: 'Contact', href: '#contact' }
              ].map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-cyan-400 transition-colors text-sm font-medium py-1 block"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="font-display text-base md:text-lg font-bold text-white mb-4">
              Stay Updated
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Subscribe to our newsletter for the latest updates and announcements.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-3">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all min-h-[44px]"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm min-h-[44px]"
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </button>
              {message && (
                <p className={`text-xs text-center ${isError ? 'text-red-400' : 'text-green-400'}`}>
                  {message}
                </p>
              )}
            </form>
          </div>
        </div>

        <hr className="border-t border-white/10 my-6" />

        {/* Footer bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm gap-4 text-gray-500 text-center md:text-left">
          <div className="text-xs sm:text-sm">
            &copy; {currentYear} CodeKriti 4.0 - Deep Ocean Edition. All rights reserved.
          </div>

          <div className="flex items-center gap-1 text-xs sm:text-sm">
            Made with <span className="text-red-500 animate-pulse">❤</span> by CDD Web Team
            {/* Admin Trigger (Lock Icon) - Subtle & Right Side */}
            <button
              onClick={() => {
                const pass = prompt("Enter Access Protocol:");
                if (!pass) return;
                const cleanPass = pass.trim();

                if (cleanPass === "deep-dive-admin") {
                  window.dispatchEvent(new CustomEvent('OPEN_BROADCAST_MODAL', { detail: cleanPass }));
                } else if (cleanPass === "2025") {
                  console.log("Admin access granted");
                  navigate('/admin');
                } else {
                  console.log("Access denied");
                }
              }}
              className="ml-2 w-6 h-6 rounded bg-white/5 flex items-center justify-center text-gray-600 hover:text-cyan-400 hover:bg-cyan-900/20 transition-all opacity-50 hover:opacity-100"
              aria-label="Admin Access"
            >
              <Lock className="w-3 h-3" />
            </button>
          </div>
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
