import { Announcement } from "wintrchess";

async function getAnnouncement(): Promise<Announcement> {
    const announcementRequest = await fetch("/api/announcement", {
        method: "GET"
    });

    return await announcementRequest.json();
}

export default getAnnouncement;