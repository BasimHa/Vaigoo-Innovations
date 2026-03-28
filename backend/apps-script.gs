/**
 * VAIGOO INNOVATIONS - ADVANCED ADMIN SCRIPT
 * 
 * INSTRUCTIONS:
 * 1. Open your Google Sheet.
 * 2. Extensions > Apps Script.
 * 3. Replace all code with this.
 * 4. IMPORTANT: Change the SHEET_NAME below to match your tab (e.g. "Career(Response)").
 * 5. Deploy > New Deployment > Web App (Me / Anyone).
 */

const CONFIG = {
  // !!! UPDATE THIS NAME FOR EACH OF YOUR 3 SCRIPTS !!!
  SHEET_NAME: "Career(Response)" 
};

function doGet(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
    
    // Fallback if name mismatch
    if (!sheet) {
      sheet = ss.getSheets()[0];
    }

    const data = sheet.getDataRange().getDisplayValues();
    
    if (data.length <= 1) {
      return createJsonResponse({ data: [] });
    }

    const headers = data[0].map(h => h.trim());
    const items = data.slice(1).map((row, index) => {
      let obj = { _rowIndex: index + 2 };
      headers.forEach((h, i) => {
        let cleanHeader = h.replace(/[^a-zA-Z0-9 ]/g, "").trim();
        obj[cleanHeader] = row[i];
      });
      return obj;
    });

    return createJsonResponse({ data: items });
  } catch (err) {
    return createJsonResponse({ error: "Check if Sheet Name exists: " + err.toString() }, 500);
  }
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(CONFIG.SHEET_NAME) || ss.getSheets()[0];
    
    const data = sheet.getDataRange().getValues();
    const headers = data[0].map(h => h.trim());
    
    const emailIdx = headers.findIndex(h => h.toLowerCase() === 'email');
    const statusIdx = headers.findIndex(h => h.toLowerCase() === 'status');
    const lastSentIdx = headers.findIndex(h => h.toLowerCase() === 'last sent status');
    const nameIdx = headers.findIndex(h => h.toLowerCase() === 'name');
    
    const intDateIdx = headers.findIndex(h => h.toLowerCase() === 'interview date');
    const meetLinkIdx = headers.findIndex(h => h.toLowerCase() === 'meeting link');

    if (emailIdx === -1 || statusIdx === -1 || lastSentIdx === -1) {
      return createJsonResponse({ error: 'Missing Required Columns' }, 400);
    }

    const targetEmail = body.email.toLowerCase();
    let rowIndex = -1;
    let currentRowData = null;

    for (let i = data.length - 1; i >= 1; i--) {
      if (data[i][emailIdx] && data[i][emailIdx].toString().toLowerCase() === targetEmail) {
        rowIndex = i + 1;
        currentRowData = data[i];
        break;
      }
    }

    if (rowIndex === -1) return createJsonResponse({ error: 'Email not found' }, 404);

    const currentLastSent = currentRowData[lastSentIdx];
    const newStatus = body.status;
    const name = nameIdx !== -1 ? currentRowData[nameIdx] : 'Applicant';

    sheet.getRange(rowIndex, statusIdx + 1).setValue(newStatus);
    
    if (intDateIdx !== -1 && body.interviewDate) sheet.getRange(rowIndex, intDateIdx + 1).setValue(body.interviewDate);
    if (meetLinkIdx !== -1 && body.meetLink) sheet.getRange(rowIndex, meetLinkIdx + 1).setValue(body.meetLink);

    sheet.getRange(rowIndex, statusIdx + 1).setValue(newStatus);
    
    if (intDateIdx !== -1 && body.interviewDate) sheet.getRange(rowIndex, intDateIdx + 1).setValue(body.interviewDate);
    if (meetLinkIdx !== -1 && body.meetLink) sheet.getRange(rowIndex, meetLinkIdx + 1).setValue(body.meetLink);

    // No longer sending auto-reply emails as per user request
    if (lastSentIdx !== -1) {
      sheet.getRange(rowIndex, lastSentIdx + 1).setValue(newStatus);
    }

    return createJsonResponse({ success: true, message: 'Status updated successfully' });

  } catch (error) {
    return createJsonResponse({ error: error.toString() }, 500);
  }
}

function createJsonResponse(obj, statusCode = 200) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
