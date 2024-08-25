import { CSSProperties } from "react";

interface TextFieldProps {
    style?: CSSProperties;
    placeholder?: string;
    onChange?: (value: string) => void;
}

export default TextFieldProps;