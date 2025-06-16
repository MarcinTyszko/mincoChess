import express, { Router } from "express";
import { StatusCodes } from "http-status-codes";
import z from "zod";
import { readFileSync } from "fs";
import { createHash } from "crypto";
import { hashSync } from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import mailer from "nodemailer";

import Account from "@database/models/account/Account";
import AccountVerification from "@database/models/account/AccountVerification";

const path = "/register";

const router = Router();

const verificationEmailTemplate = readFileSync(
    "server/resources/verification.html", "utf-8"
);

const registerRequestSchema = z.object({
    email: z.string().email("invalidEmail"),
    username: z.string().min(3, "minUsername").max(32, "maxUsername"),
    password: z.string().min(8, "minPassword").max(64, "maxPassword")
});

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

    if (issue) {
        return res.status(StatusCodes.BAD_REQUEST).send(issue);
    }

    // Ensure no existing account
    const existingAccount = await Account.findOne({
        $or: [
            { email: registration.email },
            { username: registration.username }
        ]
    });

    if (existingAccount) {
        return res.sendStatus(StatusCodes.CONFLICT);
    }

    // Create verification and send email
    const verificationId = uuidv4();

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
        from: process.env.AUTOMATED_EMAIL_ADDRESS,
        to: registration.email,
        subject: "Verify your WintrChess account",
        text: `Please verify your WintrChess account: ${verificationUrl}`,
        html: verificationEmailTemplate
            .replace(/\${ORIGIN}/gi, process.env.ORIGIN)
            .replace(/\${VERIFICATION_URL}/gi, verificationUrl)
            .replace(/\${EMAIL_ACCOUNT}/gi, process.env.EMAIL_ACCOUNT)
    });

    res.sendStatus(StatusCodes.OK);
});

export default router;