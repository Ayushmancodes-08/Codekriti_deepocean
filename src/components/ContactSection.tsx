import { useState, useId } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../utils/supabaseClient';

/* ── email validation ── */
function validateEmail(email: string): string | null {
    if (!email) return 'Email is required';
    if (email.length > 254) return 'Email address is too long';
    // RFC-5321 simplified: local@domain.tld
    const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;
    if (!re.test(email)) return 'Enter a valid email — e.g. name@example.com';
    const [local] = email.split('@');
    if (local.length > 64) return 'The part before @ is too long';
    return null; // valid
}

const ContactSection = () => {
    const nameId  = useId();
    const emailId = useId();
    const msgId   = useId();

    const [formData, setFormData]   = useState({ name: '', email: '', message: '' });
    const [touched, setTouched]     = useState({ name: false, email: false, message: false });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const emailError   = touched.email   ? validateEmail(formData.email)   : null;
    const nameError    = touched.name    && !formData.name.trim() ? 'Name is required' : null;
    const messageError = touched.message && !formData.message.trim() ? 'Message is required' : null;
    const isFormValid  =
        formData.name.trim() &&
        formData.message.trim() &&
        validateEmail(formData.email) === null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setTouched(prev => ({ ...prev, [e.target.name]: true }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Mark all touched so errors show
        setTouched({ name: true, email: true, message: true });
        if (!isFormValid) return;

        setIsSubmitting(true);
        try {
            const { error } = await supabase.functions.invoke('register-team', {
                body: {
                    action: 'CONTACT',
                    payload: { name: formData.name.trim(), email: formData.email.trim(), message: formData.message.trim() },
                },
            });
            if (error) throw error;
            setSubmitted(true);
            toast.success('Message sent! We\'ll get back to you soon.');
            setFormData({ name: '', email: '', message: '' });
            setTouched({ name: false, email: false, message: false });
            setTimeout(() => setSubmitted(false), 5000);
        } catch (err: any) {
            console.error('Contact Error:', err);
            toast.error('Failed to send. Please email us directly at codingclubpmec@gmail.com');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="contact" className="relative py-16 sm:py-20 bg-black/20 overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 relative z-10">

                {/* Header */}
                <div className="text-center mb-10 sm:mb-16">
                    <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3">
                        Questions? <span className="text-cyan-400">Reach Out</span>
                    </h2>
                    <p className="font-body text-gray-400 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
                        Have questions about CodeKriti 4.0? We're here to help.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">

                    {/* Contact Info */}
                    <div className="space-y-4">
                        <h3 className="font-display text-xl sm:text-2xl font-bold text-white mb-5">Contact Information</h3>

                        <div className="group p-4 sm:p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/50 hover:bg-white/10 transition-all duration-300">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0 group-hover:scale-110 transition-transform">
                                    <Mail size={20} />
                                </div>
                                <div className="min-w-0">
                                    <h4 className="font-body text-xs text-gray-400 uppercase tracking-wider mb-1">Email</h4>
                                    <p className="font-display text-base sm:text-lg font-bold text-white break-all select-all">codingclubpmec@gmail.com</p>
                                    <p className="text-xs text-gray-500 mt-1">Mon–Fri, 9am – 5pm</p>
                                </div>
                            </div>
                        </div>

                          <a href="tel:+919178263327" className="group p-4 sm:p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/50 hover:bg-white/10 transition-all duration-300 block">
                              <div className="flex items-start gap-4">
                                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0 group-hover:scale-110 transition-transform">
                                      <Phone size={20} />
                                  </div>
                                  <div className="min-w-0">
                                      <h4 className="font-body text-xs text-gray-400 uppercase tracking-wider mb-1">Phone</h4>
                                      <p className="font-display text-base sm:text-lg font-bold text-white">+91 91782 63327</p>
                                      <p className="text-xs text-gray-500 mt-1">Available for urgent queries</p>
                                  </div>
                              </div>
                          </a>

                        <a
                            href="https://www.google.com/maps/search/?api=1&query=Parala+Maharaja+Engineering+College"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group p-4 sm:p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/50 hover:bg-white/10 transition-all duration-300 block"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0 group-hover:scale-110 transition-transform">
                                    <MapPin size={20} />
                                </div>
                                <div>
                                    <h4 className="font-body text-xs text-gray-400 uppercase tracking-wider mb-1">Location</h4>
                                    <p className="font-display text-base sm:text-lg font-bold text-white">PMEC Academic Block</p>
                                    <p className="text-xs text-gray-500 mt-1">Main Block</p>
                                    <p className="text-xs text-cyan-400 mt-2 group-hover:underline">View on Google Maps →</p>
                                </div>
                            </div>
                        </a>
                    </div>

                    {/* Form */}
                    <div className="p-6 sm:p-8 rounded-3xl bg-black/40 border border-white/10 backdrop-blur-sm shadow-xl">
                        {submitted ? (
                            <div className="flex flex-col items-center justify-center h-full min-h-[300px] gap-4 text-center">
                                <CheckCircle2 className="w-14 h-14 text-cyan-400" />
                                <h3 className="font-display text-xl font-bold text-white">Message Sent!</h3>
                                <p className="text-gray-400 text-sm max-w-xs">We've received your message and will reply shortly.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-5" aria-label="Contact form" noValidate>

                                {/* Name */}
                                <div className="space-y-1.5">
                                    <label htmlFor={nameId} className="block text-sm font-semibold text-gray-300">
                                        Your Name <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        id={nameId}
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder="Enter your name"
                                        required
                                        aria-required="true"
                                        aria-invalid={!!nameError}
                                        aria-describedby={nameError ? `${nameId}-err` : undefined}
                                        className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-1 transition-all text-sm ${
                                            nameError
                                                ? 'border-red-500/60 focus:border-red-500 focus:ring-red-500/20'
                                                : 'border-white/10 focus:border-cyan-500 focus:ring-cyan-500/20'
                                        }`}
                                    />
                                    {nameError && (
                                        <p id={`${nameId}-err`} role="alert" className="flex items-center gap-1 text-xs text-red-400 mt-1">
                                            <AlertCircle className="w-3 h-3 flex-shrink-0" />{nameError}
                                        </p>
                                    )}
                                </div>

                                {/* Email */}
                                <div className="space-y-1.5">
                                    <label htmlFor={emailId} className="block text-sm font-semibold text-gray-300">
                                        Email Address <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        id={emailId}
                                        type="email"
                                        inputMode="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder="you@example.com"
                                        required
                                        aria-required="true"
                                        aria-invalid={!!emailError}
                                        aria-describedby={emailError ? `${emailId}-err` : `${emailId}-hint`}
                                        autoComplete="email"
                                        maxLength={254}
                                        className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-1 transition-all text-sm ${
                                            emailError
                                                ? 'border-red-500/60 focus:border-red-500 focus:ring-red-500/20'
                                                : touched.email && !emailError && formData.email
                                                ? 'border-green-500/50 focus:border-green-500 focus:ring-green-500/20'
                                                : 'border-white/10 focus:border-cyan-500 focus:ring-cyan-500/20'
                                        }`}
                                    />
                                    {emailError ? (
                                        <p id={`${emailId}-err`} role="alert" className="flex items-center gap-1 text-xs text-red-400 mt-1">
                                            <AlertCircle className="w-3 h-3 flex-shrink-0" />{emailError}
                                        </p>
                                    ) : touched.email && formData.email ? (
                                        <p id={`${emailId}-hint`} className="flex items-center gap-1 text-xs text-green-400 mt-1">
                                            <CheckCircle2 className="w-3 h-3 flex-shrink-0" />Looks good!
                                        </p>
                                    ) : (
                                        <p id={`${emailId}-hint`} className="text-xs text-gray-600 mt-1">e.g. yourname@college.edu</p>
                                    )}
                                </div>

                                {/* Message */}
                                <div className="space-y-1.5">
                                    <label htmlFor={msgId} className="block text-sm font-semibold text-gray-300">
                                        Message <span className="text-red-400">*</span>
                                    </label>
                                    <textarea
                                        id={msgId}
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder="How can we help you?"
                                        required
                                        aria-required="true"
                                        aria-invalid={!!messageError}
                                        aria-describedby={messageError ? `${msgId}-err` : undefined}
                                        rows={4}
                                        maxLength={500}
                                        className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-1 transition-all resize-none text-sm ${
                                            messageError
                                                ? 'border-red-500/60 focus:border-red-500 focus:ring-red-500/20'
                                                : 'border-white/10 focus:border-cyan-500 focus:ring-cyan-500/20'
                                        }`}
                                    />
                                    <div className="flex items-center justify-between">
                                        {messageError ? (
                                            <p id={`${msgId}-err`} role="alert" className="flex items-center gap-1 text-xs text-red-400">
                                                <AlertCircle className="w-3 h-3 flex-shrink-0" />{messageError}
                                            </p>
                                        ) : <span />}
                                        <span className={`text-xs tabular-nums ${formData.message.length > 450 ? 'text-yellow-400' : 'text-gray-600'}`}>
                                            {formData.message.length}/500
                                        </span>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    aria-label={isSubmitting ? 'Sending message…' : 'Send message'}
                                    className="w-full mt-2 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-black font-bold text-base shadow-[0_0_20px_rgba(34,211,238,0.25)] hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] transition-all duration-200 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100 min-h-[48px]"
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center gap-2">
                                            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                            </svg>
                                            Sending…
                                        </span>
                                    ) : (
                                        <>Send Message <Send size={16} className="rotate-12" /></>
                                    )}
                                </button>

                            </form>
                        )}
                    </div>

                </div>
            </div>
        </section>
    );
};

export default ContactSection;
