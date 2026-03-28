/**
 * VAIGOO INNOVATIONS - ADMIN DASHBOARD APPS SCRIPT
 * 
 * INSTRUCTIONS:
 * 1. Open your 3 Google Sheets (Contact, Career, Internship).
 * 2. In each sheet, go to Extensions > Apps Script.
 * 3. Delete any code there, paste this entire file in, and save.
 * 4. Deploy > New Deployment > Selected type: Web app.
 *    Execute as: Me. Who has access: Anyone.
 * 5. Provide permissions when prompted.
 */

function doGet(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheets()[0]; // Assumes correct sheet is the first one
  const data = sheet.getDataRange().getDisplayValues(); // Use getDisplayValues to safely handle Dates/Numbers
  
  if (data.length <= 1) {
    return createJsonResponse({ data: [] });
  }

  const headers = data[0].map(h => h.trim());
  const items = data.slice(1).map((row, index) => {
    let obj = {
      _rowIndex: index + 2 // 1-indexed, plus header
    };
    headers.forEach((h, i) => {
      // Clean up header names for reliable JSON properties
      let cleanHeader = h.replace(/[^a-zA-Z0-9 ]/g, "").trim();
      obj[cleanHeader] = row[i];
    });
    return obj;
  });

  return createJsonResponse({ data: items });
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheets()[0];
    const data = sheet.getDataRange().getValues();
    
    const headers = data[0].map(h => h.trim());
    
    // Locate critical column indices
    const emailIdx = headers.findIndex(h => h.toLowerCase() === 'email');
    const statusIdx = headers.findIndex(h => h.toLowerCase() === 'status');
    const lastSentIdx = headers.findIndex(h => h.toLowerCase() === 'last sent status');
    const nameIdx = headers.findIndex(h => h.toLowerCase() === 'name');
    
    // Optional Interview columns
    const intDateIdx = headers.findIndex(h => h.toLowerCase() === 'interview date');
    const meetLinkIdx = headers.findIndex(h => h.toLowerCase() === 'meeting link');

    if (emailIdx === -1 || statusIdx === -1 || lastSentIdx === -1) {
      return createJsonResponse({ error: 'Missing required columns in sheet: Email, Status, Last Sent Status' }, 400);
    }

    const targetEmail = body.email.toLowerCase();
    let rowIndex = -1;
    let currentRowData = null;

    // Search from bottom up to find the latest submission by this email
    for (let i = data.length - 1; i >= 1; i--) {
      if (data[i][emailIdx] && data[i][emailIdx].toString().toLowerCase() === targetEmail) {
        rowIndex = i + 1;
        currentRowData = data[i];
        break;
      }
    }

    if (rowIndex === -1) {
      return createJsonResponse({ error: 'User email not found in sheet' }, 404);
    }

    const currentLastSent = currentRowData[lastSentIdx];
    const newStatus = body.status;
    const name = nameIdx !== -1 ? currentRowData[nameIdx] : 'Applicant';

    // 1. Update the Status
    sheet.getRange(rowIndex, statusIdx + 1).setValue(newStatus);
    
    // 2. Update Interview details if provided & if columns exist
    if (intDateIdx !== -1 && body.interviewDate) {
      sheet.getRange(rowIndex, intDateIdx + 1).setValue(body.interviewDate);
    }
    if (meetLinkIdx !== -1 && body.meetLink) {
      sheet.getRange(rowIndex, meetLinkIdx + 1).setValue(body.meetLink);
    }

    // 3. Prevent duplicate emails
    if (currentLastSent === newStatus) {
      return createJsonResponse({ success: true, message: 'Status updated. Email skipped (duplicate).' });
    }

    // 4. Dispatch Email Automation
    let emailSent = sendStatusEmail(targetEmail, name, newStatus, body.interviewDate, body.meetLink, body.type);

    if (emailSent) {
      sheet.getRange(rowIndex, lastSentIdx + 1).setValue(newStatus);
    }

    return createJsonResponse({ success: true, message: 'Status updated and email sent.' });

  } catch (error) {
    return createJsonResponse({ error: error.toString() }, 500);
  }
}

function sendStatusEmail(toEmail, name, status, meetDate, meetLink, typeLabel) {
  let subject = "";
  let bodyContent = "";
  const roleContext = typeLabel === 'internship' ? 'internship' : 'career';

  if (status === 'Reviewed') {
    subject = "Your Application is Under Review | Vaigoo Innovations";
    bodyContent = `
      <h2 style="font-size: 22px; color: #111827; margin-top: 0;">Application Update</h2>
      <p style="color: #4b5563; line-height: 1.6;">Hi ${name},</p>
      <p style="color: #4b5563; line-height: 1.6;">Your ${roleContext} application is currently being reviewed by our engineering team. We are going through your portfolio and details carefully.</p>
      <p style="color: #4b5563; line-height: 1.6;">We will keep you updated on any next steps. Thank you for your patience!</p>
    `;
  } 
  else if (status === 'Shortlisted') {
    subject = "You're Shortlisted! Interview Invitation | Vaigoo Innovations";
    bodyContent = `
      <h2 style="font-size: 22px; color: #111827; margin-top: 0;">Congratulations ${name}! 🎉</h2>
      <p style="color: #4b5563; line-height: 1.6;">We were highly impressed by your ${roleContext} application and would love to invite you for a technical discussion round.</p>
      ${meetDate ? `
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 12px; margin: 24px 0;">
        <p style="margin: 0; color: #6b7280; font-size: 13px; text-transform: uppercase; font-weight: bold; letter-spacing: 0.05em;">Interview Details</p>
        <p style="margin: 8px 0; color: #111827; font-size: 18px; font-weight: bold;">🗓️ ${meetDate}</p>
        ${meetLink ? `<a href="${meetLink}" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 12px;">Join Google Meet</a>` : ''}
      </div>` : ''}
      <p style="color: #4b5563; line-height: 1.6;">We look forward to speaking with you!</p>
    `;
  }
  else if (status === 'Rejected') {
    subject = "Update on your application | Vaigoo Innovations";
    bodyContent = `
      <h2 style="font-size: 22px; color: #111827; margin-top: 0;">Application Update</h2>
      <p style="color: #4b5563; line-height: 1.6;">Hi ${name},</p>
      <p style="color: #4b5563; line-height: 1.6;">Thank you for taking the time to apply for a ${roleContext} role at Vaigoo Innovations. After careful consideration, we have decided to move forward with other candidates at this time.</p>
      <p style="color: #4b5563; line-height: 1.6;">We strongly encourage you to keep building and re-apply in the future as our team expands.</p>
      <div style="margin-top: 24px;">
        <a href="https://vaigoo-innovations.vercel.app" style="color: #2563eb; font-weight: bold; text-decoration: none;">Explore our website</a>
      </div>
    `;
  } else {
    // If pending or some other status, don't send emails automatically.
    return false;
  }

  // Wrapper template
  const htmlBody = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f9fafb; padding: 40px 16px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
        <div style="padding: 32px; border-bottom: 2px solid #f3f4f6;">
          <h1 style="margin: 0; font-size: 24px; font-weight: 900; color: #111827;">Vaigoo <span style="color: #2563eb;">Innovations</span></h1>
        </div>
        <div style="padding: 32px;">
          ${bodyContent}
        </div>
        <div style="background-color: #f9fafb; padding: 24px 32px; text-align: center; color: #9ca3af; font-size: 13px;">
          &copy; ${new Date().getFullYear()} Vaigoo Innovations. All rights reserved.
        </div>
      </div>
    </div>
  `;

  try {
    MailApp.sendEmail({
      to: toEmail,
      subject: subject,
      htmlBody: htmlBody
    });
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

function createJsonResponse(obj, statusCode = 200) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
