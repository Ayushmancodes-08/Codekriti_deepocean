import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Waves, ArrowLeft } from 'lucide-react';
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
import DigitalTicket from './DigitalTicket';

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

    const { handleSubmit, setValue, reset } = methods;

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
        const eventConfig = {
            'algotocode': 1,
            'designathon': 1,
            'techmaze': 3,
            'devxtreme': 4
        };
        return eventConfig[eventId as keyof typeof eventConfig] || 1;
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
                toast.success('Registration successful!');
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
                        className="w-full h-full md:h-[90vh] md:max-w-[95vw] lg:max-w-[1400px] relative flex flex-col bg-[#0a192f] md:rounded-2xl overflow-hidden shadow-2xl border border-[#00D9FF]/30"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Background Effects */}
                        <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute inset-0 opacity-20 bg-[url('/assets/rock-texture.jpg')] bg-cover mix-blend-overlay" />
                            <div className="absolute -top-[500px] -left-[500px] w-[1000px] h-[1000px] bg-[#00D9FF]/10 rounded-full blur-3xl opacity-30 animate-pulse" />
                        </div>

                        {ticketData ? (
                            <div className="h-full flex items-center justify-center p-4">
                                <DigitalTicket data={ticketData} onClose={handleClose} />
                            </div>
                        ) : (
                            <>
                                {/* Header */}
                                <div className="relative border-b border-[#00D9FF]/20 bg-[#0a192f]/90 backdrop-blur-md px-4 md:px-8 py-4 flex-shrink-0 z-10 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        {currentStep === 2 && (
                                            <button
                                                onClick={handleBackToSelection}
                                                className="p-2 rounded-full hover:bg-[#00D9FF]/10 text-[#00D9FF] transition-colors"
                                            >
                                                <ArrowLeft className="w-5 h-5" />
                                            </button>
                                        )}
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-blue-900/50 border border-blue-700/50 flex items-center justify-center">
                                                <Waves className="w-5 h-5 text-[#00D9FF]" />
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-bold bg-gradient-to-r from-[#00D9FF] via-cyan-300 to-blue-400 bg-clip-text text-transparent">
                                                    Deep Dive Registration
                                                </h2>
                                                {selectedEvent && (
                                                    <p className="text-[#00D9FF]/60 text-xs flex items-center gap-2">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-[#00D9FF] inline-block" />
                                                        {EVENTS.find(e => e.id === selectedEvent)?.name}
                                                        {isSolo ? ' (Solo)' : ` (Team of ${squadSize})`}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleClose}
                                        className="text-[#00D9FF]/70 hover:text-white p-2 transition-colors"
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
                                                <div className="h-full flex flex-col lg:grid lg:grid-cols-12 gap-6 p-4 md:p-6 overflow-y-auto lg:overflow-hidden">

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
                                                                handleSubmit((data) => processRegistration(data, fileData))(); // Pass fileData explicitly
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
