import { Schema, model } from "mongoose";

import Collection from "@constants/Collection";

const announcementSchema = new Schema({
    colour: { type: String, required: true },
    content: { type: String, required: true }
});

const Announcement = model(
    "Announcement",
    announcementSchema,
    Collection.ANNOUNCEMENT
);

export default Announcement;