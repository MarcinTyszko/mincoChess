import { CSSProperties, ReactNode } from "react";

type Fields = "input" | "password" | "both";

interface DetailUpdateDialogProps {
    children?: ReactNode;
    buttonStyle?: CSSProperties;
    placeholder?: string;
    fields?: Fields;
    onClose: () => void;
    onConfirm: (input: string, password?: string) => void;
    getErrorMessage?: (input: string, password: string) => string | undefined;
    buttonDisabled?: (input: string, password: string) => boolean;
}

export default DetailUpdateDialogProps;