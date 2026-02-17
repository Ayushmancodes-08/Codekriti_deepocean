import { useState } from 'react';
import { Upload, CheckCircle, Smartphone } from 'lucide-react';
import QRCode from "react-qr-code";
import { toast } from 'sonner';

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
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold text-white">Secure Payment</h3>
                <p className="text-blue-400">Scan QR to Pay & Upload Proof</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-start">
                {/* QR Code Section */}
                <div className="bg-white p-6 rounded-2xl flex flex-col items-center gap-4 shadow-[0_0_30px_rgba(0,243,255,0.1)]">
                    <div className="text-center">
                        <p className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">Scan with any UPI App</p>
                        <p className="font-bold text-3xl text-gray-900">{amount}</p>
                    </div>
                    {/* Real-time QR Code Generation */}
                    <div className="relative w-48 h-48 bg-white rounded-xl overflow-hidden flex items-center justify-center p-2 border-2 border-dashed border-gray-300">
                        <QRCode
                            value={`upi://pay?pa=${UPI_ID}&pn=Codekriti&am=${amount.replace(/[^0-9]/g, '')}&cu=INR`}
                            size={256}
                            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                            viewBox={`0 0 256 256`}
                        />
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <Smartphone size={16} />
                        <span>GPay / PhonePe / Paytm</span>
                    </div>
                </div>

                {/* Verification Form */}
                <div className="space-y-6 bg-[#0a192f]/50 p-6 rounded-2xl border border-[#00F3FF]/10">
                    <div className="space-y-4">
                        <label className="block space-y-2">
                            <span className="text-sm font-medium text-gray-300">Transaction ID (UTR)</span>
                            <input
                                type="text"
                                value={txnId}
                                onChange={(e) => setTxnId(e.target.value)}
                                placeholder="e.g. 4058291..."
                                className="w-full px-4 py-3 bg-[#0a192f] border border-[#00F3FF]/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#00F3FF]/50 transition-colors"
                            />
                        </label>

                        <label className="block space-y-2">
                            <span className="text-sm font-medium text-gray-300">Payment Screenshot</span>
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
                                    className={`w-full h-32 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 transition-all
                                        ${previewUrl ? 'border-[#00F3FF] bg-[#00F3FF]/5' : 'border-[#00F3FF]/20 hover:border-[#00F3FF]/40 bg-[#0a192f]'}
                                    `}
                                >
                                    {previewUrl ? (
                                        <div className="absolute inset-0 p-2">
                                            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                                                <Upload className="text-white" />
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <Upload className="text-[#00F3FF]/50" />
                                            <span className="text-xs text-gray-400">Click to upload screenshot</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </label>
                    </div>

                    <button
                        onClick={handleConfirm}
                        disabled={isUploading || !txnId || !file}
                        className="w-full py-4 bg-gradient-to-r from-[#00F3FF] to-[#00A3FF] text-black font-bold rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                    >
                        {isUploading ? (
                            <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        ) : (
                            <>
                                <CheckCircle size={20} />
                                Verify & Register
                            </>
                        )}
                    </button>
                    <p className="text-xs text-center text-gray-500">
                        * Verification may take up to 24 hours. You will receive an email confirmation.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PaymentUploadStep;
