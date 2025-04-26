import ProfileConnectionIcon from "./ProfileConnectionIcon";

interface ProfileConnection {
    url: string;
    icon: ProfileConnectionIcon;
}

interface CreditsProfileProps {
    username: string;
    profileImage: any;
    connections: ProfileConnection[];
}

export default CreditsProfileProps;