import { CSSProperties } from "react";

interface CheckboxSettingProps {
    getInitialValue: () => boolean;
    onChange: (checked: boolean) => void;
    style?: CSSProperties;
}

export default CheckboxSettingProps;