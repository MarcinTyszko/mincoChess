import mongoose from "mongoose";
import cluster from "cluster";

async function connectDatabase() {
    if (!process.env.DATABASE_URL) return;

    const firstWorker = cluster.worker?.id == 1;

    try {
        await mongoose.connect(process.env.DATABASE_URL);
        
        if (firstWorker) {
            console.log("database connected successfully.");
        }
    } catch (err) {
        if (!firstWorker) return;

        console.log("database connection failed.");
        console.log(err);
    }
}

export default connectDatabase;