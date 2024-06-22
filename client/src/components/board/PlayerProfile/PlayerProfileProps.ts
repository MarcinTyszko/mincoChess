import { ReactNode } from "react";

interface PlayerProfileProps {
    children: ReactNode;
    bottom?: boolean;
    rating?: number;
    title?: string;
    profileImage?: string;
}

export default PlayerProfileProps;