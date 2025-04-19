import { ReactNode, CSSProperties } from "react";

interface SidebarTabProps {
    children: ReactNode;
    className?: string;
    style?: CSSProperties;
    active?: boolean;
    navigateTo?: string;
    icon?: string;
    iconSize?: string;
    onClick?: () => void;
}

export default SidebarTabProps;