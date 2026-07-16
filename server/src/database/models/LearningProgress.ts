import { Schema, model } from "mongoose";

import Collection from "@/constants/Collection";

const learningProgressSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true, unique: true },
    favourites: { type: [String], default: [] },
    completed: { type: [String], default: [] },
    activity: { type: Map, of: Number, default: {} }
});

const LearningProgress = model(
    "learningProgress",
    learningProgressSchema,
    Collection.LEARNING_PROGRESS
);

export default LearningProgress;
