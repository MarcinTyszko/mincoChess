import { CSSProperties, ReactNode } from "react";

interface DialogProps {
    children?: ReactNode;
    style?: CSSProperties;
    className?: string;
    closeButtonStyle?: CSSProperties;
    setOpen: (open: boolean) => void;
}

export default DialogProps;