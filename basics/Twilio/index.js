const accountSid = 'your_twilio_account_sid';
const authToken = 'your_twilio_auth_token';
import twilio from 'twilio';

const client = twilio(accountSid, authToken);

// client.messages.create({
//     to: '+918652095488',
//     from: '+13098931421',
//     body: 'Hello from Node.js'
// }).then(message => console.log(message.sid));



// Send SMS function
const sendSMS = async (toPhoneNumber, messageBody) => {
    try {
      const message = await client.messages.create({
        to: toPhoneNumber, // Recipient's phone number at free plan can only send the sms to twilio verified number to send sms to non-verified user we need to upgrade to premium plane 
        from: '+130989xxxxx', // Your Twilio phone number
        body: messageBody, // Message content
      });
  
      console.log('Message sent successfully!', message.sid);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };


// Call the function to send SMS
sendSMS('+91932209xxxx', 'Hello, this is a production SMS sent using Node.js!');