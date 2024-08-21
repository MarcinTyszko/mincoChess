import { connection as database } from "mongoose";
import * as uuid from "uuid";

import Collections from "./collections";

export async function createSession() {
    const sessionToken = uuid.v4();

    await database.collection(Collections.SESSIONS).insertOne({
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