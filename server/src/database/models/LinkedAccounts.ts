import { Schema, model } from "mongoose";

import Collection from "@/constants/Collection";

const linkedAccountsSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true, unique: true },
    chessCom: { type: String },
    lichess: { type: String }
});

const LinkedAccounts = model(
    "linkedAccounts",
    linkedAccountsSchema,
    Collection.LINKED_ACCOUNTS
);

export default LinkedAccounts;
