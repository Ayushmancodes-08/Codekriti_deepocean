import { useState } from 'react';
import { Upload, CheckCircle, Hash, Smartphone, Loader2 } from 'lucide-react';
import QRCode from "react-qr-code";
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { OceanFormItem } from '@/components/ui/ocean-form';
import { cn } from '@/lib/utils';

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
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="text-center space-y-3">
                <h3 className="text-2xl font-black text-white italic tracking-tight italic">PAYMENT_VERIFICATION</h3>
                <div className="flex items-center justify-center gap-3">
                    <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-cyan-500/50" />
                    <p className="text-gray-400 text-sm font-medium tracking-wide">
                        Secure credit transfer: <span className="text-cyan-400 font-black text-xl ml-1">{amount}</span>
                    </p>
                    <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-cyan-500/50" />
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-10 items-start">
                {/* QR Code Section */}
                <div className="flex flex-col items-center space-y-6 p-8 bg-gradient-to-b from-[#0a192f] to-[#112240] border border-cyan-500/20 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group">
                    <div className="absolute inset-0 bg-cyan-500/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-cyan-500/10 rounded-full blur-[60px] pointer-events-none" />

                    <div className="bg-white p-6 rounded-3xl shadow-[0_0_40px_rgba(255,255,255,0.1)] relative z-10 transition-transform duration-500 group-hover:scale-[1.02]">
                        <QRCode
                            value={`upi://pay?pa=${UPI_ID}&pn=Codekriti&am=${amount}&cu=INR`}
                            size={180}
                            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                            viewBox={`0 0 256 256`}
                        />
                    </div>

                    <div className="text-center space-y-3 relative z-10">
                        <div className="flex items-center justify-center gap-2 bg-cyan-950/40 border border-cyan-500/20 px-4 py-2 rounded-xl">
                            <Smartphone className="w-4 h-4 text-cyan-400" />
                            <p className="text-xs text-cyan-400 font-mono font-black tracking-widest break-all">{UPI_ID}</p>
                        </div>
                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] flex items-center justify-center gap-2">
                            Use encrypted UPI channel
                        </p>
                    </div>
                </div>

                {/* Verification Form */}
                <div className="space-y-8">
                    <div className="space-y-6">
                        <OceanFormItem label="Transaction ID (UTR)" icon={Hash}>
                            <Input
                                type="text"
                                value={txnId}
                                onChange={(e) => setTxnId(e.target.value)}
                                placeholder="Enter 12-digit UTR number"
                                className="bg-transparent border-none focus-visible:ring-0 px-0 h-auto text-base font-mono tracking-widest text-white placeholder:text-gray-700"
                            />
                        </OceanFormItem>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-cyan-400/60 uppercase tracking-[0.2em] ml-1">Transmission Receipt</label>
                            <div className="relative group/upload cursor-pointer">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="screenshot-upload"
                                />
                                <div
                                    onClick={() => document.getElementById('screenshot-upload')?.click()}
                                    className={cn(
                                        "w-full h-48 border-2 border-dashed rounded-[1.5rem] flex flex-col items-center justify-center gap-4 transition-all duration-500 relative overflow-hidden shadow-inner",
                                        previewUrl
                                            ? "border-cyan-500/50 bg-cyan-500/10"
                                            : "border-gray-800 hover:border-cyan-500/40 bg-[#0a192f]/50 hover:bg-[#0a192f]/80"
                                    )}
                                >
                                    {previewUrl ? (
                                        <div className="relative w-full h-full p-3">
                                            <img src={previewUrl} alt="Preview" className="w-full h-full object-contain rounded-xl shadow-2xl" />
                                            <div className="absolute inset-0 bg-[#0a192f]/80 opacity-0 group-hover/upload:opacity-100 transition-all duration-300 flex items-center justify-center rounded-xl backdrop-blur-sm">
                                                <div className="flex flex-col items-center gap-3 transform translate-y-4 group-hover/upload:translate-y-0 transition-transform">
                                                    <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center border border-cyan-500/40 shadow-[0_0_20px_rgba(0,217,255,0.2)]">
                                                        <Upload className="text-cyan-400" size={20} />
                                                    </div>
                                                    <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Change Fragment</span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="w-14 h-14 rounded-full bg-cyan-950/30 flex items-center justify-center border border-cyan-500/20 group-hover/upload:scale-110 group-hover/upload:border-cyan-500/50 transition-all duration-500 shadow-inner">
                                                <Upload className="text-cyan-400/60" size={24} />
                                            </div>
                                            <div className="text-center px-4">
                                                <span className="text-xs font-black text-gray-500 group-hover/upload:text-cyan-400 transition-colors uppercase tracking-widest italic">Sync Payment Proof</span>
                                                <p className="text-[9px] text-gray-600 mt-2 font-bold uppercase tracking-tighter">Supports JPG, PNG (Max 5MB)</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Button
                            onClick={handleConfirm}
                            disabled={isUploading || !txnId || !file}
                            className={cn(
                                "w-full h-14 relative overflow-hidden rounded-2xl font-black uppercase tracking-[0.3em] text-xs transition-all duration-500 group shadow-[0_0_30px_rgba(0,0,0,0.3)]",
                                !isUploading && txnId && file
                                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_10px_30px_rgba(6,182,212,0.3)] hover:shadow-[0_15px_40px_rgba(6,182,212,0.5)] hover:scale-[1.02]"
                                    : "bg-gray-800 text-gray-600 opacity-30 grayscale"
                            )}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                            <div className="relative flex items-center justify-center gap-3">
                                {isUploading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin text-white" />
                                        <span className="italic">VERIFYING_CREDENTIALS...</span>
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle size={18} className="group-hover:scale-110 transition-transform duration-300" />
                                        <span className="italic">INITIATE_VALIDATION</span>
                                    </>
                                )}
                            </div>
                        </Button>

                        <p className="text-[9px] text-center text-gray-600 font-bold uppercase tracking-widest px-4 leading-relaxed">
                            System verification required for blockchain entry
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentUploadStep;
