import mongoose from "mongoose";
import cluster from "cluster";

import Collection from "@/constants/Collection";

async function initialiseIndexes() {
    const db = mongoose.connection.db;
    if (!db) throw new Error("failed to ensure database indexes.");

    await db.collection(Collection.ANALYSIS_SESSIONS).createIndex(
        { createdAt: 1 },
        { expireAfterSeconds: 14400 } // 4 hours
    );

    await db.collection(Collection.ARCHIVED_GAMES)
        .createIndex({ userId: 1 });
}

async function connectDatabase() {
    const first = cluster.worker?.id == 1;

    try {
        await mongoose.connect(
            process.env.DATABASE_URI || "mongodb://database/wintrchess",
            {
                // Every worker keeps its own pool, and mongoose defaults to
                // 100 sockets each — far more than this workload needs
                maxPoolSize: Number(process.env.DATABASE_POOL_SIZE) || 10
            }
        );
        await initialiseIndexes();
        
        if (first) console.log("database connected successfully.");
    } catch (err) {
        if (!first) return;

        console.log("database connection failed:");
        console.log(err);
    }
}

export default connectDatabase;