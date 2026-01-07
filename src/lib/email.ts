import nodemailer from "nodemailer";

// Create a transporter using Mailpit defaults (or env vars)
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "localhost",
    port: parseInt(process.env.SMTP_PORT || "1025"),
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER || "",
        pass: process.env.SMTP_PASS || "",
    },
});

export const sendPasswordResetEmail = async (email: string, token: string) => {
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/new-password?token=${token}`;

    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Reset Your Password</h2>
        <p>You requested a password reset for your BerandAI account.</p>
        <p>Click the button below to reset your password. This link is valid for 1 hour.</p>
        <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background-color: #6d28d9; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">Reset Password</a>
        <p>If you didn't request this, you can safely ignore this email.</p>
        <p style="font-size: 12px; color: #666; margin-top: 24px;">Link: ${resetLink}</p>
    </div>
    `;

    try {
        const info = await transporter.sendMail({
            from: '"BerandAI" <noreply@berandai.com>',
            to: email,
            subject: "Reset Your Password - BerandAI",
            html,
        });
        console.log("Message sent: %s", info.messageId);
        return { success: true };
    } catch (error) {
        console.error("Error sending email:", error);
        return { success: false, error };
    }
};
