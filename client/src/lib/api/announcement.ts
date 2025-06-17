import { Announcement } from "wintrchess";

async function getAnnouncement(): Promise<Announcement> {
    const announcementResponse = await fetch("/api/public/announcement");

    return await announcementResponse.json();
}

export default getAnnouncement;