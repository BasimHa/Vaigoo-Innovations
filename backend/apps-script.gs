/**
 * VAIGOO INNOVATIONS - UNIFIED ADMIN BACKEND (Apps Script)
 * 
 * 1. Create a Google Sheet.
 * 2. Rename 'Sheet1' to 'Submissions'.
 * 3. Create a sheet named 'Positions'.
 * 4. Paste this code into Extensions > Apps Script.
 * 5. Deploy as Web App (Execute as: Me, Access: Anyone).
 */

const SHEET_NAME_SUBMISSIONS = 'Submissions';
const SHEET_NAME_POSITIONS = 'Positions';

/**
 * Handle incoming form submissions and status updates
 */
function doPost(e) {
  const body = JSON.parse(e.postData.contents);
  const action = body.action; // 'submit' or 'updateStatus' or 'managePosition'

  if (action === 'submit') {
    return handleSubmission(body);
  } else if (action === 'updateStatus') {
    return handleUpdateStatus(body);
  } else if (action === 'managePosition') {
    return handleManagePosition(body);
  }

  return response({ error: 'Invalid action' });
}

/**
 * Handle GET requests for Admin Portal and Status Checker
 */
function doGet(e) {
  const type = e.parameter.type; // 'all', 'contact', 'career', 'internship', 'positions', 'statusCheck'
  const email = e.parameter.email;

  if (type === 'statusCheck' && email) {
    return handleStatusCheck(email);
  }

  if (type === 'positions') {
    return response({ data: getPositions() });
  }

  return response({ data: getSubmissions(type) });
}

// --- CORE HANDLERS ---

function handleSubmission(data) {
  const sheet = getSheet(SHEET_NAME_SUBMISSIONS);
  const id = Utilities.getUuid();
  const timestamp = new Date();
  
  // Columns: ID, Timestamp, Type, Name, Email, Phone, Message/Position/Domain, EmploymentType, Duration, InternshipType, Resume, Status, InterviewDate, MeetLink, LastStatusEmail
  const rowData = [
    id,
    timestamp,
    data.type, // 'contact', 'career', 'internship'
    data.name,
    data.email,
    data.phone || '',
    data.message || data.position || data.domain || '',
    data.employmentType || '',
    data.duration || '',
    data.internshipType || '',
    data.resume || '',
    'Pending', // Default status
    '', // InterviewDate
    '', // MeetLink
    ''  // Last Sent Status Email
  ];
  
  sheet.appendRow(rowData);
  return response({ success: true, id: id });
}

function handleUpdateStatus(data) {
  const { id, status } = data;
  const sheet = getSheet(SHEET_NAME_SUBMISSIONS);
  const rows = sheet.getDataRange().getValues();
  
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] === id) {
      const email = rows[i][4];
      const name = rows[i][3];
      const type = rows[i][2];
      const currentStatusInSheet = rows[i][11];

      // Prevent duplicate status emails
      if (currentStatusInSheet === status) return response({ success: true, message: 'Status already set' });

      sheet.getRange(i + 1, 12).setValue(status);
      
      // Automation Logic based on Status
      processStatusAutomation(i + 1, name, email, type, status);
      
      return response({ success: true });
    }
  }
  return response({ error: 'Submission not found' }, 404);
}

function handleStatusCheck(email) {
  const rows = getSheet(SHEET_NAME_SUBMISSIONS).getDataRange().getValues();
  const matches = rows.filter(r => r[4] === email).map(r => ({
    status: r[11],
    interviewDate: r[12],
    meetLink: r[13],
    type: r[2],
    name: r[3]
  }));
  
  return response({ data: matches });
}

// --- AUTOMATION & EMAILS ---

function processStatusAutomation(rowIdx, name, email, type, status) {
  let subject = '';
  let body = '';
  const sheet = getSheet(SHEET_NAME_SUBMISSIONS);

  if (status === 'Reviewed') {
    subject = "Your Request is Under Review – Vaigoo Innovations";
    body = getEmailTemplate(name, "Your application is currently being reviewed by our team. We'll be in touch soon with the next steps.");
    sendEmail(email, subject, body);
  } 
  else if (status === 'Shortlisted') {
    const interviewDate = new Date();
    interviewDate.setDate(interviewDate.getDate() + 5);
    interviewDate.setHours(10, 0, 0, 0); // 10:00 AM
    
    // Create Calendar Event & Meet Link
    const calendarEvent = createInterviewEvent(name, email, interviewDate);
    const meetLink = calendarEvent ? calendarEvent.getHangoutLink() : '';
    
    // Update Sheet with Interview Details
    sheet.getRange(rowIdx, 13).setValue(interviewDate.toLocaleString());
    sheet.getRange(rowIdx, 14).setValue(meetLink);

    subject = "You're Shortlisted – Vaigoo Innovations";
    body = getShortlistTemplate(name, interviewDate, meetLink);
    sendEmail(email, subject, body);
  } 
  else if (status === 'Rejected') {
    subject = "Application Update – Vaigoo Innovations";
    body = getRejectionTemplate(name);
    sendEmail(email, subject, body);
  }
}

function createInterviewEvent(name, email, date) {
  try {
    const endTime = new Date(date.getTime() + 30 * 60000); // 30 mins
    const event = CalendarApp.getDefaultCalendar().createEvent(
      `Interview: ${name} x Vaigoo Innovations`,
      date,
      endTime,
      {
        guests: email,
        sendInvites: true,
        description: "Technical Interview with Vaigoo Innovations team."
      }
    );
    return event;
  } catch (err) {
    console.error("Calendar creation failed: " + err);
    return null;
  }
}

// --- HELPERS ---

function getSheet(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    // Add headers if new
    if (name === SHEET_NAME_SUBMISSIONS) {
       sheet.appendRow(['ID', 'Timestamp', 'Type', 'Name', 'Email', 'Phone', 'Payload', 'Employment', 'Duration', 'InternshipType', 'Resume', 'Status', 'InterviewDate', 'MeetLink', 'LastSent']);
    } else if (name === SHEET_NAME_POSITIONS) {
       sheet.appendRow(['ID', 'Title', 'Type']);
    }
  }
  return sheet;
}

function getSubmissions(type) {
  const rows = getSheet(SHEET_NAME_SUBMISSIONS).getDataRange().getValues();
  const data = rows.slice(1).map(r => ({
    id: r[0],
    createdAt: r[1],
    type: r[2],
    name: r[3],
    email: r[4],
    phone: r[5],
    payload: r[6],
    employmentType: r[7],
    duration: r[8],
    internshipType: r[9],
    resume: r[10],
    status: r[11],
    interviewDate: r[12],
    meetLink: r[13]
  }));
  
  if (type && type !== 'all') {
    return data.filter(d => d.type === type);
  }
  return data;
}

function response(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function sendEmail(to, subject, htmlBody) {
  try {
    MailApp.sendEmail({
      to: to,
      subject: subject,
      htmlBody: htmlBody
    });
  } catch (err) {
    console.error("Email sending failed: " + err);
  }
}

// --- PREMIUM EMAIL TEMPLATES ---

function getEmailBase(content) {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7f9fc; padding: 40px; color: #1a202c;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
        <div style="padding: 40px;">
          <div style="margin-bottom: 30px; font-weight: 800; font-size: 24px; color: #007bff;">Vaigoo <span style="color: #00d4ff;">Innovations</span></div>
          ${content}
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #edf2f7; font-size: 14px; color: #a0aec0;">
            &copy; ${new Date().getFullYear()} Vaigoo Innovations. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  `;
}

function getEmailTemplate(name, msg) {
  return getEmailBase(`
    <h2 style="font-size: 24px; font-weight: 700; margin-bottom: 20px;">Hi ${name},</h2>
    <p style="font-size: 16px; line-height: 1.6; color: #4a5568;">${msg}</p>
  `);
}

function getShortlistTemplate(name, date, link) {
  return getEmailBase(`
    <h2 style="font-size: 24px; font-weight: 700; margin-bottom: 20px;">You're Shortlisted! 🎉</h2>
    <p style="font-size: 16px; line-height: 1.6; color: #4a5568; margin-bottom: 30px;">
      Congratulations ${name}! We were impressed by your application and would like to invite you for a technical interview.
    </p>
    <div style="background-color: #f8fafc; border-radius: 16px; padding: 25px; margin-bottom: 30px; border: 1px solid #e2e8f0;">
      <div style="margin-bottom: 10px; font-size: 14px; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Interview Details</div>
      <div style="font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 4px;">📅 ${date.toLocaleDateString()} at ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
      <div style="font-size: 14px; color: #64748b;">Duration: 30 Minutes</div>
    </div>
    <a href="${link}" style="display: block; width: 100%; text-align: center; background-color: #007bff; color: #ffffff; padding: 16px 0; border-radius: 12px; font-weight: 700; text-decoration: none; font-size: 16px; box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);">Join Google Meet</a>
  `);
}

function getRejectionTemplate(name) {
  return getEmailBase(`
    <h2 style="font-size: 24px; font-weight: 700; margin-bottom: 20px;">Application Update</h2>
    <p style="font-size: 16px; line-height: 1.6; color: #4a5568; margin-bottom: 30px;">
      Hi ${name}, thank you for your interest in Vaigoo Innovations. While your profile was strong, we have decided to move forward with other candidates at this time.
    </p>
    <p style="font-size: 16px; line-height: 1.6; color: #4a5568; margin-bottom: 30px;">
      We encourage you to keep building and re-apply in the future as our needs evolve!
    </p>
    <a href="https://vaigoo-innovations.vercel.app/careers" style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 14px 28px; border-radius: 12px; font-weight: 700; text-decoration: none; font-size: 15px;">Apply Again</a>
  `);
}

// --- POSITION MANAGEMENT ---

function getPositions() {
  const rows = getSheet(SHEET_NAME_POSITIONS).getDataRange().getValues();
  return rows.slice(1).map(r => ({ id: r[0], title: r[1], type: r[2] }));
}

function handleManagePosition(data) {
  const sheet = getSheet(SHEET_NAME_POSITIONS);
  if (data.op === 'add') {
    sheet.appendRow([Utilities.getUuid(), data.title, data.type]);
    return response({ success: true });
  }
}
