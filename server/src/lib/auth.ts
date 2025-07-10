import mongoose, { mongo } from "mongoose";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { username } from "better-auth/plugins";

import schemas from "shared/constants/account/schemas";
import { sendAccountEmail } from "./email";

let instance: ReturnType<typeof createAuth> | null = null;

function createAuth(database: mongo.Db) {
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
        socialProviders: {
            google: {
                clientId: process.env.GOOGLE_OAUTH_CLIENT_ID!,
                clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET!
            }
        },
        user: {
            modelName: "users",
            additionalFields: {
                roles: { type: "string[]", required: true }
            }
        },
        account: { modelName: "accounts" },
        session: { modelName: "sessions" },
        verification: { modelName: "verifications" },
        plugins: [username({
            maxUsernameLength: 20,
            usernameValidator: username => (
                schemas.username.safeParse(username).success
            )
        })],
        advanced: {
            cookiePrefix: "wintrchess"
        }
    });

    return auth;
}

function getAuth() {
    if (!mongoose.connection.db) throw new Error(
        "cannot initialise auth without database connection."
    );

    return instance ??= createAuth(mongoose.connection.db);
}

export default getAuth;