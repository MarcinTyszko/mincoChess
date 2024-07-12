import mongoose from "mongoose";

const database = mongoose.createConnection(process.env.DATABASE_URL || "");
database.useDb("wintrchess");

export default database;