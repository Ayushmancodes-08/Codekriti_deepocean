const SUPABASE_URL = 'https://iorulrnihsjouawhvcyt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvcnVscm5paHNqb3Vhd2h2Y3l0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwODQ3MTMsImV4cCI6MjA4NjY2MDcxM30.JmSmWlS3_xESGBc34SS0SIyLkLvJRMOZABWFwUXUkjs';

async function testEdgeFunction(event) {
    const payload = {
        action: 'REGISTER',
        payload: {
            teamName: 'Test Team ' + Math.floor(Math.random() * 1000),
            leaderName: 'Test Leader',
            email: 'patraayushman21@gmail.com', // Sending to the user's explicit email from earlier
            phone: '1234567890',
            members: [],
            college: 'Test College',
            event: event,
            utr: 'TEST123456789',
            screenshot_url: 'https://test.com/screenshot.png'
        }
    };

    try {
        const response = await fetch(`${SUPABASE_URL}/functions/v1/register-team`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        console.log(`Response for ${event}:`, data);
    } catch (error) {
        console.error(`Error testing ${event}:`, error);
    }
}

async function runAll() {
    await testEdgeFunction('Algo to Code');
    await testEdgeFunction('Designathon');
}

runAll();
