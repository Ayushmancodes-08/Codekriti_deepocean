import { createClient } from "jsr:@supabase/supabase-js@2";
import nodemailer from "npm:nodemailer@6.9.13";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LOGO_URL = "https://codekriti.vercel.app/logo_bg.jpeg"; // Updated to Vercel deployment URL

Deno.serve(async (req: Request) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? ''
        );

        const body = await req.json() as { action: string, payload: any };
        const { action, payload } = body;

        // --- ACTION: REGISTER ---
        if (action === 'REGISTER') {
            const {
                teamName,
                leaderName,
                email,
                phone,
                members,
                college,
                event,
                utr,
                payment_screenshot_url,
                screenshot_url
            } = payload;

            const supabaseAdmin = createClient(
                Deno.env.get('SUPABASE_URL') ?? '',
                Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
            );

            const dbData = {
                event_id: event,
                team_name: teamName,
                leader_name: leaderName,
                email: email,
                phone: phone,
                college: college,
                members: members,
                status: 'pending',
                payment_txn_id: utr,
                payment_screenshot_url: screenshot_url || payment_screenshot_url,
                check_in_status: false
            };

            const { data: insertedData, error: dbError } = await supabaseAdmin
                .from('registrations')
                .insert([dbData])
                .select()
                .single();

            if (dbError) throw dbError;

            // Send "Pending" Email
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: Deno.env.get('SMTP_USER'),
                    pass: Deno.env.get('SMTP_PASS'),
                },
            });

            const mailOptions = {
                from: '"CodeKriti Team" <' + Deno.env.get('SMTP_USER') + '>',
                to: email,
                subject: `Registration Received: ${event} | CodeKriti`,
                html: `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0a192f; color: #e6f1ff; padding: 40px 20px;">
                        <div style="max-width: 600px; margin: auto; background-color: #112240; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                            
                            <!-- Header -->
                            <div style="background-color: #0a192f; padding: 30px; text-align: center; border-bottom: 1px solid #233554;">
                                <img src="${LOGO_URL}" alt="CodeKriti Logo" style="width: 80px; height: 80px; border-radius: 50%; border: 2px solid #64ffda; object-fit: cover;">
                                <h1 style="color: #ccd6f6; margin-top: 15px; font-size: 24px; letter-spacing: 1px;">CodeKriti</h1>
                            </div>

                            <!-- Body -->
                            <div style="padding: 40px 30px;">
                                <h2 style="color: #64ffda; margin-top: 0;">Registration Received!</h2>
                                <p style="font-size: 16px; line-height: 1.6; color: #8892b0;">
                                    Hi <strong>${leaderName}</strong>,
                                </p>
                                <p style="font-size: 16px; line-height: 1.6; color: #8892b0;">
                                    Thank you for registering for <strong>${event}</strong>. We have received your details and payment proof.
                                </p>
                                
                                <div style="background-color: #0a192f; border-left: 4px solid #64ffda; padding: 15px; margin: 25px 0; border-radius: 4px;">
                                    <p style="margin: 0; color: #ccd6f6; font-weight: bold;">Status: Pending Verification</p>
                                    <p style="margin: 5px 0 0; font-size: 14px; color: #8892b0;">Our team will verify your payment shortly.</p>
                                </div>

                                <p style="font-size: 16px; line-height: 1.6; color: #8892b0;">
                                    Once approved, you will receive another email with your **Official Ticket & QR Code**.
                                </p>

                                <div style="margin-top: 30px; border-top: 1px solid #233554; padding-top: 20px;">
                                    <p style="margin: 5px 0; color: #8892b0; font-size: 14px;"><strong>Team:</strong> ${teamName}</p>
                                    <p style="margin: 5px 0; color: #8892b0; font-size: 14px;"><strong>Transaction ID:</strong> ${utr}</p>
                                </div>
                            </div>

                            <!-- Footer -->
                            <div style="background-color: #0a192f; padding: 20px; text-align: center; font-size: 12px; color: #8892b0;">
                                <p>&copy; 2025 CodeKriti. All rights reserved.</p>
                            </div>
                        </div>
                    </div>
                `,
            };
            await transporter.sendMail(mailOptions);

            return new Response(
                JSON.stringify({ status: 'success', id: insertedData.id }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        // --- ACTION: APPROVE ---
        if (action === 'APPROVE') {
            const { id, email, event, leaderName, teamName, utr } = payload;
            const supabaseAdmin = createClient(
                Deno.env.get('SUPABASE_URL') ?? '',
                Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
            );

            // 1. Update Status
            const { error: updateError } = await supabaseAdmin
                .from('registrations')
                .update({ status: 'success' })
                .eq('id', id);

            if (updateError) throw updateError;

            // 2. Generate QR Code
            const qrPayload = {
                id: id,
                e: event,
                u: leaderName,
                m: email,
                s: "supa-secure",
                v: true
            };
            const qrString = JSON.stringify(qrPayload);
            const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrString)}&color=0a192f&bgcolor=64ffda`; // Custom colors for QR

            // 3. Send Confirmation Email
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: Deno.env.get('SMTP_USER'),
                    pass: Deno.env.get('SMTP_PASS'),
                },
            });

            const mailOptions = {
                from: '"CodeKriti Team" <' + Deno.env.get('SMTP_USER') + '>',
                to: email,
                subject: `🎟️ Ticket Confirmed: ${event} | CodeKriti`,
                html: `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #0a192f; margin: 0; padding: 20px 0;">
                        <!-- Outer Wrapper with subtle oceanic gradient -->
                        <div style="max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #0a192f 0%, #112240 100%); border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5); border: 1px solid #233554;">
                            
                            <!-- Header with Wave Effect (Simulated via gradient) -->
                            <div style="background: linear-gradient(180deg, #172a45 0%, #0a192f 100%); padding: 30px; text-align: center; border-bottom: 1px solid #233554;">
                                <img src="${LOGO_URL}" alt="CodeKriti Logo" style="width: 80px; height: 80px; border-radius: 50%; border: 2px solid #64ffda; object-fit: cover;">
                                <h1 style="color: #64ffda; margin-top: 15px; font-size: 28px; letter-spacing: 2px; text-transform: uppercase;">Ticket Confirmed</h1>
                            </div>

                            <!-- Body -->
                            <div style="padding: 40px 30px; text-align: center;">
                                <p style="font-size: 18px; color: #ccd6f6; margin-bottom: 30px;">
                                    Get ready, <strong>${leaderName}</strong>! Your spot for <strong>${event}</strong> is secured.
                                </p>
                                
                                <!-- Ticket Box: Oceanic Glow & Responsive QR -->
                                <div style="background: rgba(100, 255, 218, 0.05); padding: 30px; border-radius: 12px; display: inline-block; border: 1px solid #64ffda; box-shadow: 0 0 15px rgba(100, 255, 218, 0.1);">
                                    <div style="background: #ffffff; padding: 10px; border-radius: 8px; display: inline-block;">
                                        <img src="${qrImageUrl}" alt="Your Ticket QR" style="width: 100%; max-width: 250px; height: auto; display: block; margin: 0 auto;" />
                                    </div>
                                    <p style="margin-top: 15px; color: #64ffda; font-weight: bold; letter-spacing: 1px; word-break: break-all;">ID: ${id}</p>
                                </div>

                                <p style="font-size: 14px; color: #8892b0; margin-top: 30px;">
                                    Please present this QR code at the registration desk for check-in.
                                </p>
                            </div>

                            <!-- Event Details -->
                            <div style="background: rgba(23, 42, 69, 0.5); padding: 25px; border-top: 1px solid #233554;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 8px; color: #8892b0; font-size: 14px;">Event</td>
                                        <td style="padding: 8px; color: #ccd6f6; font-weight: bold; text-align: right;">${event}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px; color: #8892b0; font-size: 14px;">Team</td>
                                        <td style="padding: 8px; color: #ccd6f6; font-weight: bold; text-align: right;">${teamName}</td>
                                    </tr>
                                </table>
                            </div>

                            <!-- Footer -->
                            <div style="background-color: #020c1b; padding: 20px; text-align: center; font-size: 12px; color: #8892b0; border-top: 1px solid #112240;">
                                <p>See you at the event!</p>
                                <p>&copy; 2025 CodeKriti. All rights reserved.</p>
                            </div>
                        </div>
                    </div>
                `,
            };
            await transporter.sendMail(mailOptions);

            return new Response(
                JSON.stringify({ status: 'success', message: 'Approved and Email Sent' }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        // --- ACTION: REJECT ---
        if (action === 'REJECT') {
            const { id } = payload;
            const supabaseAdmin = createClient(
                Deno.env.get('SUPABASE_URL') ?? '',
                Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
            );

            const { error } = await supabaseAdmin
                .from('registrations')
                .update({ status: 'rejected' })
                .eq('id', id);

            if (error) throw error;

            return new Response(
                JSON.stringify({ status: 'success', message: 'Registration Rejected' }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        throw new Error('Invalid action');

    } catch (error: any) {
        console.error(error);
        return new Response(
            JSON.stringify({ status: 'error', message: error.message || 'Unknown error' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
    }
});
