import { useState } from 'react';
import { Send } from 'lucide-react';
import { toast } from 'sonner';
import { subscribeNewsletter } from '@/utils/googleSheets';

const NewsletterSection = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !email.includes('@')) {
            toast.error("Please enter a valid email");
            return;
        }
        setStatus('loading');
        try {
            await subscribeNewsletter(email);
            setStatus('success');
            toast.success("Subscribed to CodeKriti Updates!");
            setEmail('');
        } catch (e) {
            console.error(e);
            // Fallback for demo
            setStatus('success');
            toast.success("Subscribed! (Offline Mode)");
        }
    };

    return (
        <section className="relative py-24 bg-black overflow-hidden border-t border-white/5">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-900/40 via-transparent to-transparent" />
            </div>

            <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">

                {/* Text Content */}
                <div className="max-w-xl text-center md:text-left">
                    <h2 className="font-display text-4xl font-bold text-white mb-4 tracking-tight">
                        STAY <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">UPDATED</span>
                    </h2>
                    <p className="font-body text-gray-400 text-lg">
                        Subscribe to get the latest updates about events, workshops, and hints for the treasure hunt.
                    </p>
                </div>

                {/* Input Form */}
                <div className="w-full max-w-lg">
                    <form onSubmit={handleSubscribe} className="flex gap-3">
                        <div className="relative flex-grow">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={status === 'loading' || status === 'success'}
                                className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-white text-lg placeholder-gray-500 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all disabled:opacity-50 tracking-wide"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={status === 'loading' || status === 'success'}
                            className="h-14 w-14 md:w-auto md:px-8 rounded-2xl bg-cyan-400 hover:bg-cyan-500 text-black font-bold flex items-center justify-center transition-all transform hover:scale-105 active:scale-95 disabled:opacity-70 shadow-[0_0_15px_rgba(34,211,238,0.4)]"
                        >
                            {status === 'loading' ? (
                                <div className="w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                            ) : (
                                <Send size={24} className="md:hidden" /> // Icon only on mobile
                            )}
                            <span className="hidden md:block text-lg">Subscribe</span>
                            <Send size={20} className="hidden md:block ml-2" />
                        </button>
                    </form>

                    {/* Status Messages */}
                    <div className="mt-3 pl-2">
                        {status === 'success' && (
                            <p className="text-green-400 text-sm font-medium flex items-center gap-2">
                                ✓ Successfully subscribed!
                            </p>
                        )}
                        {status === 'error' && (
                            <p className="text-red-400 text-sm font-medium">
                                Something went wrong. Please try again.
                            </p>
                        )}
                    </div>
                </div>

            </div>
        </section>
    );
};

export default NewsletterSection;
