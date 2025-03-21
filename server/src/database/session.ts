import { connection as database } from "mongoose";
import { v4 as uuidv4 } from "uuid";

import Collection from "@constants/Collection";
import SessionType from "@constants/SessionType";

export async function createSession(
    type: SessionType,
    extras?: Record<string, any>
) {
    const sessionToken = uuidv4();

    await database
        .collection(Collection.SESSIONS)
        .insertOne({
            token: sessionToken,
            type: type,
            createdAt: new Date(),
            ...extras
        });

    return sessionToken;
}

export async function deleteSession(token: string) {
    await database
        .collection(Collection.SESSIONS)
        .deleteOne({ token });
}

export async function verifySession(token: string) {
    const session = await database
        .collection(Collection.SESSIONS)
        .findOne({ token });

    return !!session;
}