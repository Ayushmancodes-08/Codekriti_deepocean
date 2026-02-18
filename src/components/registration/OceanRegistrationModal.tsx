import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Waves, ArrowLeft, CheckCircle2, PartyPopper } from 'lucide-react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { registrationSchema, EVENTS, type RegistrationFormData } from '@/types/registration';
import EventSelectionStep from './ocean-steps/EventSelectionStep';
import SoloDetailsStep from './ocean-steps/SoloDetailsStep';
import TeamInfoStep from './ocean-steps/TeamInfoStep';
import TeamMembersStep from './ocean-steps/TeamMembersStep';
import RegistrationSummary from './ocean-steps/RegistrationSummary';
import PaymentUploadStep from './ocean-steps/PaymentUploadStep';
import { submitRegistration, uploadScreenshot } from '@/utils/supabaseClient'; // Updated Import

interface OceanRegistrationModalProps {
    isOpen: boolean;
    onClose: () => void;
    preSelectedEventId?: string | null;
}

const OceanRegistrationModal = ({ isOpen, onClose, preSelectedEventId }: OceanRegistrationModalProps) => {
    // Stage 1: Selection, Stage 2: Registration Dashboard
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
    const [squadSize, setSquadSize] = useState<number>(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [ticketData, setTicketData] = useState<any>(null);
    const [uploadedFile, setUploadedFile] = useState<{ base64: string, mimeType: string, fileName: string, fileObject?: File } | null>(null); // Added fileObject

    // Helper to close and reset state
    const handleClose = () => {
        setTicketData(null);
        setUploadedFile(null); // Reset file
        setCurrentStep(1);
        setSelectedEvent(null);
        onClose();
    };

    const isSolo = squadSize === 1;

    const methods = useForm<RegistrationFormData>({
        resolver: zodResolver(registrationSchema),
        mode: 'onChange', // Real-time validation for the dashboard
        defaultValues: {
            teamMembers: [],
            registrationType: 'team'
        }
    });

    const { handleSubmit, setValue, reset, watch } = methods;
    const watchedSquadSize = watch('squadSize');

    // Keep local squadSize in sync with form for layout logic
    useEffect(() => {
        if (watchedSquadSize && watchedSquadSize !== squadSize) {
            setSquadSize(watchedSquadSize);

            // Trim teamMembers array if squadSize is reduced
            // This ensures data integrity if leader changes squad from e.g. 5 to 4
            const currentMembers = methods.getValues('teamMembers') || [];
            const requiredExtraMembers = watchedSquadSize - 1;
            if (currentMembers.length > requiredExtraMembers) {
                setValue('teamMembers', currentMembers.slice(0, requiredExtraMembers));
            }
        }
    }, [watchedSquadSize, squadSize, setValue]);

    // Handle pre-selected event
    useEffect(() => {
        if (preSelectedEventId && isOpen) {
            handleEventSelection(preSelectedEventId, getEventSize(preSelectedEventId));
        }
    }, [preSelectedEventId, isOpen]);

    // Body scroll lock — Lenis is handled via data-lenis-prevent on the modal element
    useEffect(() => {
        if (isOpen) {
            document.documentElement.style.overflow = 'hidden';
            document.body.style.overflow = 'hidden';
            document.body.classList.add('modal-open');
        } else {
            document.documentElement.style.overflow = '';
            document.body.style.overflow = '';
            document.body.classList.remove('modal-open');
        }
        return () => {
            document.documentElement.style.overflow = '';
            document.body.style.overflow = '';
            document.body.classList.remove('modal-open');
        };
    }, [isOpen]);

    const getEventSize = (eventId: string) => {
        const event = EVENTS.find(e => e.id === eventId);
        return event?.minTeamSize || 1;
    };

    const handleEventSelection = (eventId: string, size: number) => {
        setSelectedEvent(eventId);
        setSquadSize(size);
        setValue('eventId', eventId);
        setValue('squadSize', size as any);
        setValue('registrationType', size === 1 ? 'solo' : 'team');

        // Reset form when changing events to avoid stale data
        if (currentStep === 1) {
            // Keep eventId and basic config, reset user input
            reset({
                eventId,
                squadSize: size as any,
                registrationType: size === 1 ? 'solo' : 'team',
                teamMembers: []
            } as any);
            setCurrentStep(2);
        }
    };

    const handleBackToSelection = () => {
        setCurrentStep(1);
        setSelectedEvent(null);
    };

    // Unified submission logic
    const processRegistration = async (data: RegistrationFormData, fileDataOverride?: { base64: string, mimeType: string, fileName: string, fileObject?: File }) => {
        setIsSubmitting(true);
        try {
            // Get Event Name for Sheet/DB
            const eventConfig = EVENTS.find(e => e.id === data.eventId);
            const sheetEventName = eventConfig ? eventConfig.name : data.eventId;

            // Use passed fileData if available, otherwise fall back to state
            const finalFile = (fileDataOverride && 'base64' in fileDataOverride) ? fileDataOverride : uploadedFile;

            // 1. Upload Screenshot first if exists
            let screenshotUrl = '';
            if (finalFile && finalFile.fileObject) {
                // Generate unique path: event/teamName_timestamp.ext
                const cleanName = (data.registrationType === 'team' ? data.teamName : data.participant.name).replace(/[^a-zA-Z0-9]/g, '_');
                const timestamp = Date.now();
                const ext = finalFile.fileName.split('.').pop() || 'png';
                const path = `${data.eventId}/${cleanName}_${timestamp}.${ext}`;

                const url = await uploadScreenshot(finalFile.fileObject, path);
                if (url) screenshotUrl = url;
            } else if (finalFile && finalFile.base64) {
                // Fallback if we only have base64 (should be rare if direct upload is used, but for compatibility)
                // Convert base64 to File/Blob? For now, we optimized for fileObject in PaymentUploadStep
                // If PaymentUploadStep doesn't provide fileObject, we might need a utility.
                // Assuming PaymentUploadStep is updated to provide fileObject too.
                console.warn("Only base64 file data available, upload might fail if not handled.");
            }

            // Structure data for Supabase
            const dbData = {
                teamName: data.registrationType === 'team' ? data.teamName : 'Solo - ' + data.participant.name,
                leaderName: data.registrationType === 'team' ? data.teamLeader.name : data.participant.name,
                email: data.registrationType === 'team' ? data.teamLeader.email : data.participant.email,
                phone: data.registrationType === 'team' ? data.teamLeader.phone : data.participant.phone,
                members: data.registrationType === 'team' ? data.teamMembers.map(m => ({
                    name: m.name,
                    email: m.email,
                    phone: m.phone,
                    college: m.college,
                    branch: m.branch,
                    year: m.yearOfStudy
                })) : [],
                year: data.registrationType === 'team' ? data.teamLeader.yearOfStudy : data.participant.yearOfStudy,
                branch: data.registrationType === 'team' ? data.teamLeader.branch : data.participant.branch,
                college: data.registrationType === 'team' ? data.teamLeader.college : data.participant.college,
                event: sheetEventName,
                subscribe: !!data.subscribe,
                transactionId: data.transactionId
            };

            const response = await submitRegistration(dbData, screenshotUrl);

            if (response.status === 'success') {
                toast.success('Thank you for registering!!!', {
                    icon: <CheckCircle2 className="w-5 h-5 text-[#00D9FF]" />,
                    className: "bg-[#0a192f] border border-[#00D9FF]/30 text-white",
                    duration: 5000
                });
                setTicketData({
                    name: dbData.leaderName,
                    teamName: dbData.teamName,
                    event: dbData.event,
                    id: response.id || 'CK-2025',
                    qrPayload: response.qrData || 'CK-2025',
                    date: new Date().toLocaleDateString()
                });
            } else {
                throw new Error(response.message || 'Registration failed');
            }
        } catch (error: any) {
            console.error('Registration error:', error);
            toast.error(error.message || 'Registration failed.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const onSubmit = (data: RegistrationFormData) => processRegistration(data);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    data-lenis-prevent
                    className="fixed inset-0 bg-black/95 backdrop-blur-md z-[99999] isolate flex items-center justify-center p-0 md:p-4 overflow-hidden"
                    onClick={handleClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="w-full h-full md:h-[90vh] md:max-w-[95vw] lg:max-w-[1400px] relative flex flex-col bg-[#0a192f]/80 backdrop-blur-xl md:rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-[#00D9FF]/20"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Background Effects */}
                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                            <div className="absolute inset-0 opacity-10 bg-[url('/assets/rock-texture.jpg')] bg-cover mix-blend-overlay" />

                            {/* Animated Radial Glows */}
                            <motion.div
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.15, 0.25, 0.15]
                                }}
                                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-[#00D9FF]/20 rounded-full blur-[120px]"
                            />
                            <motion.div
                                animate={{
                                    scale: [1.2, 1, 1.2],
                                    opacity: [0.1, 0.2, 0.1]
                                }}
                                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -bottom-[10%] -right-[5%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[100px]"
                            />

                            {/* Scanning Light Effect */}
                            <motion.div
                                animate={{ y: ['-100%', '200%'] }}
                                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#00D9FF]/10 to-transparent top-0 opacity-30"
                            />
                        </div>

                        {ticketData ? (
                            <div className="h-full flex items-center justify-center p-4">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="max-w-md w-full bg-[#1A1A2E]/80 backdrop-blur-2xl border border-[#00D9FF]/30 rounded-[2.5rem] p-10 text-center relative overflow-hidden shadow-[0_0_100px_rgba(0,217,255,0.15)]"
                                >
                                    {/* Success Background Glow */}
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-[#00D9FF]/20 rounded-full blur-[80px] pointer-events-none" />

                                    <div className="relative z-10 space-y-8">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                                            className="w-24 h-24 bg-gradient-to-br from-[#00D9FF] to-blue-600 rounded-full flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(0,217,255,0.4)]"
                                        >
                                            <CheckCircle2 className="w-12 h-12 text-[#0a192f]" />
                                        </motion.div>

                                        <div className="space-y-4">
                                            <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-none italic">
                                                Thank You For <br />
                                                <span className="text-[#00D9FF] bg-clip-text">Registering!!!</span>
                                            </h2>
                                            <div className="h-1 w-20 bg-gradient-to-r from-transparent via-[#00D9FF] to-transparent mx-auto opacity-50" />
                                            <p className="text-gray-400 text-sm font-medium leading-relaxed max-w-[280px] mx-auto">
                                                Your operative profile has been synchronized. The digital pass will be sent to your email after verification.
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-1 gap-4 pt-4">
                                            <div className="flex items-center justify-center gap-2 p-3 bg-white/5 rounded-2xl border border-white/10 text-[10px] font-bold text-[#00D9FF]/80 uppercase tracking-widest">
                                                <PartyPopper className="w-4 h-4" />
                                                MISSION ASSIGNMENT PENDING
                                            </div>

                                            <button
                                                onClick={handleClose}
                                                className="group relative w-full py-4 bg-transparent border-2 border-[#00D9FF] text-[#00D9FF] font-black uppercase tracking-[0.3em] text-xs rounded-2xl hover:bg-[#00D9FF] hover:text-[#0a192f] transition-all duration-300 overflow-hidden"
                                            >
                                                <span className="relative z-10">Return to Surface</span>
                                                <div className="absolute inset-x-0 bottom-0 h-0 bg-white group-hover:h-full transition-all duration-300 opacity-10" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Grain Texture Over Surface */}
                                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-0 invert" />
                                </motion.div>
                            </div>
                        ) : (
                            <>
                                {/* Header */}
                                <div className="relative border-b border-[#00D9FF]/10 bg-[#0a192f]/40 backdrop-blur-md px-4 md:px-8 py-4 flex-shrink-0 z-10 flex items-center justify-between shadow-[0_1px_15px_rgba(0,217,255,0.05)]">
                                    <div className="flex items-center gap-4">
                                        {currentStep > 1 && (
                                            <button
                                                onClick={() => {
                                                    if (currentStep === 3) {
                                                        setCurrentStep(2);
                                                    } else {
                                                        handleBackToSelection();
                                                    }
                                                }}
                                                className="p-2 rounded-full hover:bg-[#00D9FF]/10 text-[#00D9FF] transition-all border border-transparent hover:border-[#00D9FF]/20"
                                            >
                                                <ArrowLeft className="w-5 h-5" />
                                            </button>
                                        )}
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-900/50 to-black/50 border border-[#00D9FF]/30 flex items-center justify-center shadow-[0_0_15px_rgba(0,217,255,0.2)]">
                                                <Waves className="w-5 h-5 text-[#00D9FF] animate-pulse" />
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-bold bg-gradient-to-r from-[#00D9FF] via-cyan-200 to-blue-400 bg-clip-text text-transparent tracking-tight">
                                                    Deep Dive Registration
                                                </h2>
                                                {selectedEvent && (
                                                    <p className="text-[#00D9FF]/60 text-[10px] uppercase font-bold tracking-[0.1em] flex items-center gap-2">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-[#00D9FF] shadow-[0_0_5px_#00D9FF] inline-block animate-pulse" />
                                                        {EVENTS.find(e => e.id === selectedEvent)?.name}
                                                        <span className="opacity-40">|</span>
                                                        {isSolo ? 'SOLO ACCESS' : `SQUAD OF ${squadSize}`}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleClose}
                                        className="text-[#00D9FF]/50 hover:text-white p-2 transition-all hover:rotate-90"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                {/* Main Content Area */}
                                <div className="flex-grow overflow-hidden relative z-0">
                                    <FormProvider {...methods}>
                                        <form onSubmit={handleSubmit(onSubmit)} className="h-full">
                                            {currentStep === 1 && (
                                                <div className="h-full overflow-y-auto custom-scrollbar p-4 md:p-8">
                                                    <EventSelectionStep
                                                        selectedEvent={selectedEvent}
                                                        squadSize={squadSize}
                                                        onSelect={handleEventSelection}
                                                    />
                                                </div>
                                            )}

                                            {currentStep === 2 && (
                                                /* Unified Dashboard Layout */
                                                <div className="h-full flex flex-col lg:grid lg:grid-cols-12 gap-4 p-4 md:p-6 overflow-y-auto lg:overflow-hidden">

                                                    {/* Left Column: Team/Leader Info */}
                                                    <div className="lg:col-span-4 lg:h-full lg:overflow-y-auto custom-scrollbar pr-2 space-y-6">
                                                        {isSolo ? (
                                                            <SoloDetailsStep />
                                                        ) : (
                                                            <TeamInfoStep />
                                                        )}
                                                    </div>

                                                    {/* Middle Column: Team Members (Hidden for Solo) */}
                                                    <div className={`${isSolo ? 'hidden' : 'lg:col-span-5'} lg:h-full flex flex-col min-h-[400px]`}>
                                                        {!isSolo && <TeamMembersStep squadSize={squadSize} />}
                                                    </div>

                                                    {/* Right Column: Live Summary & Submit */}
                                                    <div className={`${isSolo ? 'lg:col-span-8 lg:grid lg:grid-cols-2 lg:gap-8' : 'lg:col-span-3'} lg:h-full`}>
                                                        {isSolo && <div className="hidden lg:block border-l border-[#00D9FF]/20" />} {/* Spacer for solo layout */}
                                                        <div className="h-full">
                                                            <RegistrationSummary
                                                                isSubmitting={isSubmitting}
                                                                onSubmit={() => setCurrentStep(3)} // Proceed to Payment
                                                                eventName={EVENTS.find(e => e.id === selectedEvent)?.name || ''}
                                                                buttonText="Proceed to Pay"
                                                            />
                                                        </div>
                                                    </div>

                                                </div>
                                            )}

                                            {currentStep === 3 && (
                                                <div className="h-full flex items-center justify-center p-4">
                                                    <div className="w-full max-w-4xl">
                                                        <PaymentUploadStep
                                                            amount={(() => {
                                                                const values = methods.watch();
                                                                const evt = EVENTS.find(e => e.id === values.eventId);
                                                                if (values.eventId === 'devxtreme') {
                                                                    const college = values.registrationType === 'team'
                                                                        ? values.teamLeader?.college
                                                                        : values.participant?.college;
                                                                    const normalized = (college || '').toLowerCase().trim();
                                                                    if (normalized.includes('pmec') || normalized.includes('parala maharaja')) {
                                                                        return '₹400';
                                                                    }
                                                                    return '₹500';
                                                                }
                                                                return evt?.entryFee || 'Free';
                                                            })()}
                                                            isUploading={isSubmitting}
                                                            onPaymentComplete={(txnId, fileData) => {
                                                                setValue('transactionId', txnId);
                                                                setUploadedFile(fileData); // Keep state sync
                                                                handleSubmit(
                                                                    (data) => processRegistration(data, fileData),
                                                                    (errors) => {
                                                                        console.error("Registration Validation Errors:", errors);
                                                                        toast.error("Please check your details. Some fields are invalid or missing.", {
                                                                            description: "Go back to step 1 to fix errors."
                                                                        });
                                                                    }
                                                                )();
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </form>
                                    </FormProvider>
                                </div>
                            </>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default OceanRegistrationModal;
