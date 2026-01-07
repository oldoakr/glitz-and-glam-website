# 🎯 FREE Real-Time Booking System Setup Guide

## What You'll Get (100% FREE):
✅ Real-time slot availability (like BookMyShow)
✅ Prevents double booking automatically
✅ All bookings stored in Google Sheets
✅ Manage bookings from your phone/computer
✅ No monthly fees - completely FREE!

---

## 📋 STEP-BY-STEP SETUP (10 minutes):

### STEP 1: Create Google Sheet (2 minutes)

1. Go to: https://sheets.google.com
2. Click "Blank" to create new sheet
3. Rename it to: **Glitz & Glam Bookings**
4. In Row 1, add these headers:
   ```
   A1: Timestamp
   B1: Name
   C1: Phone
   D1: Email
   E1: Service
   F1: Price
   G1: Date
   H1: Time
   I1: Status
   ```

### STEP 2: Create Google Apps Script (3 minutes)

1. In your Google Sheet, click **Extensions** → **Apps Script**
2. Delete any existing code
3. Copy and paste this code:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    
    // Check if slot is already booked
    const bookings = sheet.getDataRange().getValues();
    for (let i = 1; i < bookings.length; i++) {
      if (bookings[i][6] === data.date && bookings[i][7] === data.time) {
        return ContentService.createTextOutput(JSON.stringify({
          success: false,
          message: 'This slot is already booked'
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    // Add booking
    sheet.appendRow([
      new Date(),
      data.name,
      data.phone,
      data.email,
      data.service,
      data.price,
      data.date,
      data.time,
      'Confirmed'
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Booking confirmed'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const date = e.parameter.date;
    
    const bookings = sheet.getDataRange().getValues();
    const bookedSlots = [];
    
    for (let i = 1; i < bookings.length; i++) {
      if (bookings[i][6] === date) {
        bookedSlots.push(bookings[i][7]);
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      bookedSlots: bookedSlots
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

4. Click **Save** (disk icon)
5. Click **Deploy** → **New deployment**
6. Click **Select type** → **Web app**
7. Set:
   - **Execute as:** Me
   - **Who has access:** Anyone
8. Click **Deploy**
9. Click **Authorize access** → Select your Google account → **Allow**
10. **COPY THE WEB APP URL** (looks like: https://script.google.com/macros/s/ABC123.../exec)

---

### STEP 3: Update Your Website (5 minutes)

**I'll update your website code now with the Google Sheets integration.**

**After I update, you need to:**
1. Replace `YOUR_GOOGLE_SCRIPT_URL_HERE` with your actual script URL
2. Deploy to Vercel

---

## 🎯 How It Works:

1. **Customer visits website** → Sees available slots (green)
2. **Customer selects slot** → System checks Google Sheet in real-time
3. **If available** → Booking confirmed, added to Google Sheet
4. **If booked** → Shows "Already booked, choose another slot"
5. **You manage** → Open Google Sheet on phone/computer anytime

---

## 📱 Managing Bookings:

**From Google Sheets, you can:**
- ✅ View all bookings
- ✅ Change Status (Confirmed/Completed/Cancelled)
- ✅ Add notes
- ✅ Filter by date
- ✅ Export to Excel
- ✅ Share with staff

---

## 💡 Benefits:

✅ **100% FREE** - No monthly costs
✅ **Real-time** - Updates instantly
✅ **Prevents double booking** - Automatic
✅ **Mobile friendly** - Manage from anywhere
✅ **Backup** - Google saves everything
✅ **Easy to use** - Just like Excel

---

## Need Help?
After you get the Google Script URL, share it with me and I'll integrate it!
