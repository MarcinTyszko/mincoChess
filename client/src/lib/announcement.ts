import { Announcement } from "wintrchess";

async function getAnnouncement(): Promise<Announcement> {
    const announcementRequest = await fetch("/api/announcement");

    return await announcementRequest.json();
}

export default getAnnouncement;