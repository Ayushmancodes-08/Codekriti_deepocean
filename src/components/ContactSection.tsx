import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { toast } from 'sonner';

const ContactSection = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.message) {
            toast.error("Please fill in all fields");
            return;
        }

        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            toast.success("Message sent successfully!");
            setFormData({ name: '', email: '', message: '' });
        }, 1500);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <section id="contact" className="relative py-20 bg-black/20 overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">

                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
                        Questions? <span className="text-cyan-400">Reach Out</span>
                    </h2>
                    <p className="font-body text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
                        Have questions about CodeKriti 4.0? We're here to help you navigate the depths.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">

                    {/* Contact Info - Left Column */}
                    <div className="space-y-6">
                        <h3 className="font-display text-2xl font-bold text-white mb-8">Contact Information</h3>

                        {/* Cards */}
                        <div className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/50 hover:bg-white/10 transition-all duration-300">
                            <div className="flex items-start gap-5">
                                <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0 group-hover:scale-110 transition-transform">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <h4 className="font-body text-sm text-gray-400 uppercase tracking-wider mb-1">Email</h4>
                                    <p className="font-display text-lg font-bold text-white select-all">codingclubpmec@gmail.com</p>
                                    <p className="text-sm text-gray-500 mt-1">Mon-Fri, 9am - 5pm</p>
                                </div>
                            </div>
                        </div>

                        <div className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/50 hover:bg-white/10 transition-all duration-300">
                            <div className="flex items-start gap-5">
                                <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0 group-hover:scale-110 transition-transform">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <h4 className="font-body text-sm text-gray-400 uppercase tracking-wider mb-1">Phone</h4>
                                    <p className="font-display text-lg font-bold text-white select-all">+91 91782 63327</p>
                                    <p className="text-sm text-gray-500 mt-1">Available for urgent queries</p>
                                </div>
                            </div>
                        </div>

                        <div className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/50 hover:bg-white/10 transition-all duration-300">
                            <div className="flex items-start gap-5">
                                <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0 group-hover:scale-110 transition-transform">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h4 className="font-body text-sm text-gray-400 uppercase tracking-wider mb-1">Location</h4>
                                    <p className="font-display text-lg font-bold text-white">PMEC ACADEMIC BLOCK</p>
                                    <p className="text-sm text-gray-500 mt-1">Main Block, 2nd Floor</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form - Right Column */}
                    <div className="p-8 rounded-3xl bg-black/40 border border-white/10 backdrop-blur-sm shadow-xl">
                        <form onSubmit={handleSubmit} className="space-y-6">

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-300 ml-1">Your Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter your name"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-300 ml-1">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter your email"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-300 ml-1">Message</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="How can we help you?"
                                    rows={4}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full mt-4 py-4 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-600 hover:from-cyan-500 hover:to-cyan-700 text-black font-bold text-lg shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Sending...' : (
                                    <>
                                        Send Message <Send size={18} className="transform rotate-12" />
                                    </>
                                )}
                            </button>

                        </form>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default ContactSection;
