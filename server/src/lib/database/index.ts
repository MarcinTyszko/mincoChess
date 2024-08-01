import mongoose from "mongoose";

async function connectDatabase() {
    if (!process.env.DATABASE_URL) return;

    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log("database connected successfully.");
    } catch (err) {
        console.log("database connection failed.");
        console.log(err);
    }
}

export default connectDatabase;