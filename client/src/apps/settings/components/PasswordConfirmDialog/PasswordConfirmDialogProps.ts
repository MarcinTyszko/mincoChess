import { CSSProperties, ReactNode } from "react";

interface PasswordConfirmDialogProps {
    children?: ReactNode;
    buttonStyle?: CSSProperties;
    onClose: () => void;
    onConfirm: (password: string) => void;
}

export default PasswordConfirmDialogProps;