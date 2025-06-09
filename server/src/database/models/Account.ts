import { Schema, model } from "mongoose";

import Collection from "@constants/Collection";
import Role from "@constants/Role";

const accountSchema = new Schema({
    id: { type: String, required: true },
    email: { type: String, required: true },
    displayName: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: false },
    refreshTokens: { type: [String], required: true },
    roles: {
        type: [String],
        enum: Object.values(Role),
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