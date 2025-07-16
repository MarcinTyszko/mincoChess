import { UserProfile, AuthedUserProfile } from "shared/types/UserProfile";

export async function getUserProfile(username: string) {
    const profileResponse = await fetch(`/api/public/profile/${username}`);
    if (!profileResponse.ok) throw new Error();

    const profile: UserProfile = await profileResponse.json();

    return profile;
}

export async function getAuthedUserProfile() {
    const profileResponse = await fetch("/api/account/profile");
    if (!profileResponse.ok) throw new Error();

    const profile: AuthedUserProfile = await profileResponse.json();

    return profile;
}