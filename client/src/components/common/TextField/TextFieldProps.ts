import { CSSProperties } from "react";

interface TextFieldProps {
    style?: CSSProperties;
    placeholder?: string;
    value?: string;
    password?: boolean;
    onChange?: (value: string) => void;
}

export default TextFieldProps;