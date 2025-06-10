import AccountRole from "@constants/AccountRole";

interface AccountProfile {
    displayName: string;
    username: string;
    roles: AccountRole[];
    createdAt: string;
}

export default AccountProfile;