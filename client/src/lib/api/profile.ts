import { AccountProfile } from "shared/types/AccountProfile";
import { User } from "../auth";

export async function getAccountProfile(username: string) {
    const profileResponse = await fetch(`/api/public/profile/${username}`);

    if (!profileResponse.ok) {
        throw new Error("failed to fetch profile.");
    }

    const profile: AccountProfile = await profileResponse.json();

    return profile;
}

export async function getAuthenticatedAccountProfile(): Promise<User> {
    const profileResponse = await fetch("/api/account/profile");

    if (!profileResponse.ok) {
        throw new Error("failed to fetch authenticated profile.");
    }

    return await profileResponse.json();
}