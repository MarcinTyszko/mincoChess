import { Schema, model } from "mongoose";
import * as AuthTypes from "better-auth/types";

import UserRole from "shared/constants/account/UserRole";
import Collection from "@constants/Collection";
import getAuth from "@lib/auth";

type Auth = ReturnType<typeof getAuth>["$Infer"]["Session"];

export const User = model(
    "user",
    new Schema<(
        Omit<Auth["user"], "roles">
        & { roles: UserRole[] }
    )>(),
    Collection.USERS
);

export const Account = model(
    "account",
    new Schema<AuthTypes.Account>(),
    Collection.ACCOUNTS
);

export const Session = model(
    "session",
    new Schema<Auth["session"]>(),
    Collection.USERS
);

export const Verification = model(
    "verification",
    new Schema<AuthTypes.Verification>(),
    Collection.ACCOUNT_VERIFICATIONS 
);

export default { User, Account, Session, Verification };