import { UserProfile } from "shared/types/UserProfile";
import { User } from "../auth";

export async function getUserProfile(username: string): Promise<UserProfile> {
    const profileResponse = await fetch(`/api/public/profile/${username}`);
    if (!profileResponse.ok) throw new Error();

    const profile: UserProfile = await profileResponse.json();

    return profile;
}

export async function getAuthenticatedUserProfile(): Promise<User> {
    const profileResponse = await fetch("/api/account/profile");
    if (!profileResponse.ok) throw new Error();

    return await profileResponse.json();
}