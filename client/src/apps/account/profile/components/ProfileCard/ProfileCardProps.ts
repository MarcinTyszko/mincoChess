import { CSSProperties } from "react";

import { AccountProfile } from "shared/types/AccountProfile";

interface ProfileCardProps {
    className?: string;
    style?: CSSProperties;
    profile?: AccountProfile;
    editable?: boolean;
}

export default ProfileCardProps;