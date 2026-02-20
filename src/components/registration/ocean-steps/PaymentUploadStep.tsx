import { useState } from 'react';
import { Upload, CheckCircle } from 'lucide-react';
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
            <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold text-white">Payment Verification</h3>
                <p className="text-gray-400 max-w-md mx-auto text-sm">
                    Scan the QR code to pay <span className="text-cyan-400 font-bold text-lg">₹{amount}</span>
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-start">
                {/* QR Code Section */}
                <div className="flex flex-col items-center space-y-4 p-6 bg-[#0a192f] border border-cyan-500/30 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.1)]">
                    <div className="bg-white p-4 rounded-xl shadow-lg">
                        <QRCode
                            value={`upi://pay?pa=${UPI_ID}&pn=Codekriti&am=${amount}&cu=INR`}
                            size={200}
                            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                            viewBox={`0 0 256 256`}
                        />
                    </div>
                    <div className="text-center space-y-1">
                        <p className="text-xs text-cyan-400 font-mono tracking-wider break-all">{UPI_ID}</p>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest">Scan with any UPI App</p>
                    </div>
                </div>

                {/* Verification Form */}
                <div className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Transaction ID (UTR)</label>
                            <input
                                type="text"
                                value={txnId}
                                onChange={(e) => setTxnId(e.target.value)}
                                placeholder="Enter 12-digit UTR number"
                                className="w-full px-4 py-3 bg-[#112240] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Upload Payment Screenshot</label>
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
                                    className={`w-full h-40 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-3 transition-all duration-300
                                        ${previewUrl
                                            ? 'border-cyan-500 bg-cyan-500/5 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                                            : 'border-gray-700 hover:border-cyan-500/50 bg-[#112240] hover:bg-[#112240]/80'
                                        }
                                    `}
                                >
                                    {previewUrl ? (
                                        <div className="relative w-full h-full p-2">
                                            <img src={previewUrl} alt="Preview" className="w-full h-full object-contain rounded-lg" />
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg backdrop-blur-sm">
                                                <div className="flex flex-col items-center gap-2">
                                                    <Upload className="text-cyan-400" size={24} />
                                                    <span className="text-xs font-bold text-white uppercase tracking-wider">Change Image</span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="w-12 h-12 rounded-full bg-cyan-900/20 flex items-center justify-center border border-cyan-500/20 group-hover:scale-110 transition-transform">
                                                <Upload className="text-cyan-400" size={20} />
                                            </div>
                                            <div className="text-center">
                                                <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">Click to upload screenshot</span>
                                                <p className="text-xs text-gray-500 mt-1">Supports JPG, PNG (Max 5MB)</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleConfirm}
                        disabled={isUploading || !txnId || !file}
                        className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold rounded-lg shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 group transform active:scale-[0.98]"
                    >
                        {isUploading ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                <span>Processing Payment...</span>
                            </>
                        ) : (
                            <>
                                <CheckCircle size={18} className="group-hover:scale-110 transition-transform" />
                                <span>Verify & Submit</span>
                            </>
                        )}
                    </button>

                    <p className="text-xs text-center text-gray-500 px-4">
                        By submitting, you agree that the transaction details provided are accurate.
                    </p>
                </div>
            </div>
        </div>
    );
};

const Loader2 = ({ className }: { size?: number, className?: string }) => (
    <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className={className}
    >
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
    </motion.div>
);

export default PaymentUploadStep;
