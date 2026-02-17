import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Lock } from 'lucide-react';

import { toast } from 'sonner';

// Placeholder for broadcast functionality
const broadcastMessage = async (subject: string, message: string, password: string) => {
    console.log("Broadcast simulated:", { subject, message, password });
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { status: 'success' };
};

const BroadcastModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [password, setPassword] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

    useEffect(() => {
        const handleOpen = (e: CustomEvent) => {
            setIsOpen(true);
            setPassword(e.detail);
        };
        window.addEventListener('OPEN_BROADCAST_MODAL' as any, handleOpen);
        return () => window.removeEventListener('OPEN_BROADCAST_MODAL' as any, handleOpen);
    }, []);

    const handleSend = async () => {
        if (!subject || !message) {
            toast.error("All fields required");
            return;
        }
        setStatus('sending');
        try {
            await broadcastMessage(subject, message, password);
            setStatus('success');
            toast.success("Broadcast initiated to all users.");
            setTimeout(() => setIsOpen(false), 2000);
        } catch (error) {
            console.error(error);
            toast.error("Failed to broadcast.");
            setStatus('error');
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="w-full max-w-lg bg-[#0a192f] border border-red-500/30 rounded-2xl shadow-2xl overflow-hidden"
                >
                    <div className="bg-red-900/20 p-4 border-b border-red-500/20 flex justify-between items-center">
                        <div className="flex items-center gap-2 text-red-400 font-mono">
                            <Lock size={16} />
                            <span className="font-bold">COMMAND CENTER // BROADCAST</span>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-6 space-y-4">
                        <div>
                            <label className="text-xs text-gray-500 uppercase tracking-widest mb-1 block">Subject</label>
                            <input
                                value={subject}
                                onChange={e => setSubject(e.target.value)}
                                className="w-full bg-black/40 border border-gray-700 rounded-lg p-3 text-white focus:border-red-500/50 outline-none"
                                placeholder="CodeKriti Alert: ..."
                            />
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 uppercase tracking-widest mb-1 block">Payload (Message)</label>
                            <textarea
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                                rows={6}
                                className="w-full bg-black/40 border border-gray-700 rounded-lg p-3 text-white focus:border-red-500/50 outline-none resize-none font-mono text-sm"
                                placeholder="Enter your transmission..."
                            />
                            <p className="text-xs text-gray-600 mt-1">Supports HTML (Basic)</p>
                        </div>

                        <button
                            onClick={handleSend}
                            disabled={status === 'sending'}
                            className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                        >
                            {status === 'sending' ? 'Transmitting...' : (
                                <>
                                    <Send size={16} />
                                    BROADCAST TO ALL
                                </>
                            )}
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default BroadcastModal;
