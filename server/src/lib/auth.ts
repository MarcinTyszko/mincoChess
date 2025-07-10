import mongoose from "mongoose";
import { Db } from "mongodb";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { username } from "better-auth/plugins";

import schemas from "shared/constants/account/schemas";
import { sendAccountEmail } from "./email";

let authCache: ReturnType<typeof betterAuth> | null = null;

function createAuth(database: Db) {
    if (!process.env.ORIGIN) {
        throw new Error("origin not specified.");
    }

    if (!process.env.AUTH_SECRET) {
        throw new Error("auth secret not specified.");
    }

    const auth = betterAuth({
        baseURL: `${process.env.ORIGIN}/auth`,
        secret: process.env.AUTH_SECRET,
        database: mongodbAdapter(database),
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
        user: { modelName: "users" },
        account: { modelName: "accounts" },
        session: { modelName: "sessions" },
        verification: { modelName: "verifications" },
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

    authCache = auth;

    return auth;
}

function getAuth() {
    return authCache || createAuth(mongoose.connection.db!);
}

export default getAuth;