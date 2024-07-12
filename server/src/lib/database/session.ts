import * as uuid from "uuid";
import database from ".";

export async function createSession() {
    const sessionToken = uuid.v4();

    await database.collection("sessions").insertOne({
        token: sessionToken,
        createdAt: new Date()
    });

    return sessionToken;
}

export async function deleteSession(token: string) {
    await database.collection("sessions").deleteOne({ token });
}

export async function verifySession(token: string) {
    const session = await database.collection("sessions").findOne({ token });
    return !!session;
}