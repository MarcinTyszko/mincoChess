import { ReactNode, CSSProperties } from "react";

interface SidebarTabProps {
    children: ReactNode;
    style?: CSSProperties;
    navigateTo: string;
    icon?: string;
    iconSize?: string;
}

export default SidebarTabProps;