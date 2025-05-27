import ProfileConnectionIcon from "../../constants/ProfileConnectionIcon";

interface ProfileConnection {
    url: string;
    icon: ProfileConnectionIcon;
}

interface CreditsProfileProps {
    username: string;
    subheader?: string;
    profileImage: any;
    connections: ProfileConnection[];
}

export default CreditsProfileProps;