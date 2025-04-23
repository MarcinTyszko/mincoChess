import { CSSProperties, ReactNode } from "react";

interface WidthConstraint {
    width?: string;
}

export interface BaseDropdownOption {
    label: string;
}

export interface DropdownSettingProps<Option extends BaseDropdownOption> {
    options: Option[];
    defaultValue?: Option;
    onSelect?: (value?: Option) => void;
    searchable?: boolean;

    dropdownStyle?: CSSProperties & WidthConstraint;
    dropdownClassName?: string;

    dropdownArrowStyle?: CSSProperties & WidthConstraint;
    dropdownArrowClassName?: string;

    menuAlignment?: "left" | "center" | "right";
    menuStyle?: CSSProperties;
    menuClassName?: string;

    optionStyle?: CSSProperties;
    optionClassName?: string;
    
    dropdownLabelRenderer?: (value: Option) => ReactNode;
}