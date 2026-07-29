import nodemailer from "nodemailer";

export const sendVerificationEmail = async (email, verificationCode) => {
    try {
        // 1. Transporter banayein (Yeh humara 'Dakiya' hai jo Gmail ka server use karega)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, // e.g., aapki.email@gmail.com
                pass: process.env.EMAIL_PASS  // 16-digit App Password
            }
        });

        // 2. Email ka content design karein (HTML support karta hai)
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email, // Jisko OTP bhejna hai
            subject: "Verify your Email - CodeSync",
            html: `
                <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
                    <h2>Welcome to CodePair!</h2>
                    <p>Thank you for registering. Your email verification code is:</p>
                    <h1 style="color: #4CAF50; letter-spacing: 5px; font-size: 40px;">${verificationCode}</h1>
                    <p>This code is valid for <strong>15 minutes</strong>.</p>
                    <p>If you did not request this, please ignore this email.</p>
                </div>
            `
        };

        // 3. Email bhej dein
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully to:", email);
        return info;

    } catch (error) {
        console.log("Error while sending email:", error);
        // Agar email fail ho jaye, toh hum error phek denge taaki controller ko pata chal jaye
        throw new Error("Could not send verification email");
    }
};