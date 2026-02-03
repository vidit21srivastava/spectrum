import nodemailer from "nodemailer";

type SendEmailInput = {
    to: string;
    subject: string;
    text?: string;
    html?: string;
};

const getTransporter = () => {
    const host = process.env.SMTP_HOST;
    if (!host) {
        return null;
    }

    const port = Number(process.env.SMTP_PORT ?? 587);
    const secure = process.env.SMTP_SECURE === "true";

    return nodemailer.createTransport({
        host,
        port,
        secure,
        auth: process.env.SMTP_USER
            ? {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            }
            : undefined,
    });
};

export const sendEmail = async ({ to, subject, text, html }: SendEmailInput) => {
    const transporter = getTransporter();
    if (!transporter) {
        console.warn("SMTP not configured. Email not sent.", { to, subject });
        return;
    }

    const from = process.env.EMAIL_FROM ?? "no-reply@spectrum.app";

    await transporter.sendMail({
        from,
        to,
        subject,
        text,
        html,
    });
};
