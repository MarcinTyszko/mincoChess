import { Schema, model } from "mongoose";

import Collection from "@constants/Collection";

// TTL 30 minutes
const emailUpdateSchema = new Schema({
    id: { type: String, required: true },
    accountId: { type: String, required: true },
    email: { type: String, required: false },
    stage: {
        type: String,
        enum: ["current", "new"],
        required: true
    },
    createdAt: { type: Date, required: true }
});

const EmailUpdate = model(
    "emailUpdate",
    emailUpdateSchema,
    Collection.EMAIL_UPDATES
);

export default EmailUpdate;