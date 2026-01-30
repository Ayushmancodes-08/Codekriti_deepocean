import { RegistrationData } from './schemas';
import {
    isSingleParticipantRegistration,
    getParticipantName,
    getParticipantEmail,
    getParticipantPhone,
    getEventConfig,
} from './formUtils';

/**
 * Generate HTML template for confirmation
 */
export function generateConfirmationHTML(
    confirmationId: string,
    registrationData: RegistrationData
): string {
    const participantName = getParticipantName(registrationData);
    const participantEmail = getParticipantEmail(registrationData);
    const participantPhone = getParticipantPhone(registrationData);
    const eventConfig = getEventConfig(registrationData.eventType);
    const isSingle = isSingleParticipantRegistration(registrationData);

    const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    // Team members HTML if applicable
    let teamMembersHTML = '';
    if (!isSingle && 'members' in registrationData) {
        teamMembersHTML = `
      <div style="margin-top: 30px;">
        <h3 style="color: #0ea5e9; font-size: 18px; margin-bottom: 15px; font-family: 'Inter', sans-serif;">Team Members</h3>
        <div style="background: rgba(14, 165, 233, 0.05); padding: 20px; border-radius: 12px; border-left: 4px solid #0ea5e9;">
          ${registrationData.members
                .map(
                    (member, index) => `
            <div style="margin-bottom: ${index < registrationData.members.length - 1 ? '15px' : '0'}; padding-bottom: ${index < registrationData.members.length - 1 ? '15px' : '0'}; border-bottom: ${index < registrationData.members.length - 1 ? '1px solid rgba(14, 165, 233, 0.2)' : 'none'};">
              <p style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #1e293b;">${member.name}</p>
              <p style="margin: 0 0 4px 0; font-size: 14px; color: #64748b;">📧 ${member.email}</p>
              <p style="margin: 0 0 4px 0; font-size: 14px; color: #64748b;">📱 ${member.phoneNumber}</p>
              <p style="margin: 0 0 4px 0; font-size: 14px; color: #64748b;">🎓 ${member.college}</p>
              <p style="margin: 0; font-size: 14px; color: #64748b;">📚 ${member.branch} - ${member.year}</p>
            </div>
          `
                )
                .join('')}
        </div>
      </div>
    `;
    }

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CodeKriti 4.0 - Registration Confirmation</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); min-height: 100vh;">
  <div style="max-width: 800px; margin: 0 auto; padding: 40px 20px;">
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 40px;">
      <div style="background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 40px rgba(14, 165, 233, 0.3);">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 6L9 17L4 12" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <h1 style="color: white; font-size: 36px; margin: 0 0 10px 0; font-weight: 700;">Registration Confirmed!</h1>
      <p style="color: #94a3b8; font-size: 18px; margin: 0;">CodeKriti 4.0 2026</p>
    </div>

    <!-- Main Content Card -->
    <div style="background: white; border-radius: 20px; padding: 40px; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3); position: relative; overflow: hidden;">
      <!-- Ocean Wave Decoration -->
      <div style="position: absolute; top: 0; left: 0; right: 0; height: 6px; background: linear-gradient(90deg, #0ea5e9 0%, #06b6d4 50%, #0ea5e9 100%);"></div>
      
      <!-- Confirmation ID -->
      <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); padding: 20px; border-radius: 12px; margin-bottom: 30px; border: 2px dashed #0ea5e9;">
        <p style="margin: 0 0 8px 0; font-size: 14px; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Confirmation ID</p>
        <p style="margin: 0; font-size: 24px; color: #0ea5e9; font-weight: 700; letter-spacing: 2px; font-family: 'Courier New', monospace;">${confirmationId}</p>
      </div>

      <!-- Event Details -->
      <div style="margin-bottom: 30px;">
        <h2 style="color: #0ea5e9; font-size: 20px; margin: 0 0 15px 0; font-weight: 700;">Event Details</h2>
        <div style="background: #f8fafc; padding: 20px; border-radius: 12px; border-left: 4px solid #0ea5e9;">
          <p style="margin: 0 0 8px 0; font-size: 24px; font-weight: 700; color: #1e293b;">${eventConfig.name}</p>
          <p style="margin: 0; font-size: 14px; color: #64748b;">${eventConfig.description}</p>
        </div>
      </div>

      <!-- Participant Details -->
      <div style="margin-bottom: 30px;">
        <h2 style="color: #0ea5e9; font-size: 20px; margin: 0 0 15px 0; font-weight: 700;">${isSingle ? 'Participant' : 'Team Leader'} Details</h2>
        <div style="background: #f8fafc; padding: 20px; border-radius: 12px;">
          <p style="margin: 0 0 12px 0; font-size: 18px; font-weight: 600; color: #1e293b;">${participantName}</p>
          <p style="margin: 0 0 8px 0; font-size: 14px; color: #64748b;">📧 ${participantEmail}</p>
          <p style="margin: 0; font-size: 14px; color: #64748b;">📱 ${participantPhone}</p>
        </div>
      </div>

      ${teamMembersHTML}

      <!-- Important Information -->
      <div style="background: #fef3c7; padding: 20px; border-radius: 12px; border-left: 4px solid #f59e0b; margin-top: 30px;">
        <p style="margin: 0 0 10px 0; font-size: 16px; font-weight: 600; color: #92400e;">📌 Important Information</p>
        <ul style="margin: 0; padding-left: 20px; color: #92400e; font-size: 14px; line-height: 1.8;">
          <li>Please save this confirmation for your records</li>
          <li>You will receive an email confirmation shortly</li>
          <li>Keep your confirmation ID handy for the event day</li>
          <li>Check your email for further updates and event details</li>
        </ul>
      </div>

      <!-- Footer -->
      <div style="margin-top: 40px; padding-top: 30px; border-top: 2px solid #f1f5f9; text-align: center;">
        <p style="margin: 0 0 10px 0; font-size: 14px; color: #64748b;">Registration Date: ${currentDate}</p>
        <p style="margin: 0; font-size: 12px; color: #94a3b8;">© 2026 CodeKriti 4.0 - Deep Dive into the Ocean of Code</p>
      </div>
    </div>

    <!-- Additional Note -->
    <div style="text-align: center; margin-top: 30px;">
      <p style="color: #94a3b8; font-size: 14px;">We're excited to have you join us! 🌊</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Download confirmation as HTML file
 */
export function downloadConfirmationHTML(
    confirmationId: string,
    registrationData: RegistrationData
): void {
    const html = generateConfirmationHTML(confirmationId, registrationData);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CodeKriti-2026-Confirmation-${confirmationId}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * Print confirmation (opens print dialog)
 */
export function printConfirmation(
    confirmationId: string,
    registrationData: RegistrationData
): void {
    const html = generateConfirmationHTML(confirmationId, registrationData);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.focus();
        // Wait for content to load before printing
        setTimeout(() => {
            printWindow.print();
        }, 250);
    }
}
