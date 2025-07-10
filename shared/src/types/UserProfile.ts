import UserRole from "@constants/account/UserRole";

export interface UserProfile {
    displayName: string;
    username: string;
    roles: UserRole[];
    createdAt: string;
}