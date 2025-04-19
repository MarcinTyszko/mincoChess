import { CSSProperties } from "react";

interface NumberSettingProps {
    min?: number;
    max?: number;
    getInitialValue: () => number;
    onChange: (value: number) => void;
    style?: CSSProperties;
}

export default NumberSettingProps;