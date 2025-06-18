import AccountRole from "@constants/account/Role";

export interface AccountProfile {
    displayName: string;
    username: string;
    roles: AccountRole[];
    createdAt: string;
}

export interface AuthenticatedAccountProfile extends AccountProfile {
    email: string;
}