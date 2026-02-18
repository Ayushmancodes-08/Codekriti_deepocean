import { useState } from 'react';
import { Upload, CheckCircle, Smartphone } from 'lucide-react';
import QRCode from "react-qr-code";
import { toast } from 'sonner';
import { motion } from 'framer-motion';

// REPLACE THIS WITH YOUR ACTUAL MERCHANT UPI ID
const UPI_ID = "8480496340@upi";

interface PaymentUploadStepProps {
    amount: string;
    onPaymentComplete: (txnId: string, fileData: { base64: string, mimeType: string, fileName: string, fileObject?: File }) => void;
    isUploading?: boolean;
}

const PaymentUploadStep = ({ amount, onPaymentComplete, isUploading = false }: PaymentUploadStepProps) => {
    const [txnId, setTxnId] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
                toast.error("File size must be less than 5MB");
                return;
            }
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
        }
    };

    const handleConfirm = () => {
        if (!txnId || !file) {
            toast.error("Please provide both Transaction ID and Screenshot.");
            return;
        }

        // Convert file to Base64
        const reader = new FileReader();
        reader.onload = (e) => {
            const base64String = e.target?.result as string;
            // Remove data URL prefix (e.g., "data:image/jpeg;base64,")
            const base64Content = base64String.split(',')[1];

            onPaymentComplete(txnId, {
                base64: base64Content,
                mimeType: file.type,
                fileName: file.name,
                fileObject: file // Pass raw file for Supabase Storage
            });
        };
        reader.onerror = () => {
            toast.error("Failed to process file.");
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center space-y-1.5">
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter">SECURE MULTIPASS</h3>
                <p className="text-[#00D9FF]/60 text-xs font-bold uppercase tracking-widest">Scan QR Protocol & Verify Sync</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-start">
                {/* QR Code Section */}
                <div className="relative group">
                    {/* Background glow for QR */}
                    <div className="absolute inset-0 bg-[#00D9FF]/5 blur-2xl rounded-full" />

                    <div className="relative bg-white/90 backdrop-blur-sm p-8 rounded-3xl flex flex-col items-center gap-6 shadow-[0_0_40px_rgba(0,217,255,0.15)] border border-white/20 transition-all group-hover:shadow-[0_0_50px_rgba(0,217,255,0.25)]">
                        <div className="text-center">
                            <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em] mb-3">Sync Any UPI Unit</p>
                            <div className="bg-[#0a192f] text-[#00D9FF] px-4 py-1.5 rounded-full font-black text-2xl shadow-[inset_0_0_10px_rgba(0,217,255,0.2)]">
                                {amount}
                            </div>
                        </div>

                        {/* High-tech QR Frame */}
                        <div className="relative p-3 bg-white rounded-2xl border-2 border-dashed border-[#00D9FF]/30 group-hover:border-[#00D9FF]/60 transition-colors">
                            <div className="w-48 h-48 bg-white flex items-center justify-center">
                                <QRCode
                                    value={`upi://pay?pa=${UPI_ID}&pn=Codekriti&am=${amount.replace(/[^0-9]/g, '')}&cu=INR`}
                                    size={256}
                                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                    viewBox={`0 0 256 256`}
                                />
                            </div>

                            {/* Scanning Line Animation */}
                            <motion.div
                                animate={{ top: ['0%', '100%', '0%'] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                className="absolute left-0 right-0 h-[2px] bg-[#00D9FF]/40 z-10"
                            />
                        </div>

                        <div className="flex items-center gap-3 text-gray-500 font-bold text-[10px] uppercase tracking-widest">
                            <Smartphone size={14} className="text-[#00D9FF]" />
                            <span>GPAY / PHONEPE / PAYTM</span>
                        </div>
                    </div>
                </div>

                {/* Verification Form */}
                <div className="space-y-6 bg-gradient-to-b from-[#1A1A2E]/60 to-[#0a192f]/60 p-8 rounded-3xl border border-[#00D9FF]/10 backdrop-blur-md">
                    <div className="space-y-5">
                        <div className="space-y-2 group">
                            <label className="text-[10px] font-black text-[#00D9FF]/60 uppercase tracking-[0.2em] ml-1 group-focus-within:text-[#00D9FF]">Transaction Hash (UTR)</label>
                            <input
                                type="text"
                                value={txnId}
                                onChange={(e) => setTxnId(e.target.value)}
                                placeholder="Enter 12-digit UTR"
                                className="w-full px-5 py-4 bg-[#0a192f]/80 border border-[#00D9FF]/20 rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:border-[#00D9FF] focus:shadow-[0_0_20px_rgba(0,217,255,0.1)] transition-all font-mono tracking-widest"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-[#00D9FF]/60 uppercase tracking-[0.2em] ml-1">Evidence Captured</label>
                            <div className="relative group cursor-pointer">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="screenshot-upload"
                                />
                                <div
                                    onClick={() => document.getElementById('screenshot-upload')?.click()}
                                    className={`w-full h-36 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-3 transition-all duration-300
                                        ${previewUrl ? 'border-[#00D9FF] bg-[#00D9FF]/5 shadow-[0_0_30px_rgba(0,217,255,0.1)]' : 'border-[#00D9FF]/10 hover:border-[#00D9FF]/30 bg-[#0a192f]/40 hover:bg-[#0a192f]/60'}
                                    `}
                                >
                                    {previewUrl ? (
                                        <div className="absolute inset-0 p-3">
                                            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl backdrop-blur-sm">
                                                <div className="flex flex-col items-center gap-2">
                                                    <Upload className="text-[#00D9FF]" />
                                                    <span className="text-[10px] font-black text-white uppercase tracking-widest text-center">Replace Evidence</span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="w-12 h-12 rounded-xl bg-[#00D9FF]/5 flex items-center justify-center border border-[#00D9FF]/10 group-hover:scale-110 transition-transform">
                                                <Upload className="text-[#00D9FF]/50 group-hover:text-[#00D9FF] transition-colors" />
                                            </div>
                                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest group-hover:text-gray-400">Capture Screenshot</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleConfirm}
                        disabled={isUploading || !txnId || !file}
                        className="w-full py-5 bg-[#00D9FF] text-[#0a192f] font-black uppercase tracking-[0.3em] text-xs rounded-2xl shadow-[0_0_30px_rgba(0,217,255,0.3)] hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(0,217,255,0.5)] disabled:opacity-20 disabled:hover:scale-100 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 group"
                    >
                        {isUploading ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                <span>SYNCING...</span>
                            </>
                        ) : (
                            <>
                                <CheckCircle size={18} className="group-hover:scale-110 transition-transform" />
                                <span>VERIFY & REGISTER</span>
                            </>
                        )}
                    </button>

                    <div className="flex items-start gap-2 p-3 bg-blue-500/5 rounded-xl border border-blue-500/10">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1 animate-pulse" />
                        <p className="text-[9px] font-bold text-blue-400/80 uppercase leading-relaxed tracking-wider">
                            Sync verification may take up to 24 Earth Hours. Digital Pass will be dispatched via Encrypted Comms.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Loader2 = ({ size, className }: { size: number, className?: string }) => (
    <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className={className}
    >
        <CheckCircle size={size} className="opacity-50" />
    </motion.div>
);

export default PaymentUploadStep;
