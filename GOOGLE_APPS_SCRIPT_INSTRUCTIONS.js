/**
 * CodeKriti 4.0 - Serverless Backend
 * ----------------------------------
 * Deploy this script as a Web App to handle Form Submissions, Newsletter, and Broadcasts.
 * 
 * INSTRUCTIONS:
 * 1. Go to https://script.google.com/
 * 2. Create a new project.
 * 3. Paste this code into 'Code.gs'.
 * 4. Click 'Deploy' > 'New deployment'.
 * 5. Select type: 'Web app'.
 * 6. Set Description: 'v2'.
 * 7. Set 'Who has access': 'Anyone' (IMPORTANT).
 * 8. Copy the 'Web app URL' and paste it into your website's .env file or src/utils/googleSheets.ts.
 */

// CONFIGURATION
const ADMIN_PASSWORD = "deep-dive-admin"; // Change this for security
const SENDER_NAME = "CodeKriti 4.0";

function doPost(e) {
    const lock = LockService.getScriptLock();
    lock.tryLock(10000);

    try {
        const data = JSON.parse(e.postData.contents);
        const action = data.action;

        let result;

        switch (action) {
            case 'REGISTER':
                result = handleRegistration(data);
                break;
            case 'NEWSLETTER':
                result = handleNewsletter(data.email);
                break;
            case 'BROADCAST':
                result = handleBroadcast(data);
                break;
            default:
                throw new Error("Invalid action");
        }

        return ContentService.createTextOutput(JSON.stringify({ status: 'success', data: result }))
            .setMimeType(ContentService.MimeType.JSON);

    } catch (error) {
        return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
            .setMimeType(ContentService.MimeType.JSON);
    } finally {
        lock.releaseLock();
    }
}

/**
 * Handles Team/Individual Registration
 * STRICT RULE: Only creates sheet if it's new. Newsletter is SEPARATE.
 */
function handleRegistration(data) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const userData = data.payload;

    // 1. Determine Sheet Name STRICTLY from the Event Name passed from frontend
    // This will be "Algo to Code", "DevXtreme Hackathon", etc.
    const sheetName = userData.event || "General_Registrations";
    let sheet = ss.getSheetByName(sheetName);

    // 2. Create Sheet if it doesn't exist (Dynamic Creation)
    if (!sheet) {
        sheet = ss.insertSheet(sheetName);
        // Add Headers for the new Event Sheet
        sheet.appendRow(["Timestamp", "Team Name", "Leader/Participant Name", "Email", "Phone", "Team Members", "Year", "Branch"]);
        sheet.setFrozenRows(1);
    }

    // 3. Prepare Row Data
    const timestamp = new Date();
    const row = [
        timestamp,
        userData.teamName,
        userData.leaderName,
        userData.email,
        userData.phone,
        userData.members ? userData.members.join(", ") : "", // Flatten array
        userData.year,
        userData.branch
    ];

    // 4. Append to Event Sheet
    sheet.appendRow(row);

    // 5. Handle Newsletter Subscription (SEPARATELY)
    // Even if they register, they are only added to Newsletter sheet if explicitly requested
    if (userData.subscribe) {
        handleNewsletter(userData.email);
    }

    // 6. Send Confirmation Email
    sendConfirmationEmail(userData.email, userData.leaderName, userData.teamName);

    return { message: "Registration successful" };
}

/**
 * Handles Newsletter Subscription (No Duplicates)
 * STRICT RULE: Separate 'Newsletter' sheet.
 */
function handleNewsletter(email) {
    if (!validateEmail(email)) return { message: "Invalid email" };

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName("Newsletter");

    // Create Newsletter sheet if missing
    if (!sheet) {
        sheet = ss.insertSheet("Newsletter");
        sheet.appendRow(["Timestamp", "Email"]);
        sheet.setFrozenRows(1);
    }

    // Check for duplicates
    // We get all emails in column B to check
    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
        const existingValues = sheet.getRange("B2:B" + lastRow).getValues().flat();
        if (existingValues.includes(email)) {
            return { message: "Already subscribed" };
        }
    }

    sheet.appendRow([new Date(), email]);
    return { message: "Subscribed successfully" };
}

/**
 * Handles Broadcasting Emails to Newsletter List
 */
function handleBroadcast(data) {
    if (data.password !== ADMIN_PASSWORD) {
        throw new Error("Unauthorized: Incorrect Password");
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("Newsletter");
    if (!sheet) throw new Error("No newsletter subscribers found");

    const emails = sheet.getRange(2, 2, sheet.getLastRow() - 1).getValues().flat();

    const subject = data.subject || "Update from CodeKriti";
    const body = data.message;

    let count = 0;
    for (const email of emails) {
        if (validateEmail(email)) {
            MailApp.sendEmail({
                to: email,
                subject: subject,
                htmlBody: formatEmailBody(body),
                name: SENDER_NAME
            });
            count++;
        }
    }

    return { message: `Broadcast sent to ${count} subscribers` };
}

/**
 * Helpers
 */
function validateEmail(email) {
    return email && email.includes("@") && email.includes(".");
}

function sendConfirmationEmail(email, name, teamName) {
    const subject = "Welcome to CodeKriti 4.0 - Registration Confirmed";
    const body = `
    <h1>Welcome to the Abyss, ${name}!</h1>
    <p>Your registration for team <strong>${teamName}</strong> has been confirmed.</p>
    <p>Get ready to dive deep.</p>
    <br>
    <p>- The CodeKriti Team</p>
  `;

    MailApp.sendEmail({
        to: email,
        subject: subject,
        htmlBody: formatEmailBody(body),
        name: SENDER_NAME
    });
}

function formatEmailBody(content) {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #000; color: #fff; padding: 20px; border: 1px solid #00F3FF; border-radius: 10px;">
      <h2 style="color: #00F3FF; text-align: center;">CODEKRITI 4.0</h2>
      <hr style="border-color: #333;">
      <div style="padding: 20px 0;">
        ${content}
      </div>
      <hr style="border-color: #333;">
      <p style="text-align: center; font-size: 12px; color: #666;">&copy; 2026 CodeKriti. All rights reserved.</p>
    </div>
  `;
}
