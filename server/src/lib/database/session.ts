import { connection as database } from "mongoose";
import { v4 as uuidv4 } from "uuid";

import Collections from "./collections";

export async function createSession() {
    const sessionToken = uuidv4();

    await database
        .collection(Collections.SESSIONS)
        .insertOne({
            token: sessionToken,
            createdAt: new Date()
        });

    return sessionToken;
}

export async function deleteSession(token: string) {
    await database
        .collection(Collections.SESSIONS)
        .deleteOne({ token });
}

export async function verifySession(token: string) {
    const session = await database
        .collection(Collections.SESSIONS)
        .findOne({ token });

    return !!session;
}