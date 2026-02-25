import type { VercelRequest, VercelResponse } from '@vercel/node';

const SUPABASE_URL = 'https://iorulrnihsjouawhvcyt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvcnVscm5paHNqb3Vhd2h2Y3l0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwODQ3MTMsImV4cCI6MjA4NjY2MDcxM30.JmSmWlS3_xESGBc34SS0SIyLkLvJRMOZABWFwUXUkjs';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Handle CORS preflight
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ status: 'error', message: 'Method not allowed' });
    }

    try {
        // Fetch all registrations from Supabase, order by created_at desc
        const response = await fetch(`${SUPABASE_URL}/rest/v1/registrations?select=*&order=created_at.desc`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Supabase returned ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        return res.status(200).json(data);

    } catch (error: any) {
        console.error('Vercel Admin Proxy Error (GET registrations):', error);
        return res.status(500).json({
            status: 'error',
            message: `Admin registrations proxy failed: ${error.message}`,
        });
    }
}
