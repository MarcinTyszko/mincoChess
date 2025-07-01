import { Schema, model } from "mongoose";

import Collection from "@constants/Collection";

// TTL 30 minutes
const passwordResetSchema = new Schema({
    id: { type: String, required: true },
    accountId: { type: String, required: true },
    createdAt: { type: Date, required: true }
});

const PasswordReset = model(
    "passwordReset",
    passwordResetSchema,
    Collection.PASSWORD_RESETS
);

export default PasswordReset;