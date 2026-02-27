import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import nodemailer from 'npm:nodemailer@6.9.7';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '', // Use service-role key for admin actions
            { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
        );

        // Verify admin user
        const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
        if (userError || !user) throw new Error('Unauthorized');

        const { registrationId, action } = await req.json();

        if (!registrationId || !['Success', 'Rejected'].includes(action)) {
            throw new Error('Invalid payload');
        }

        // Update registration status
        const { data: registration, error: updateError } = await supabaseClient
            .from('registrations')
            .update({ status: action })
            .eq('id', registrationId)
            .select()
            .single();

        if (updateError) throw updateError;

        // Trigger email if Approved
        if (action === 'Success' && registration.email) {
            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: Deno.env.get('EMAIL_USER'),
                    pass: Deno.env.get('EMAIL_PASSWORD'),
                },
            });

            const mailOptions = {
                from: `"CodeKriti 4.0" <${Deno.env.get('EMAIL_USER')}>`,
                to: registration.email,
                subject: `Registration Approved - ${registration.event}`,
                html: `
          <h2>Registration Approved!</h2>
          <p>Hi ${registration.team_name || registration.leader_name},</p>
          <p>Your payment for ${registration.event} has been verified and your registration is now approved.</p>
          <p>Get ready for CodeKriti 4.0!</p>
        `,
            };

            await transporter.sendMail(mailOptions);
        }

        return new Response(JSON.stringify({ success: true, data: registration }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        });
    }
});
