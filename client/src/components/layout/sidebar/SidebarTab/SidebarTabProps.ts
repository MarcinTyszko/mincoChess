import { ReactNode } from "react";

interface SidebarTabProps {
    children: ReactNode;
    navigateTo: string;
    icon: string;
    iconSize?: string;
}

export default SidebarTabProps;