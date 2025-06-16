import { Schema, model } from "mongoose";

import Collection from "@constants/Collection";
import SessionTokenType from "@constants/SessionTokenType";

const sessionTokenSchema = new Schema({
    id: { type: String, required: false },
    type: {
        type: String,
        enum: Object.values(SessionTokenType),
        required: true
    },
    token: { type: String, required: true },
    actions: { type: Number, required: false },
    createdAt: { type: Date, required: true }
});

const SessionToken = model(
    "sessionToken",
    sessionTokenSchema,
    Collection.SESSION_TOKENS
);

export default SessionToken;