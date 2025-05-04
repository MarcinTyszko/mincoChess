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

    dropdownLabelStyle?: CSSProperties;
    dropdownLabelClassName?: string;
    dropdownLabelRenderer?: (value: Option) => ReactNode;

    dropdownArrowStyle?: CSSProperties;
    dropdownArrowClassName?: string;

    menuAlignment?: "left" | "center" | "right";
    menuStyle?: CSSProperties & WidthConstraint;
    menuClassName?: string;

    optionStyle?: CSSProperties;
    optionClassName?: string;
}