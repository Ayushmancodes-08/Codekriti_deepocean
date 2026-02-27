// Vercel Serverless Function — Proxy to Supabase Auth API
// This runs on Vercel's servers (which have unrestricted internet).
// The user's browser calls codekriti.tech/api/adminAuthProxy → Vercel → Supabase Auth.
// This completely bypasses any local PC firewall/ISP/antivirus blocks for the Admin Dashboard.

import type { VercelRequest, VercelResponse } from '@vercel/node';

const SUPABASE_URL = 'https://iorulrnihsjouawhvcyt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvcnVscm5paHNqb3Vhd2h2Y3l0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwODQ3MTMsImV4cCI6MjA4NjY2MDcxM30.JmSmWlS3_xESGBc34SS0SIyLkLvJRMOZABWFwUXUkjs';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Handle CORS preflight
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-client-info, apikey');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const targetPath = req.query.path as string || '';
        if (!targetPath) {
            return res.status(400).json({ error: 'Missing proxy path' });
        }

        // Construct the full Supabase URL
        const url = new URL(`${SUPABASE_URL}/${targetPath}`);

        // Forward any query parameters from the original request
        for (const [key, value] of Object.entries(req.query)) {
            if (key !== 'path') url.searchParams.append(key, value as string);
        }

        // Forward the request to Supabase
        const headers: Record<string, string> = {
            'apikey': SUPABASE_ANON_KEY,
        };

        if (req.headers.authorization) headers['Authorization'] = req.headers.authorization;
        if (req.headers['x-client-info']) headers['x-client-info'] = req.headers['x-client-info'] as string;
        if (req.headers['content-type']) headers['Content-Type'] = req.headers['content-type'];

        const response = await fetch(url.toString(), {
            method: req.method,
            headers,
            body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
        });

        const data = await response.text();

        // Return the response back to the client
        res.status(response.status);
        res.setHeader('Content-Type', response.headers.get('content-type') || 'application/json');

        try {
            return res.send(JSON.parse(data));
        } catch {
            return res.send(data);
        }

    } catch (error: any) {
        console.error('Auth Proxy Error:', error);
        return res.status(500).json({
            error: `Proxy failed: ${error.message}`,
        });
    }
}
