import { Schema, model } from "mongoose";

import Collection from "@constants/Collection";

// TTL 30 minutes
const emailUpdateSchema = new Schema({
    accountId: { type: String, required: true },
    currentId: { type: String, required: true },
    newId: { type: String, required: false },
    email: { type: String, required: false },
    currentCreatedAt: { type: Date, required: true },
    newCreatedAt: { type: Date, required: false }
});

const EmailUpdate = model(
    "emailUpdate",
    emailUpdateSchema,
    Collection.EMAIL_UPDATES
);

export default EmailUpdate;