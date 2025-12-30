import { emailTranslations } from "./i18n";
export async function sendEmail(options) {
  const brevoApiKey = process.env.BREVO_API_KEY;
  if (!brevoApiKey) {
    console.error("BREVO_API_KEY is not configured");
    throw new Error("Email service not configured");
  }
  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": brevoApiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: {
          name: "CreativeWaves",
          email: "noreply@creativewaves.me"
        },
        to: [
          {
            email: options.to,
          }
        ],
        subject: options.subject,
        htmlContent: options.html,
      }),
    });
    if (!response.ok) {
      const error = await response.text();
      console.error("Brevo API error:", error);
      throw new Error("Failed to send email");
    }
    console.log(`Email sent successfully to ${options.to}`);
  }
  catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}
export async function sendMagicLinkEmail(email, magicLink, language = 'en') {
  const validLang = ['en', 'de', 'fr', 'pt'].includes(language) ? language : 'en';
  const t = emailTranslations[validLang].magicLink;
  // Determine base URL for magic link
  // Priority: APP_URL > REPLIT_DOMAINS > REPLIT_DEV_DOMAIN > localhost
  let baseUrl = 'https://app2.creativewaves.me';
  if (process.env.APP_URL) {
    // Explicit URL set - use this (allows custom domains like app2.creativewaves.me)
    baseUrl = process.env.APP_URL;
  }
  else if (process.env.REPLIT_DOMAINS) {
    // Deployed app - use first domain from REPLIT_DOMAINS
    const domains = process.env.REPLIT_DOMAINS.split(',');
    baseUrl = `https://${domains[0].trim()}`;
  }
  else if (process.env.REPLIT_DEV_DOMAIN) {
    // Development mode
    baseUrl = `https://${process.env.REPLIT_DEV_DOMAIN}`;
  }
  const magicLinkUrl = `${baseUrl}/api/auth/verify-magic-link?token=${magicLink.token}`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${t.title}</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">${t.title}</h1>
        <p style="color: #f0f0f0; margin: 10px 0 0 0;">${t.subtitle}</p>
      </div>
      
      <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
        <h2 style="color: #333; margin-top: 0;">${t.greeting}</h2>
        
        <p style="font-size: 16px;">${t.instruction}</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${magicLinkUrl}" 
             style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                    color: white; 
                    padding: 15px 40px; 
                    text-decoration: none; 
                    border-radius: 50px; 
                    font-size: 18px; 
                    font-weight: bold; 
                    display: inline-block;
                    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
            ${t.buttonText}
          </a>
        </div>
        
        <p style="font-size: 14px; color: #666; margin-top: 30px;">
          ${t.orCopy}<br>
          <a href="${magicLinkUrl}" style="color: #667eea; word-break: break-all;">${magicLinkUrl}</a>
        </p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
          <p style="font-size: 14px; color: #666;">
            <strong>${t.whatsNext}</strong><br>
            ${t.whatsNextIntro}
          </p>
          <ul style="font-size: 14px; color: #666;">
            <li>${t.feature1}</li>
            <li>${t.feature2}</li>
            <li>${t.feature3}</li>
            <li>${t.feature4}</li>
            <li>${t.feature5}</li>
          </ul>
        </div>
        
        <div style="margin-top: 30px; padding: 15px; background: #fff; border-left: 4px solid #667eea; border-radius: 5px;">
          <p style="margin: 0; font-size: 14px; color: #666;">
            <strong>${t.needHelp}</strong> ${t.contactUs} <a href="mailto:support@creativewaves.me" style="color: #667eea;">support@creativewaves.me</a>
          </p>
        </div>
        
        <p style="font-size: 12px; color: #999; margin-top: 30px; text-align: center;">
          ${t.disclaimer}
        </p>
      </div>
    </body>
    </html>
  `;
  await sendEmail({
    to: email,
    subject: t.subject,
    html,
  });
}
export async function sendWelcomeEmail(email, language = 'en') {
  const validLang = ['en', 'de', 'fr', 'pt'].includes(language) ? language : 'en';
  const t = emailTranslations[validLang].welcome;
  // Determine base URL for login link
  // Priority: APP_URL > REPLIT_DOMAINS > REPLIT_DEV_DOMAIN > localhost
  let baseUrl = 'https://app2.creativewaves.me';
  if (process.env.APP_URL) {
    // Explicit URL set - use this (allows custom domains like app2.creativewaves.me)
    baseUrl = process.env.APP_URL;
  }
  else if (process.env.REPLIT_DOMAINS) {
    // Deployed app - use first domain from REPLIT_DOMAINS
    const domains = process.env.REPLIT_DOMAINS.split(',');
    baseUrl = `https://${domains[0].trim()}`;
  }
  else if (process.env.REPLIT_DEV_DOMAIN) {
    // Development mode
    baseUrl = `https://${process.env.REPLIT_DEV_DOMAIN}`;
  }
  const loginUrl = `${baseUrl}/auth`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${t.title}</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">${t.title}</h1>
        <p style="color: #f0f0f0; margin: 10px 0 0 0;">${t.subtitle}</p>
      </div>
      
      <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
        <h2 style="color: #333; margin-top: 0;">${t.greeting}</h2>
        
        <p style="font-size: 16px;">Your account is now active! Simply enter your email address to access your cognitive wellness journey.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${loginUrl}" 
             style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                    color: white; 
                    padding: 15px 40px; 
                    text-decoration: none; 
                    border-radius: 50px; 
                    font-size: 18px; 
                    font-weight: bold; 
                    display: inline-block;
                    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
            Access Your Account
          </a>
        </div>
        
        <p style="font-size: 14px; color: #666; margin-top: 30px; text-align: center;">
          <strong>Your email:</strong> ${email}
        </p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
          <h3 style="color: #333; margin-bottom: 15px;">${t.subscriptionTitle}</h3>
          <ul style="font-size: 14px; color: #666; line-height: 1.8;">
            <li>${t.feature1}</li>
            <li>${t.feature2}</li>
            <li>${t.feature3}</li>
            <li>${t.feature4}</li>
            <li>${t.feature5}</li>
          </ul>
        </div>
        
        <div style="margin-top: 30px; padding: 15px; background: #fff; border-left: 4px solid #667eea; border-radius: 5px;">
          <p style="margin: 0; font-size: 14px; color: #666;">
            <strong>${t.multilingualTitle}</strong> ${t.multilingualText}
          </p>
        </div>
        
        <div style="margin-top: 20px; padding: 15px; background: #fff; border-left: 4px solid #764ba2; border-radius: 5px;">
          <p style="margin: 0; font-size: 14px; color: #666;">
            <strong>${t.needAssistance}</strong> ${t.supportText} <a href="mailto:support@creativewaves.me" style="color: #667eea;">support@creativewaves.me</a>
          </p>
        </div>
        
        <p style="font-size: 12px; color: #999; margin-top: 30px; text-align: center;">
          ${t.disclaimer} <a href="https://${t.buyLink}" style="color: #667eea;">${t.buyLink}</a>
        </p>
      </div>
    </body>
    </html>
  `;
  await sendEmail({
    to: email,
    subject: t.subject,
    html,
  });
}
//# sourceMappingURL=email.js.map