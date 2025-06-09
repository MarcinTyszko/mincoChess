import { Schema, model } from "mongoose";

import { AccountRole } from "wintrchess";
import Collection from "@constants/Collection";

const accountSchema = new Schema({
    id: { type: String, required: true },
    email: { type: String, required: true },
    displayName: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: false },
    refreshTokens: { type: [String], required: true },
    roles: {
        type: [String],
        enum: Object.values(AccountRole),
        required: true
    },
    createdAt: { type: Date, required: true }
});

const Account = model(
    "account",
    accountSchema,
    Collection.ACCOUNTS
);

export default Account;