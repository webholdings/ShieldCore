
import axios from 'axios';

// Reusing the BREVO_API_KEY from env - make sure to set this in Firebase Functions config
// firebase functions:config:set shieldcore.brevo_key="YOUR_KEY"
// or process.env.BREVO_API_KEY if deployed with .env

export async function sendBreachNotification(email: string, breachCount: number) {
    const apiKey = process.env.BREVO_API_KEY;

    if (!apiKey) {
        console.error("BREVO_API_KEY is missing. Cannot send notification.");
        return;
    }

    const subject = `⚠️ Security Alert: ${breachCount} data breaches found`;
    const htmlContent = `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h1 style="color: #d32f2f;">ShieldCore Security Alert</h1>
      <p>We detected that your email address <strong>${email}</strong> has appeared in <strong>${breachCount}</strong> known data breaches.</p>
      
      <div style="background-color: #ffebee; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p style="margin: 0; font-weight: bold;">Action Required:</p>
        <ul style="margin-top: 10px;">
          <li>Change your password immediately on affected sites.</li>
          <li>Enable Two-Factor Authentication (2FA) wherever possible.</li>
          <li>Check your ShieldCore Dashboard for full details.</li>
        </ul>
      </div>

      <a href="https://app2.creativewaves.me/results" style="display: inline-block; background-color: #1E3A8A; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">View Breach Details</a>
    </div>
  `;

    try {
        await axios.post("https://api.brevo.com/v3/smtp/email", {
            sender: { name: "ShieldCore Security", email: "security@creativewaves.me" },
            to: [{ email }],
            subject,
            htmlContent
        }, {
            headers: {
                'api-key': apiKey,
                'content-type': 'application/json',
                'accept': 'application/json'
            }
        });
        console.log(`Notification sent to ${email}`);
    } catch (error) {
        console.error("Failed to send notification email:", error);
    }
}
