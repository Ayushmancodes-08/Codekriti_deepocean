import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { toPng } from 'html-to-image';
import { useRef, useState } from 'react';
import { ASSETS } from '@/config/assets';

interface DigitalTicketProps {
    data: {
        name: string;
        teamName: string;
        event: string;
        id: string;
        date: string;
        qrPayload?: string;
    };
    onClose: () => void;
}

const DigitalTicket = ({ data, onClose }: DigitalTicketProps) => {
    const ticketRef = useRef<HTMLDivElement>(null);
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = async () => {
        if (!ticketRef.current) return;

        try {
            setIsDownloading(true);
            const dataUrl = await toPng(ticketRef.current, {
                cacheBust: true,
                pixelRatio: 2, // Higher resolution
                backgroundColor: 'transparent',
                skipFonts: true // Fix CORS issues with Google Fonts
            });

            const link = document.createElement('a');
            link.download = `CodeKriti-Pass-${data.id}.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('Failed to download ticket:', err);
            // Fallback for some browsers or if image generation fails
            alert('Could not generate image automatically. Please take a screenshot!');
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-6 w-full h-full">
            <motion.div
                initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ duration: 0.8, type: 'spring' }}
                className="relative w-full max-w-md perspective-1000"
            >
                {/* The Ticket Card */}
                <div
                    ref={ticketRef}
                    className="relative overflow-hidden rounded-3xl border border-[#00F3FF]/30 bg-[#0a192f]/80 backdrop-blur-xl shadow-[0_0_50px_rgba(0,243,255,0.15)]"
                >
                    {/* Holographic Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50 pointer-events-none" />
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#00F3FF]/20 rounded-full blur-3xl animate-pulse" />

                    {/* Header */}
                    <div className="bg-[#00F3FF]/10 p-6 border-b border-[#00F3FF]/20 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <img src={ASSETS.LOGO_WHITE_TEXT_TRANSPARENT} alt="Codekriti" className="h-8 w-auto" />
                            <span className="font-display font-bold text-[#00F3FF] tracking-widest text-lg border-l border-[#00F3FF]/30 pl-3">VOYAGE PASS</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
                            <span className="text-xs text-green-400 font-mono">ACCESS GRANTED</span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 space-y-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs text-blue-400 uppercase tracking-wider mb-1">Explorer ID</p>
                                <p className="font-mono text-xl text-white font-bold">{data.id}</p>
                            </div>
                            {/* Placeholder QR if library missing, else logic would be here */}
                            <div className="bg-white p-2 rounded-lg">
                                <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(data.qrPayload || JSON.stringify(data))}`}
                                    alt="QR"
                                    className="w-16 h-16"
                                    crossOrigin="anonymous"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="text-xs text-blue-400 uppercase tracking-wider mb-1">Mission (Event)</p>
                                <p className="font-display text-2xl text-[#00D9FF] uppercase">{data.event}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-blue-400 uppercase tracking-wider mb-1">Location</p>
                                    <p className="font-body text-white font-medium">PMEC Academic Block</p>
                                </div>
                                <div>
                                    <p className="text-xs text-blue-400 uppercase tracking-wider mb-1">Launch Date</p>
                                    <p className="font-mono text-white tracking-widest">{data.date}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-blue-400 uppercase tracking-wider mb-1">Captain</p>
                                    <p className="font-body text-white">{data.name}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-blue-400 uppercase tracking-wider mb-1">Squad</p>
                                    <p className="font-body text-white">{data.teamName}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Security Strip */}
                    <div className="h-2 w-full bg-gradient-to-r from-transparent via-[#00F3FF]/50 to-transparent opacity-50" />
                    <div className="p-4 bg-[#0a192f] border-t border-[#00F3FF]/20 flex justify-center">
                        <p className="text-[10px] text-blue-500/50 uppercase tracking-[0.5em]">SECURE TRANSMISSION // CODEKRITI 4.0</p>
                    </div>
                </div>
            </motion.div>

            {/* Actions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8 flex gap-4"
            >
                <button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#00F3FF] text-black font-bold hover:bg-[#00c2ff] transition-colors disabled:opacity-50"
                >
                    <Download size={18} /> {isDownloading ? 'Saving...' : 'Save Ticket'}
                </button>
                <button onClick={onClose} className="flex items-center gap-2 px-6 py-3 rounded-xl border border-[#00F3FF]/30 text-[#00F3FF] hover:bg-[#00F3FF]/10 transition-colors">
                    Close
                </button>
            </motion.div>
        </div>
    );
};

export default DigitalTicket;
