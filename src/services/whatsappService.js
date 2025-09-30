// whatsappService.js
export async function sendWhatsAppNotification(to, message) {
    const TWILIO_ACCOUNT_SID = 'YOUR_ACCOUNT_SID';
    const TWILIO_AUTH_TOKEN = 'YOUR_AUTH_TOKEN';
    const TWILIO_WHATSAPP_NUMBER = 'whatsapp:+14155238886'; // Twilio Sandbox
  
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`),
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          From: TWILIO_WHATSAPP_NUMBER,
          To: `whatsapp:${to}`,
          Body: message
        })
      }
    );
  
    return response.json();
  }