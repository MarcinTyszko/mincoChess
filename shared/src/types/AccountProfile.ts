import AccountRole from "@constants/account/Role";

interface AccountProfile {
    displayName: string;
    username: string;
    roles: AccountRole[];
    createdAt: string;
}

export default AccountProfile;