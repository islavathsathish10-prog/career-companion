# Connect MockPrepAI to Google Sheets

Since this is a client-side Vite (React) application, connecting directly to the Google Sheets API would expose your private keys. The standard workaround to safely save form data without a backend is using a Google Apps Script Web App as a webhook.

Follow these 3 easy steps as the website creator:

## 1. Create your Google Sheet
1. Go to [Google Sheets](https://sheets.google.com) and create a new blank spreadsheet.
2. Name it something like `MockPrep AI Results`.
3. In the first row (A1 to N1), create the following headers exactly (order doesn't matter, but spelling does):
   - `timestamp`
   - `name`
   - `email`
   - `phone`
   - `college`
   - `branch`
   - `graduationYear`
   - `company`
   - `aptitudeScore`
   - `technicalScore`
   - `hrScore`
   - `overallScore`
   - `correctAnswers`
   - `totalQuestions`
   - `accuracy`

## 2. Add the Webhook Script
1. In your Google Sheet, click **Extensions > Apps Script** in the top menu.
2. Delete any code in the editor and paste the following script:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Parse the incoming JSON data from our React app
    var data = JSON.parse(e.postData.contents);
    
    // Get the headers from the first row of your sheet
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    
    // Map the incoming data to the correct columns based on your headers
    var rowData = headers.map(function(header) {
      return data[header] !== undefined ? data[header] : "";
    });
    
    // Append the new row
    sheet.appendRow(rowData);
    
    // Return success response
    return ContentService.createTextOutput(JSON.stringify({ "status": "success" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Return error if something goes wrong
    return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// We add a doGet just in case you ever accidentally open the URL in a browser
function doGet(e) {
  return ContentService.createTextOutput("Webhook is running!");
}
```

## 3. Deploy and Connect
1. In the Apps Script editor, click **Deploy > New deployment** in the top right.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Under *Description*, type `V1` setup.
4. Under *Execute as*, select **Me** (your email).
5. Under *Who has access*, select **Anyone**. (This is critical, or the React app can't send data).
6. Click **Deploy**. (Google may ask you to click "Review Permissions" > choose your account > "Advanced" > "Go to script (unsafe)" and allow it).
7. Copy the generated **Web app URL**.

## 4. Add the URL to your project
Open the `.env` file in the root of the `career-companion` repository and paste your Web App URL into this variable:
```env
VITE_GOOGLE_SHEETS_WEBAPP_URL="https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec"
```

Restart your Vite development server (`npm run dev`), run through an interview, and watch your Google Sheet magically populate when reaching the Results dashboard!
