import { ReactNode, MouseEventHandler, CSSProperties } from "react";

interface ButtonProps {
    children?: ReactNode;
    icon?: string;
    iconSize?: string;
    style?: CSSProperties;
    onClick?: MouseEventHandler<HTMLButtonElement>;
}

export default ButtonProps;