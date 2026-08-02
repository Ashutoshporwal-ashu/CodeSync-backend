import nodemailer from "nodemailer";

export const sendForgotPasswordEmail = async (email, resetUrl) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST, // e.g., smtp.gmail.com
            port: process.env.MAIL_PORT,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Email ka Professional HTML Design
        const mailOptions = {
            from: process.env.MAIL_USER,
            to: email,
            subject: "CodeSync - Reset Your Password",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.05);">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h1 style="color: #2c3e50; margin: 0;">CodeSync</h1>
                        <p style="color: #7f8c8d; font-size: 14px; margin-top: 5px;">Secure Password Reset</p>
                    </div>
                    
                    <p style="color: #333; font-size: 16px; line-height: 1.5;">Hello,</p>
                    <p style="color: #333; font-size: 16px; line-height: 1.5;">We received a request to reset the password for your CodeSync account. Please click the button below to choose a new password. This link is valid for <strong>15 minutes</strong> only.</p>
                    
                    <div style="text-align: center; margin: 35px 0;">
                        <a href="${resetUrl}" style="background-color: #3498db; color: #ffffff; padding: 14px 28px; text-decoration: none; font-size: 16px; border-radius: 6px; font-weight: bold; display: inline-block;">
                            Reset My Password
                        </a>
                    </div>
                    
                    <p style="color: #555; font-size: 14px; line-height: 1.5;">If the button doesn't work, copy and paste this link directly into your browser:</p>
                    <div style="background-color: #f8f9fa; padding: 10px; border-radius: 5px; word-break: break-all;">
                        <a href="${resetUrl}" style="color: #3498db; font-size: 14px;">${resetUrl}</a>
                    </div>
                    
                    <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 30px 0;">
                    <p style="color: #95a5a6; font-size: 12px; text-align: center; line-height: 1.5;">If you didn't request a password reset, you can safely ignore this email. Your account remains secure.</p>
                </div>
            `
        };

        // Mail bhejo
        const info = await transporter.sendMail(mailOptions);
        console.log("Forgot Password email sent successfully: ", info.messageId);
        
        return info;

    } catch (error) {
        console.error("Error sending forgot password email:", error.message);
        throw error; // Taki pichla controller is error ko catch karke DB se token delete kar sake
    }
};