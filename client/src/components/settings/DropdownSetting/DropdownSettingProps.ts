import { CSSProperties } from "react";

interface DropdownOption {
    label: string;
    value: string;
}

interface DropdownSettingProps {
    options: DropdownOption[];
    getInitialValue: () => string;
    onSelect: (value: string) => void;
    style?: CSSProperties;
}

export default DropdownSettingProps;