import { CSSProperties, ReactNode } from "react";

interface HoverDropdownOption {
    icon?: any;
    label: string;
    url: string;
}

interface HoverDropdownProps {
    children: ReactNode;
    dropdownClassName?: string;
    dropdownStyle?: CSSProperties;
    menuClassName?: string;
    menuStyle?: CSSProperties;
    icon?: any;
    url?: string;
    options?: HoverDropdownOption[];
}

export default HoverDropdownProps;