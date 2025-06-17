import { AccountProfile } from "wintrchess";

export async function getAccountProfile(username: string) {
    const profileResponse = await fetch(`/api/public/profile/${username}`);
    const profile: AccountProfile = await profileResponse.json();

    return profile;
}