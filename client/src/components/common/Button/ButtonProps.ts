import { ReactNode, MouseEventHandler, CSSProperties } from "react";

interface ButtonProps {
    children?: ReactNode;
    icon?: string;
    iconSize?: string;
    highlighted?: boolean;
    style?: CSSProperties;
    onClick?: MouseEventHandler<HTMLButtonElement>;
}

export default ButtonProps;