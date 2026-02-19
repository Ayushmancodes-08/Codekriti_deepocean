
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Client
const SUPABASE_URL = 'https://iorulrnihsjouawhvcyt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvcnVscm5paHNqb3Vhd2h2Y3l0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwODQ3MTMsImV4cCI6MjA4NjY2MDcxM30.JmSmWlS3_xESGBc34SS0SIyLkLvJRMOZABWFwUXUkjs';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


export interface RegistrationData {
    teamName: string;
    leaderName: string;
    email: string;
    phone: string;
    members: { name: string, [key: string]: any }[]; // Updated to accept objects based on frontend data
    year: string;
    branch: string;
    college?: string;
    event: string;
    subscribe: boolean;
    transactionId?: string; // Standardize
    file?: File; // For direct upload
    problemStatement?: string;
    solution?: string;
}

interface RegistrationResponse {
    status: 'success' | 'error';
    message: string;
    id?: string;
    qrData?: string;
}

// 1. Storage Upload Helper
export const uploadScreenshot = async (file: File, path: string): Promise<string | null> => {
    try {
        const { data, error } = await supabase.storage
            .from('payment-screenshots')
            .upload(path, file, {
                cacheControl: '3600',
                upsert: false // Don't overwrite, fail if exists (unique paths expected)
            });

        if (error) {
            console.error("Storage upload error:", error);
            throw error;
        }

        // Get Public URL
        const { data: { publicUrl } } = supabase.storage
            .from('payment-screenshots')
            .getPublicUrl(path);

        return publicUrl;
    } catch (e) {
        console.error("Upload failed", e);
        return null;
    }
}

// 2. Updated Registration Submission
export const submitRegistration = async (data: RegistrationData, screenshotUrl?: string): Promise<RegistrationResponse> => {
    try {
        console.log("Submitting to Supabase...", data);

        const { data: result, error } = await supabase.functions.invoke('register-team', {
            body: {
                action: 'REGISTER',
                payload: {
                    ...data,
                    utr: data.transactionId, // Map to what backend expects
                    screenshot_url: screenshotUrl
                }
            }
        });

        if (error) throw error;

        return result;

    } catch (error: any) {
        console.error("Supabase Registration Error", error);
        return {
            status: 'error',
            message: error.message || "Failed to register via Supabase."
        };
    }
};


// Legacy support or new implementation for newsletter
// Newsletter Subscription
export const subscribeNewsletter = async (email: string) => {
    try {
        const { error } = await supabase
            .from('subscribers')
            .insert([{ email }]);

        if (error) {
            if (error.code === '23505') { // Unique violation
                return { status: 'success', message: 'You are already subscribed!' };
            }
            throw error;
        }

        return { status: 'success', message: 'Thanks for subscribing!' };
    } catch (error: any) {
        console.error("Newsletter Error", error);
        return { status: 'error', message: "Failed to subscribe via Supabase." };
    }
};
