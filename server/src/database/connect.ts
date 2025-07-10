import mongoose from "mongoose";
import cluster from "cluster";

async function connectDatabase() {
    const first = cluster.worker?.id == 1;

    if (!process.env.DATABASE_URI) {
        if (first) console.log(
            "database connection failed; URI not specified."
        );

        return;
    }

    try {
        await mongoose.connect(process.env.DATABASE_URI);
        
        if (!first) return;

        console.log("database connected successfully.");
    } catch (err) {
        if (!first) return;

        console.log("database connection failed:");
        console.log(err);
    }
}

export default connectDatabase;