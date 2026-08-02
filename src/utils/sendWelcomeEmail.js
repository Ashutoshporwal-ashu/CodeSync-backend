import nodemailer from "nodemailer";
import { welcomeEmailHtml } from "./welcomeEmailTemplate.js";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,       // Aapki email
        pass: process.env.EMAIL_PASS  // Aapka 16-digit App password ya OAuth setup
    }
});

export const sendWelcomeEmail = async (email, name) => {
    try {
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