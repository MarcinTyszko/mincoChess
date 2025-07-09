import mongoose from "mongoose";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { username } from "better-auth/plugins";

import schemas from "shared/constants/account/schemas";
import connectDatabase from "@database/connect";
import { sendAccountEmail } from "./email";

await connectDatabase();

const auth = betterAuth({
    baseURL: `${process.env.ORIGIN}/auth`,
    secret: process.env.AUTH_SECRET,
    database: mongodbAdapter(mongoose.connection.db!, { usePlural: true }),
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
        sendResetPassword: async ({ user, url }) => sendAccountEmail({
            recipient: user.email,
            subject: "Reset your WintrChess password",
            message: "Please reset your WintrChess account's "
                + "password by clicking the button below:",
            buttonLabel: "Reset Password",
            buttonUrl: url,
            plaintextFallback: "Please use the link to reset your"
                + ` WintrChess account's password: ${url}`
        })
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_OAUTH_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET!
        }
    },
    emailVerification: {
        autoSignInAfterVerification: true,
        sendVerificationEmail: async ({ user, url }) => sendAccountEmail({
            recipient: user.email,
            subject: "Verify your WintrChess account",
            message: "Thank you for creating an account on WintrChess! "
                + "Please verify your account by clicking the button below:",
            buttonLabel: "Verify Account",
            buttonUrl: url,
            plaintextFallback: `Please verify your WintrChess account: ${url}`
        })
    },
    advanced: {
        cookiePrefix: "wintrchess"
    },
    plugins: [username({
        maxUsernameLength: 20,
        usernameValidator: username => (
            schemas.username.safeParse(username).success
        )
    })]
});

export default auth;