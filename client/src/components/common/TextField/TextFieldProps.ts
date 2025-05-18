import { CSSProperties } from "react";

interface TextFieldProps {
    className?: string;
    style?: CSSProperties;
    placeholder?: string;
    value?: string;
    password?: boolean;
    onChange?: (value: string) => void;
}

export default TextFieldProps;