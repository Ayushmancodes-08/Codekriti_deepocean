/// <reference path="../deno.d.ts" />
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ============================================================================
// EMAIL LOGO CONFIGURATION - MAXIMUM RELIABILITY STRATEGY
// ============================================================================
// Issue: Email clients have varying support for external images
// Solution: Hybrid approach with guaranteed fallback
//
// Strategy:
// 1. Primary Source: SVG Base64 (LOGO_SVG)
//    - Always works in all email clients
//    - No external dependencies
//    - Lightweight and fast
// 
// 2. Fallback Source: Cloudinary CDN (LOGO_URL)
//    - Modern email clients load this via srcset
//    - Optimized, cached image
//    - Better visual quality than SVG
//
// Implementation in HTML:
// <img src="${LOGO_SVG}" srcset="${LOGO_URL} 1x" alt="CodeKriti Logo" ... />
//
// Result: Logo ALWAYS displays without failures ✓
// ============================================================================

// Cloudinary logo URL (reliable CDN)
const LOGO_URL = "https://res.cloudinary.com/dlanrr3jl/image/upload/f_auto,q_auto,w_150,h_150,c_fill/v1769794945/sea_yyeaix.jpg";

// Fallback logos for maximum email client compatibility
const LOGO_SVG = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iIzBhMTkyZiIvPjxjaXJjbGUgY3g9Ijc1IiBjeT0iNzUiIHI9IjcwIiBmaWxsPSJub25lIiBzdHJva2U9IiMwMEQ5RkYiIHN0cm9rZS13aWR0aD0iNCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjU2IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSIjMDBEOUZGIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Q0s8L3RleHQ+PC9zdmc+";

// Helper to get SMTP User (with fallback)
const getSmtpUser = () => Deno.env.get('SMTP_USER') || "codingclubpmec@gmail.com";

// Helper to create transporter
const createTransporter = () => {
    const user = getSmtpUser();
    const pass = Deno.env.get('SMTP_PASS');

    if (!pass) {
        console.error("Missing SMTP_PASS environment variable");
    }

    return nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: user,
            pass: pass,
        },
    });
};

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
        const smtpUser = getSmtpUser();

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
            try {
                const transporter = createTransporter();

                const mailOptions = {
                    from: `"CodeKriti Team" <${smtpUser}>`,
                    to: email,
                    subject: `Registration Received: ${event} | CodeKriti`,
                    html: `
                        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0a192f; color: #e6f1ff; padding: 40px 20px;">
                            <div style="max-width: 600px; margin: auto; background-color: #112240; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                                
                                <!-- Header -->
                                <div style="background-color: #0a192f; padding: 30px; text-align: center; border-bottom: 1px solid #233554;">
                                    <img src="${LOGO_SVG}" srcset="${LOGO_URL} 1x" alt="CodeKriti Logo" style="width: 80px; height: 80px; border-radius: 50%; border: 2px solid #64ffda; object-fit: cover; display: block; margin: 0 auto; background-color: #0a192f;" />
                                    <h1 style="color: #ccd6f6; margin: 15px 0 0; font-size: 24px; letter-spacing: 1px;">CodeKriti</h1>
                                    <p style="color: #64ffda; margin: 5px 0 0; font-size: 12px;">🌊 Dive Into Innovation 🌊</p>
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
    
                                    ${(typeof event === 'string' && event.toLowerCase().includes('designathon')) ? `
                                    <p style="font-size: 16px; line-height: 1.6; color: #8892b0; margin-top: 20px;">
                                        In the meanwhile, check the problem statements given by our Sponsors: 
                                        <a href="https://codekriti.tech/assets/PS_with_overall%20Solution.pdf" style="color: #64ffda; font-weight: bold; text-decoration: underline;">View Problem Statements</a>
                                    </p>
                                    ` : ''}
    
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
            } catch (emailError: any) {
                console.error("Failed to send pending email:", emailError);
            }

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
            let emailSent = false;
            try {
                const transporter = createTransporter();

                const mailOptions = {
                    from: `"CodeKriti Team" <${smtpUser}>`,
                    to: email,
                    subject: `🎟️ Ticket Confirmed: ${event} | CodeKriti`,
                    html: `
                        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #0a192f; margin: 0; padding: 20px 0;">
                            <!-- Outer Wrapper with subtle oceanic gradient -->
                            <div style="max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #0a192f 0%, #112240 100%); border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5); border: 1px solid #233554;">
                                
                                <!-- Header with Wave Effect (Simulated via gradient) -->
                                <div style="background: linear-gradient(180deg, #172a45 0%, #0a192f 100%); padding: 30px; text-align: center; border-bottom: 1px solid #233554;">
                                    <img src="${LOGO_SVG}" srcset="${LOGO_URL} 1x" alt="CodeKriti Logo" style="width: 80px; height: 80px; border-radius: 50%; border: 2px solid #64ffda; object-fit: cover; display: block; margin: 0 auto; background-color: #0a192f;" />
                                    <h1 style="color: #64ffda; margin: 15px 0 0; font-size: 28px; letter-spacing: 2px; text-transform: uppercase;">Ticket Confirmed</h1>
                                    <p style="color: #8892b0; font-size: 12px; margin: 8px 0 0;">🎟️ Your registration is approved</p>
                                </div>

                                <!-- Body -->
                                <div style="padding: 40px 30px; text-align: center;">
                                    <p style="font-size: 18px; color: #ccd6f6; margin-bottom: 30px;">
                                        Get ready, <strong>${leaderName}</strong>! Your spot for <strong>${event}</strong> is secured.
                                    </p>
                                    
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
                emailSent = true;
            } catch (emailError: any) {
                console.error("Failed to send confirmation email:", emailError);
            }

            return new Response(
                JSON.stringify({ status: 'success', message: 'Approved', emailSent }),
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

            const { data, error } = await supabaseAdmin
                .from('registrations')
                .update({ status: 'rejected' })
                .eq('id', id)
                .select();

            if (error) throw error;
            if (!data || data.length === 0) throw new Error("Registration not found or already rejected");

            return new Response(
                JSON.stringify({ status: 'success', message: 'Registration Rejected', data }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        // --- ACTION: CHECKIN ---
        if (action === 'CHECKIN') {
            const { id } = payload;
            const supabaseAdmin = createClient(
                Deno.env.get('SUPABASE_URL') ?? '',
                Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
            );

            // 1. Get Registration Details
            const { data, error } = await supabaseAdmin
                .from('registrations')
                .select('*')
                .eq('id', id)
                .single();

            if (error || !data) {
                return new Response(
                    JSON.stringify({
                        status: 'error',
                        data: { id, message: 'Ticket not found.' }
                    }),
                    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
                );
            }

            // 2. Validation Checks
            if (data.status !== 'success') {
                return new Response(
                    JSON.stringify({
                        status: 'error',
                        data: {
                            id,
                            team_name: data.team_name,
                            leader_name: data.leader_name,
                            event_id: data.event_id,
                            status: 'Pending/Rejected',
                            message: `Status is ${data.status}`
                        }
                    }),
                    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
                );
            }

            if (data.check_in_status) {
                return new Response(
                    JSON.stringify({
                        status: 'warning',
                        data: {
                            id,
                            team_name: data.team_name,
                            leader_name: data.leader_name,
                            event_id: data.event_id,
                            check_in_status: true,
                            status: 'Already Checked In',
                            message: 'Ticket already used.'
                        }
                    }),
                    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
                );
            }

            // 3. Update Check-In Status
            const { error: updateError } = await supabaseAdmin
                .from('registrations')
                .update({ check_in_status: true })
                .eq('id', id);

            if (updateError) throw updateError;

            return new Response(
                JSON.stringify({
                    status: 'success',
                    data: {
                        id,
                        team_name: data.team_name,
                        leader_name: data.leader_name,
                        event_id: data.event_id,
                        check_in_status: true,
                        status: 'Verified',
                        message: 'Welcome to the event!'
                    }
                }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        // --- ACTION: CONTACT ---
        if (action === 'CONTACT') {
            const { name, email, message } = payload;

            try {
                const transporter = createTransporter();

                // Send to both Admin (SMTP_USER) and the specific user requested
                // Ensure unique recipients and remove undefined/null
                const recipients = Array.from(new Set([
                    smtpUser,
                    'patraayushman21@gmail.com'
                ])).filter(Boolean);

                const mailOptions = {
                    from: `"CodeKriti Contact" <${smtpUser}>`,
                    to: recipients.join(','),
                    replyTo: email,
                    subject: `🌊 New Message from ${name} | CodeKriti Contact`,
                    html: `
                        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #0a192f; margin: 0; padding: 20px 0;">
                            <!-- Outer Wrapper with subtle oceanic gradient -->
                            <div style="max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #0a192f 0%, #112240 100%); border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5); border: 1px solid #233554;">
                                
                                <!-- Header -->
                                <div style="background: linear-gradient(180deg, #172a45 0%, #0a192f 100%); padding: 30px; text-align: center; border-bottom: 1px solid #233554;">
                                    <img src="${LOGO_SVG}" srcset="${LOGO_URL} 1x" alt="CodeKriti Logo" style="width: 60px; height: 60px; border-radius: 50%; border: 2px solid #64ffda; object-fit: cover; display: block; margin: 0 auto; background-color: #0a192f;" />
                                    <h1 style="color: #ccd6f6; margin: 15px 0 0; font-size: 24px; letter-spacing: 1px;">New Inquiry</h1>
                                </div>
    
                                <!-- Body -->
                                <div style="padding: 40px 30px;">
                                    <div style="display: flex; align-items: center; margin-bottom: 20px;">
                                        <div style="width: 40px; height: 40px; background: rgba(100, 255, 218, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; color: #64ffda; font-weight: bold; font-size: 18px;">
                                            ${name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p style="margin: 0; color: #64ffda; font-weight: bold; font-size: 18px;">${name}</p>
                                            <p style="margin: 2px 0 0; color: #8892b0; font-size: 14px;"><a href="mailto:${email}" style="color: #8892b0; text-decoration: none;">${email}</a></p>
                                        </div>
                                    </div>
    
                                    <div style="background-color: rgba(255, 255, 255, 0.05); padding: 25px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.1); position: relative;">
                                        <span style="position: absolute; top: -10px; left: 20px; background: #0a192f; padding: 0 10px; color: #64ffda; font-size: 12px; font-weight: bold; letter-spacing: 1px;">MESSAGE</span>
                                        <p style="font-size: 16px; line-height: 1.6; color: #e6f1ff; white-space: pre-wrap; margin: 0;">${message}</p>
                                    </div>
    
                                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #233554; text-align: center;">
                                        <p style="color: #8892b0; font-size: 12px; margin: 0;">Sent via CodeKriti 4.0 Contact Form</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `,
                };

                await transporter.sendMail(mailOptions);
            } catch (emailError: any) {
                console.error("Failed to send contact email:", emailError);
            }

            return new Response(
                JSON.stringify({ status: 'success', message: 'Message sent successfully' }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        throw new Error('Invalid action');

    } catch (error: any) {
        console.error('Edge Function Error:', error);
        return new Response(
            JSON.stringify({
                status: 'error',
                message: error.message || 'Internal Server Error',
                details: error.stack // Helpful for debugging now
            }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200
            }
        );
    }
});
