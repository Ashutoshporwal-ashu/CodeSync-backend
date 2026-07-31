// src/templates/welcomeEmailTemplate.js

// Yeh ek function hai jo name lega aur poora HTML return karega
export const welcomeEmailHtml = (name) => {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f6f9fc; margin: 0; padding: 0;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f6f9fc; padding: 40px 0;">
                <tr>
                    <td align="center">
                        <table role="presentation" width="100%" max-width="600px" cellspacing="0" cellpadding="0" style="background-color: #ffffff; max-width: 600px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); overflow: hidden;">
                            <tr>
                                <td style="padding: 30px 40px; border-bottom: 1px solid #eaeaea; text-align: center;">
                                    <h1 style="margin: 0; font-size: 24px; color: #111827; font-weight: 700; letter-spacing: -0.5px;">CodeSync.</h1>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 40px;">
                                    <h2 style="margin-top: 0; font-size: 20px; color: #111827; font-weight: 600;">Hi ${name},</h2>
                                    <p style="font-size: 16px; line-height: 24px; color: #4b5563; margin-bottom: 24px;">
                                        Welcome to CodeSync. We're excited to have you on board.
                                    </p>
                                    <p style="font-size: 16px; line-height: 24px; color: #4b5563; margin-bottom: 32px;">
                                        Our platform is designed to help you streamline your workflow, manage your projects efficiently, and collaborate without friction. Everything you need is now set up.
                                    </p>
                                    <table role="presentation" cellspacing="0" cellpadding="0" style="margin-bottom: 32px;">
                                        <tr>
                                            <td align="center" style="border-radius: 6px; background-color: #000000;">
                                                <a href="http://localhost:3000/dashboard" target="_blank" style="font-size: 16px; font-weight: 500; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 6px; display: inline-block; border: 1px solid #000000;">Go to Dashboard</a>
                                            </td>
                                        </tr>
                                    </table>
                                    <p style="font-size: 16px; line-height: 24px; color: #4b5563; margin-bottom: 8px;">
                                        If you have any questions or need assistance, simply reply to this email. Our support team is always here to help.
                                    </p>
                                    <p style="font-size: 16px; line-height: 24px; color: #4b5563; margin: 0;">
                                        Best regards,<br><strong>The CodeSync Team</strong>
                                    </p>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 24px 40px; background-color: #f9fafb; text-align: center; border-top: 1px solid #eaeaea;">
                                    <p style="margin: 0; font-size: 12px; color: #6b7280; line-height: 18px;">
                                        © 2026 CodeSync Inc. All rights reserved.<br>
                                        You received this email because you signed up for a CodeSync account.
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
    `;
};