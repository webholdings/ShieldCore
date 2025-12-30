import { MagicLinkToken } from "@shared/schema";
import { getEmailTranslation, emailTranslations, EmailLanguage } from "./i18n";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(options: EmailOptions): Promise<void> {
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
          email: "support@creativewaves.me"
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
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

export async function sendMagicLinkEmail(email: string, magicLink: MagicLinkToken, language: string = 'en'): Promise<void> {
  const validLang = ['en', 'de', 'fr', 'pt'].includes(language) ? language as EmailLanguage : 'en';
  const t = emailTranslations[validLang].magicLink;

  // Determine base URL for magic link
  // Priority: APP_URL > REPLIT_DOMAINS > REPLIT_DEV_DOMAIN > localhost
  let baseUrl = 'https://app2.creativewaves.me';

  if (process.env.APP_URL) {
    // Explicit URL set - use this (allows custom domains like app2.creativewaves.me)
    baseUrl = process.env.APP_URL;
  } else if (process.env.REPLIT_DOMAINS) {
    // Deployed app - use first domain from REPLIT_DOMAINS
    const domains = process.env.REPLIT_DOMAINS.split(',');
    baseUrl = `https://${domains[0].trim()}`;
  } else if (process.env.REPLIT_DEV_DOMAIN) {
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
    <body style="font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f4f4f4;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; margin-top: 20px; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
        <!-- Header -->
        <tr>
          <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: 0.5px;">CreativeWaves</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">${t.subtitle}</p>
          </td>
        </tr>

        <!-- Content -->
        <tr>
          <td style="padding: 40px 30px;">
            <h2 style="color: #2d3748; margin-top: 0; font-size: 22px; text-align: center;">${t.greeting}</h2>
            
            <p style="font-size: 16px; color: #4a5568; text-align: center; margin-bottom: 30px;">
              ${t.instruction}
            </p>
            
            <div style="text-align: center; margin: 35px 0;">
              <a href="${magicLinkUrl}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        padding: 16px 48px; 
                        text-decoration: none; 
                        border-radius: 50px; 
                        font-size: 18px; 
                        font-weight: bold; 
                        display: inline-block;
                        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
                        transition: transform 0.2s;">
                ${t.buttonText}
              </a>
            </div>
            
            <div style="background-color: #f7fafc; padding: 20px; border-radius: 8px; margin-top: 30px;">
              <p style="font-size: 14px; color: #718096; margin: 0; text-align: center;">
                ${t.orCopy}<br>
                <a href="${magicLinkUrl}" style="color: #667eea; word-break: break-all; display: block; margin-top: 5px;">${magicLinkUrl}</a>
              </p>
            </div>

            <div style="margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
               <p style="font-size: 13px; color: #a0aec0; text-align: center; margin: 0;">
                 ${t.disclaimer}
               </p>
            </div>
          </td>
        </tr>
        
        <!-- Footer -->
        <tr>
          <td style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="font-size: 12px; color: #a0aec0; margin: 0;">
              &copy; ${new Date().getFullYear()} CreativeWaves. All rights reserved.
            </p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  await sendEmail({
    to: email,
    subject: t.subject,
    html,
  });
}

export async function sendWelcomeEmail(email: string, language: string = 'en'): Promise<void> {
  const validLang = ['en', 'de', 'fr', 'pt'].includes(language) ? language as EmailLanguage : 'en';
  const t = emailTranslations[validLang].welcome;

  // Determine base URL for login link
  // Priority: APP_URL > REPLIT_DOMAINS > REPLIT_DEV_DOMAIN > localhost
  let baseUrl = 'https://app2.creativewaves.me';

  if (process.env.APP_URL) {
    // Explicit URL set - use this (allows custom domains like app2.creativewaves.me)
    baseUrl = process.env.APP_URL;
  } else if (process.env.REPLIT_DOMAINS) {
    // Deployed app - use first domain from REPLIT_DOMAINS
    const domains = process.env.REPLIT_DOMAINS.split(',');
    baseUrl = `https://${domains[0].trim()}`;
  } else if (process.env.REPLIT_DEV_DOMAIN) {
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
        
        <p style="font-size: 16px;">${t.instruction}</p>
        
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
            ${t.buttonText}
          </a>
        </div>
        
        <p style="font-size: 14px; color: #666; margin-top: 30px; text-align: center;">
          <strong>${(t as any).emailLabel || 'Email'}:</strong> ${email}
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

export async function sendSleepWelcomeEmail(email: string, language: string = 'en'): Promise<void> {
  const validLang = ['en', 'de', 'fr', 'pt'].includes(language) ? language as EmailLanguage : 'en';
  const t = emailTranslations[validLang].sleepWelcome;

  // Determine base URL for login link
  let baseUrl = 'https://app2.creativewaves.me';

  if (process.env.APP_URL) {
    baseUrl = process.env.APP_URL;
  } else if (process.env.REPLIT_DOMAINS) {
    const domains = process.env.REPLIT_DOMAINS.split(',');
    baseUrl = `https://${domains[0].trim()}`;
  } else if (process.env.REPLIT_DEV_DOMAIN) {
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
    <body style="font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f4f4f4;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; margin-top: 20px; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
        <!-- Header -->
        <tr>
          <td style="background: linear-gradient(135deg, #1a237e 0%, #311b92 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: 0.5px;">SleepWaves</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">${t.subtitle}</p>
          </td>
        </tr>

        <!-- Content -->
        <tr>
          <td style="padding: 40px 30px;">
            <h2 style="color: #2d3748; margin-top: 0; font-size: 22px; text-align: center;">${t.greeting}</h2>
            
            <p style="font-size: 16px; color: #4a5568; text-align: center; margin-bottom: 30px;">
              ${t.instruction}
            </p>
            
            <div style="text-align: center; margin: 35px 0;">
              <a href="${loginUrl}" 
                 style="background: linear-gradient(135deg, #1a237e 0%, #311b92 100%); 
                        color: white; 
                        padding: 16px 48px; 
                        text-decoration: none; 
                        border-radius: 50px; 
                        font-size: 18px; 
                        font-weight: bold; 
                        display: inline-block;
                        box-shadow: 0 4px 15px rgba(49, 27, 146, 0.4);
                        transition: transform 0.2s;">
                ${t.buttonText}
              </a>
            </div>
            
            <p style="font-size: 14px; color: #718096; margin-top: 30px; text-align: center;">
              <strong>${(t as any).emailLabel || 'Email'}:</strong> ${email}
            </p>
            
            <div style="margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 30px;">
              <h3 style="color: #2d3748; margin-bottom: 20px; text-align: center; font-size: 18px;">${t.subscriptionTitle}</h3>
              <ul style="font-size: 15px; color: #4a5568; line-height: 1.8; list-style-type: none; padding: 0;">
                <li style="margin-bottom: 12px; padding-left: 25px; position: relative;">
                  <span style="color: #311b92; position: absolute; left: 0; font-weight: bold;">✓</span> ${t.feature1}
                </li>
                <li style="margin-bottom: 12px; padding-left: 25px; position: relative;">
                  <span style="color: #311b92; position: absolute; left: 0; font-weight: bold;">✓</span> ${t.feature2}
                </li>
                <li style="margin-bottom: 12px; padding-left: 25px; position: relative;">
                  <span style="color: #311b92; position: absolute; left: 0; font-weight: bold;">✓</span> ${t.feature3}
                </li>
                <li style="margin-bottom: 12px; padding-left: 25px; position: relative;">
                  <span style="color: #311b92; position: absolute; left: 0; font-weight: bold;">✓</span> ${t.feature4}
                </li>
                <li style="margin-bottom: 12px; padding-left: 25px; position: relative;">
                  <span style="color: #311b92; position: absolute; left: 0; font-weight: bold;">✓</span> ${t.feature5}
                </li>
              </ul>
            </div>
            
            <div style="margin-top: 30px; padding: 20px; background-color: #f7fafc; border-radius: 8px;">
               <p style="margin: 0; font-size: 14px; color: #718096; text-align: center;">
                 <strong>${t.multilingualTitle}</strong><br>
                 ${t.multilingualText}
               </p>
            </div>

            <div style="margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
               <p style="font-size: 13px; color: #a0aec0; text-align: center; margin: 0;">
                 ${t.disclaimer}
               </p>
            </div>
          </td>
        </tr>
        
        <!-- Footer -->
        <tr>
          <td style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="font-size: 12px; color: #a0aec0; margin: 0;">
              &copy; ${new Date().getFullYear()} SleepWaves. All rights reserved.
            </p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  await sendEmail({
    to: email,
    subject: t.subject,
    html,
  });
}
