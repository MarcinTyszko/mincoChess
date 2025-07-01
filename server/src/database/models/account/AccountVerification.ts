import { Schema, model } from "mongoose";

import Collection from "@constants/Collection";

// TTL 30 minutes
const accountVerificationSchema = new Schema({
    id: { type: String, required: true },
    email: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    createdAt: { type: Date, required: true }
});

const AccountVerification = model(
    "accountVerification",
    accountVerificationSchema,
    Collection.ACCOUNT_VERIFICATIONS
);

export default AccountVerification;