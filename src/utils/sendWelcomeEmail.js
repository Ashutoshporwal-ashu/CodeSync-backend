import nodemailer from "nodemailer";
import { welcomeEmailHtml } from "./welcomeEmailTemplate.js";

// 1. THE ENGINE: Yeh wahi same setup hai jo OTP me use kiya tha
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,       // Aapki email
        pass: process.env.EMAIL_PASS  // Aapka 16-digit App password ya OAuth setup
    }
});

export const sendWelcomeEmail = async (email, name) => {
    try {
        // Sirf content change hua hai
        const mailOptions = {
            from: process.env.EMAIL_USER, // company email
            to: email, // user email
            subject: "Welcome to CodeSync! 🚀",
            html: welcomeEmailHtml(name)
        };

        await transporter.sendMail(mailOptions);
        console.log(`Welcome email successfully sent to ${email}`);
        
    } catch (error) {
        console.log("Welcome email bhejne me error aayi:", error);
    }
};