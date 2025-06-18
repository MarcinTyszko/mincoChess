import { AccountProfile, AuthenticatedAccountProfile } from "wintrchess";

export async function getAccountProfile(username: string) {
    const profileResponse = await fetch(`/api/public/profile/${username}`);

    if (!profileResponse.ok) {
        throw new Error("failed to fetch profile.");
    }

    const profile: AccountProfile = await profileResponse.json();

    return profile;
}

export async function getAuthenticatedAccountProfile() {
    const profileResponse = await fetch("/api/account/profile");

    if (!profileResponse.ok) {
        throw new Error("failed to fetch authenticated profile.");
    }

    const profile: AuthenticatedAccountProfile = await profileResponse.json();

    return profile;
}