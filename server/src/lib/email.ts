import { readFileSync } from "fs";
import mailer from "nodemailer";

interface AccountEmailOptions {
    subject: string;
    message: string;
    buttonLabel: string;
    buttonUrl: string;
}

const accountEmailTemplate = readFileSync(
    "server/src/resources/account.html", "utf-8"
);

export async function sendAutomatedEmail(
    recipient: string,
    subject: string,
    content: string,
    plaintextFallback?: string
) {
    const transporter = mailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_ACCOUNT,
            pass: process.env.AUTOMATED_EMAIL_KEY
        }
    });

    await transporter.sendMail({
        from: `"WintrChess No-Reply" <${process.env.AUTOMATED_EMAIL_ADDRESS}>`,
        to: recipient,
        subject: subject,
        text: plaintextFallback,
        html: content
    });
}

export function generateAccountEmail(options: AccountEmailOptions) {
    if (!process.env.ORIGIN || !process.env.EMAIL_ACCOUNT) {
        throw new Error("origin or email account variable missing.");
    }

    return accountEmailTemplate
        .replace(/\${SUBJECT}/gi, options.subject)
        .replace(/\${ORIGIN}/gi, process.env.ORIGIN)
        .replace(/\${MESSAGE}/gi, options.message)
        .replace(/\${VERIFICATION_URL}/gi, options.buttonUrl)
        .replace(/\${BUTTON_LABEL}/gi, options.buttonLabel)
        .replace(/\${EMAIL_ACCOUNT}/gi, process.env.EMAIL_ACCOUNT)
        .replace(
            /\${COPYRIGHT_YEAR}/gi,
            new Date().getFullYear().toString()
        );
}