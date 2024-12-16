import { Announcement } from "wintrchess";

async function getAnnouncement() {
    const announcementRequest = await fetch("/api/announcement", {
        method: "GET"
    });

    const announcement: Announcement = await announcementRequest.json();

    return announcement;
}

export default getAnnouncement;