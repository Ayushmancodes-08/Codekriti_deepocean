/**
 * Utility to communicate with the Google Apps Script Backend
 */

// Replace this with your deployed Web App URL
// You can also put this in .env as VITE_GOOGLE_SCRIPT_URL
const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL || "https://script.google.com/macros/s/AKfycbxVLejaPLeChiBU1WjVwSks4x9Z5N9Ps7syoBg4cej2YkJjnAnr9Sf4BguJoc7E17VH/exec"

export interface RegistrationData {
    teamName: string;
    leaderName: string;
    email: string;
    phone: string;
    members: string[];
    year: string;
    branch: string;
    college?: string;
    event: string;
    subscribe: boolean;
}

interface AppsScriptResponse {
    status: 'success' | 'error';
    message: string;
    id?: string;
    qrData?: string;
}

export const submitRegistration = async (data: RegistrationData): Promise<AppsScriptResponse> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            redirect: "follow",
            headers: {
                "Content-Type": "text/plain;charset=utf-8",
            },
            body: JSON.stringify({
                action: 'REGISTER',
                payload: data
            }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);
        const result = await response.json();
        return result;

    } catch (error: any) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            console.warn("Request timed out");
            // Return a "pending" success so UI can still show the ticket
            return {
                status: 'success',
                message: 'Registration submitted (confirmation pending)',
                id: `CK-${Math.floor(100000 + Math.random() * 900000)}`
            };
        }
        console.error("Submission Error", error);
        throw new Error("Failed to connect to registration server.");
    }
};

export const subscribeNewsletter = async (email: string) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            redirect: "follow",
            headers: {
                "Content-Type": "text/plain;charset=utf-8",
            },
            body: JSON.stringify({
                action: 'NEWSLETTER',
                email: email
            }),
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        return await response.json();
    } catch (error: any) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            return { status: 'success', message: 'Subscription submitted' };
        }
        throw error;
    }
};

export const testConnection = async () => {
    try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            redirect: "follow",
            headers: {
                "Content-Type": "text/plain;charset=utf-8",
            },
            body: JSON.stringify({
                action: 'DRY_RUN'
            })
        });
        return await response.json();
    } catch (e) {
        console.error("Connection Failed", e);
        return { status: 'error', message: 'Connection Failed' };
    }
};

export const broadcastMessage = async (subject: string, message: string, password: string) => {
    return fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        redirect: "follow",
        headers: {
            "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify({
            action: 'BROADCAST',
            subject,
            message,
            password
        })
    }).then(res => res.json());
};

