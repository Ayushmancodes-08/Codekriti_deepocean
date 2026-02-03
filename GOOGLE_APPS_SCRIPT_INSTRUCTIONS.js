/**
 * CODEKRITI 4.0 REGISTRATION BACKEND
 * 
 * INSTRUCTIONS:
 * 1. Create a new Google Sheet (or use existing).
 * 2. Copy the Spreadsheet ID from the URL (it is the long string between /d/ and /edit).
 *    Example: https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjGMUUqptlbs74OgvE2upms/edit
 *    ID is: 1BxiMVs0XRA5nFMdKvBdBZjGMUUqptlbs74OgvE2upms
 * 3. Paste that ID into the SPREADSHEET_ID variable below if you are running this as a Standalone Script.
 *    (If you created this script from Extensions > Apps Script inside the sheet, you can leave it empty).
 * 4. Save and Run 'setupSheets'.
 * 5. Deploy as Web App (Anyone access).
 */
// --- CONFIGURATION ---
const SPREADSHEET_ID = "19tmmR_EX-cAbOdS2deo9-lNJ8KHCVc66jj_I2nDdKQA"; // <--- PASTE YOUR SHEET ID HERE IF RUNNING STANDALONE
const EVENT_NAME = "CodeKriti 4.0";
const SENDER_NAME = "CodeKriti Team";
const SECRET_KEY = "VOYAGE_PROTOCOL_SECURE_KEY_2026"; // Change this to a secret string for "Anti-Fraud"
// --- MAIN ENTRY POINT (POST) ---
function doPost(e) {
    const lock = LockService.getScriptLock();
    lock.tryLock(10000);
    try {
        const params = JSON.parse(e.postData.contents);
        const action = params.action;
        const payload = params.payload;
        if (action === 'REGISTER') {
            return handleRegistration(payload);
        } else if (action === 'NEWSLETTER') {
            return handleNewsletter(params.email);
        } else if (action === 'BROADCAST') {
            if (params.password !== 'admin123') {
                return createResponse({ status: 'error', message: 'Unauthorized' });
            }
            return handleBroadcast(params.subject, params.message);
        } else if (action === 'VERIFY_TICKET') {
            // --- NEW: VERIFICATION LOGIC ---
            const adminSecret = params.adminSecret;
            if (adminSecret !== "YOUR_SECRET_PIN_1234") {
                return createResponse({ status: 'error', message: 'Unauthorized: Invalid Admin PIN' });
            }
            const ticketId = payload.id;

            // Search all sheets for the ID
            const ss = getSpreadsheet();
            const sheets = ss.getSheets();

            for (let sheet of sheets) {
                if (sheet.getName() === "Newsletter") continue;

                const data = sheet.getDataRange().getValues();
                // Column B is ID (index 1) in your schema? 
                // Schema: Timestamp(0), ID(1), Team(2), Leader(3), Email(4)...

                for (let i = 1; i < data.length; i++) {
                    if (data[i][1] == ticketId) {
                        // Found! Check Status in Column M (index 12)
                        // Note: If you don't have enough columns, this might need dynamic handling, 
                        // but for now we assume we can write to col 13/14.
                        const currentStatus = data[i][12];
                        const participantData = {
                            name: data[i][3], // Leader Name
                            event: sheet.getName(),
                            team: data[i][2],
                        };

                        if (currentStatus === "VERIFIED") {
                            return createResponse({
                                status: 'warning',
                                message: 'ALREADY VERIFIED',
                                data: { ...participantData, verifiedAt: data[i][13] } // Timestamp in Col N
                            });
                        } else {
                            // Update Status
                            sheet.getRange(i + 1, 13).setValue("VERIFIED");
                            sheet.getRange(i + 1, 14).setValue(new Date().toISOString());
                            return createResponse({
                                status: 'success',
                                message: 'ACCESS GRANTED',
                                data: participantData
                            });
                        }
                    }
                }
            }
            return createResponse({ status: 'error', message: 'TICKET NOT FOUND' });

        } else if (action === 'DRY_RUN') {
            return createResponse({ status: 'success', message: 'Connection Successful', data: { time: new Date() } });
        }
        return createResponse({ status: 'error', message: 'Invalid Action' });
    } catch (error) {
        Logger.log("Error: " + error.toString());
        return createResponse({ status: 'error', message: error.toString() });
    } finally {
        lock.releaseLock();
    }
}
// --- HANDLERS ---
function handleRegistration(data) {
    const ss = getSpreadsheet();
    let sheetName = data.event || "General Registrations";
    sheetName = sheetName.replace(/[:\/\\?*\[\]]/g, "_").substring(0, 100);
    let sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
        sheet = ss.insertSheet(sheetName);
        const headers = [
            "Timestamp", "ID", "Team Name", "Leader Name", "Email", "Phone",
            "College", "Year", "Branch", "Members", "Subscribe", "Signature"
        ];
        sheet.appendRow(headers);
        sheet.setFrozenRows(1);
        sheet.getRange(1, 1, 1, headers.length).setBackground("#0a192f").setFontColor("#ffffff").setFontWeight("bold");
    }
    // Generate Unique ID & Signature
    const id = `CK-${Math.floor(100000 + Math.random() * 900000)}`; // 6-digit random
    const rawString = `${id}|${data.email}|${data.event}|${SECRET_KEY}`;
    const signature = computeSignature(rawString);
    // Secure QR Payload (This is what the scanner reads)
    const qrPayload = {
        id: id,
        e: data.event,
        u: data.leaderName,
        m: data.email,
        s: signature, // The anti-fraud proof
        v: true
    };
    const qrString = JSON.stringify(qrPayload);
    if (isDuplicate(sheet, 5, data.email)) { // 5th col is Email now (shifted by ID)
        return createResponse({ status: 'error', message: 'Email already registered for this event.' });
    }
    sheet.appendRow([
        new Date(),
        id,
        data.teamName,
        data.leaderName,
        data.email,
        "'" + data.phone,
        data.college || "N/A",
        data.year,
        data.branch,
        (data.members || []).join(", "),
        data.subscribe ? "Yes" : "No",
        signature
    ]);
    sendConfirmationEmail(data, id, qrString);
    if (data.subscribe) {
        handleNewsletter(data.email, true);
    }
    // Return the QR String to frontend so it matches PERFECTLY
    return createResponse({ status: 'success', message: 'Registration Successful', id: id, qrData: qrString });
}
function handleNewsletter(email, internal = false) {
    const ss = getSpreadsheet();
    let sheet = ss.getSheetByName("Newsletter");
    if (!sheet) {
        sheet = ss.insertSheet("Newsletter");
        sheet.appendRow(["Timestamp", "Email"]);
        sheet.getRange(1, 1, 1, 2).setBackground("#0a192f").setFontColor("#ffffff").setFontWeight("bold");
    }
    if (!isDuplicate(sheet, 2, email)) {
        sheet.appendRow([new Date(), email]);
    }
    if (internal) return;
    return createResponse({ status: 'success', message: 'Subscribed' });
}
function handleBroadcast(subject, message) {
    const ss = getSpreadsheet();
    const sheet = ss.getSheetByName("Newsletter");
    if (!sheet) return createResponse({ status: 'error', message: 'No subscribers found' });
    const emails = sheet.getRange(2, 2, sheet.getLastRow() - 1, 1).getValues().flat().filter(e => e);
    emails.forEach(email => {
        try {
            MailApp.sendEmail({ to: email, subject: subject, htmlBody: message, name: SENDER_NAME });
        } catch (e) { }
    });
    return createResponse({ status: 'success', message: `Sent to ${emails.length} subscribers` });
}
// --- HELPERS ---
function getSpreadsheet() {
    try {
        const ss = SpreadsheetApp.getActiveSpreadsheet();
        if (ss) return ss;
    } catch (e) { }
    if (SPREADSHEET_ID) return SpreadsheetApp.openById(SPREADSHEET_ID);
    throw new Error("Could not find Spreadsheet. If running standalone, please set SPREADSHEET_ID.");
}
function isDuplicate(sheet, colIndex, value) {
    const lastRow = sheet.getLastRow();
    if (lastRow < 2) return false;
    const data = sheet.getRange(2, colIndex, lastRow - 1, 1).getValues().flat();
    return data.includes(value);
}
function computeSignature(input) {
    const byteSignature = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, input);
    return byteSignature.map(function (byte) {
        const v = (byte < 0) ? 256 + byte : byte;
        return ("0" + v.toString(16)).slice(-2);
    }).join("");
}
function sendConfirmationEmail(data, id, qrString) {
    const subject = `Your Voyage Pass - ${data.event} | CodeKriti 4.0`;
    const qrUrl = "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=" + encodeURIComponent(qrString);
    const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Voyage Pass</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #020c1b; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #020c1b;">
        <tr>
          <td align="center" style="padding: 40px 20px;">
            
            <!-- Pass Container -->
            <table width="420" border="0" cellspacing="0" cellpadding="0" style="background: linear-gradient(145deg, #112240, #0a192f); border-radius: 20px; border: 1px solid #64ffda; overflow: hidden; box-shadow: 0 20px 60px rgba(100, 255, 218, 0.15);">
              
              <!-- Header -->
              <tr>
                <td align="center" style="background: linear-gradient(90deg, rgba(100, 255, 218, 0.1), rgba(0, 243, 255, 0.1)); padding: 30px 20px; border-bottom: 1px solid rgba(100, 255, 218, 0.2);">
                   <h1 style="color: #64ffda; margin: 0; letter-spacing: 6px; font-size: 26px; font-weight: 300;">VOYAGE PASS</h1>
                   <p style="color: #8892b0; margin: 8px 0 0 0; font-size: 11px; letter-spacing: 3px;">EXPLORER ID: ${id}</p>
                </td>
              </tr>
              <!-- Content -->
              <tr>
                <td style="padding: 35px 30px;">
                  
                  <table width="100%" cellpadding="8" style="border-collapse: collapse;">
                    <tr>
                      <td style="color: #64ffda; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; padding-bottom: 5px;">Event</td>
                      <td align="right" style="color: #e6f1ff; font-weight: 600; font-size: 15px;">${data.event}</td>
                    </tr>
                    <tr>
                      <td colspan="2" style="border-bottom: 1px solid rgba(136, 146, 176, 0.2); padding: 0;"></td>
                    </tr>
                    <tr>
                      <td style="color: #64ffda; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; padding-top: 12px;">Explorer</td>
                      <td align="right" style="color: #e6f1ff; font-weight: 600; font-size: 15px; padding-top: 12px;">${data.leaderName}</td>
                    </tr>
                     <tr>
                      <td style="color: #64ffda; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Crew</td>
                      <td align="right" style="color: #ccd6f6; font-size: 14px;">${data.teamName}</td>
                    </tr>
                     <tr>
                      <td style="color: #64ffda; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Base</td>
                      <td align="right" style="color: #ccd6f6; font-size: 14px;">${data.college || "N/A"}</td>
                    </tr>
                  </table>
                  <!-- QR Section -->
                  <div style="margin-top: 35px; text-align: center;">
                    <div style="display: inline-block; padding: 15px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);">
                       <img src="${qrUrl}" width="140" height="140" alt="Secure QR" style="display: block;" />
                    </div>
                    <p style="color: #536082; font-size: 10px; margin-top: 15px; letter-spacing: 2px;">SCAN FOR VERIFICATION</p>
                  </div>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                 <td align="center" style="padding: 20px; background-color: rgba(10, 25, 47, 0.8); border-top: 1px solid rgba(100, 255, 218, 0.1);">
                    <p style="color: #64ffda; font-size: 10px; margin: 0; letter-spacing: 1px;">CODEKRITI 4.0</p>
                    <p style="color: #536082; font-size: 9px; margin: 5px 0 0 0;">Secure Transmission • ${new Date().toLocaleDateString()}</p>
                 </td>
              </tr>
            </table>
            <p style="color: #8892b0; margin-top: 30px; font-size: 13px;">Keep this pass safe. It's your boarding ticket to the event.</p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
    try {
        MailApp.sendEmail({
            to: data.email,
            subject: subject,
            htmlBody: htmlBody,
            name: SENDER_NAME
        });
    } catch (e) {
        Logger.log("Failed to send confirmation email: " + e.toString());
    }
}
function createResponse(data) {
    return ContentService.createTextOutput(JSON.stringify(data))
        .setMimeType(ContentService.MimeType.JSON);
}
function setupSheets() {
    const ss = getSpreadsheet();
    if (!ss.getSheetByName("Newsletter")) {
        const s = ss.insertSheet("Newsletter");
        s.appendRow(["Timestamp", "Email"]);
        s.getRange(1, 1, 1, 2).setBackground("#0a192f").setFontColor("#ffffff").setFontWeight("bold");
    }
    Logger.log("Setup Complete for Sheet: " + ss.getName());
}