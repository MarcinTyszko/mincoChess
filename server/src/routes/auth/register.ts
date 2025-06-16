import express, { Router, Response } from "express";
import { StatusCodes } from "http-status-codes";
import z from "zod";
import { readFileSync } from "fs";
import { createHash, randomBytes } from "crypto";
import { hashSync } from "bcrypt";
import mailer from "nodemailer";

import { AccountError } from "wintrchess";
import Account from "@database/models/account/Account";
import AccountVerification from "@database/models/account/AccountVerification";

const path = "/register";

const router = Router();

const verificationEmailTemplate = readFileSync(
    "server/resources/verification.html", "utf-8"
);

const registerRequestSchema = z.object({
    email: z.string().email(AccountError.INVALID_EMAIL),
    username: z.string()
        .min(3, AccountError.USERNAME_TOO_SHORT)
        .max(32, AccountError.USERNAME_TOO_LONG),
    password: z.string()
        .min(8, AccountError.PASSWORD_TOO_SHORT)
        .max(128, AccountError.PASSWORD_TOO_LONG)
});

function reject(res: Response, reason: AccountError) {
    res.status(StatusCodes.BAD_REQUEST).send(reason);
}

router.use(path, express.json());

router.post(path, async (req, res) => {
    if (
        !process.env.ORIGIN
        || !process.env.EMAIL_ACCOUNT
        || !process.env.AUTOMATED_EMAIL_ADDRESS
        || !process.env.AUTOMATED_EMAIL_KEY
    ) return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);

    const registration: z.infer<typeof registerRequestSchema> = req.body;

    const parseAttempt = registerRequestSchema.safeParse(registration);
    const issue = parseAttempt.error?.issues.at(0)?.message;

    if (issue) return reject(res, issue as AccountError);

    // Ensure no existing account
    const existingAccount = await Account.findOne({
        $or: [
            { email: registration.email },
            { username: registration.username }
        ]
    });

    if (existingAccount) {
        return reject(res, AccountError.ACCOUNT_ALREADY_EXISTS);
    }

    // Create verification and send email
    const verificationId = randomBytes(128).toString("base64url");

    await AccountVerification.insertOne({
        id: createHash("sha256").update(verificationId).digest("hex"),
        email: registration.email,
        username: registration.username,
        password: hashSync(registration.password, 10),
        createdAt: new Date()
    });

    const transporter = mailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_ACCOUNT,
            pass: process.env.AUTOMATED_EMAIL_KEY
        }
    });

    const verificationUrl = (
        `${process.env.ORIGIN}/auth/verify?id=${verificationId}`
    );

    transporter.sendMail({
        from: `"WintrChess No-Reply" <${process.env.AUTOMATED_EMAIL_ADDRESS}>`,
        to: registration.email,
        subject: "Verify your WintrChess account",
        text: `Please verify your WintrChess account: ${verificationUrl}`,
        html: verificationEmailTemplate
            .replace(/\${ORIGIN}/gi, process.env.ORIGIN)
            .replace(/\${VERIFICATION_URL}/gi, verificationUrl)
            .replace(/\${EMAIL_ACCOUNT}/gi, process.env.EMAIL_ACCOUNT)
            .replace(
                /\${COPYRIGHT_YEAR}/gi,
                new Date().getFullYear().toString()
            )
    });

    res.sendStatus(StatusCodes.OK);
});

export default router;