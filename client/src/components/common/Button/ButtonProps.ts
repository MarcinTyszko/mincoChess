import { ReactNode, MouseEventHandler, CSSProperties } from "react";

interface ButtonProps {
    children?: ReactNode;
    icon?: string;
    iconSize?: string;
    highlighted?: boolean;
    tooltipId?: string;
    style?: CSSProperties;
    className?: string;
    onClick?: MouseEventHandler<HTMLButtonElement>;
}

export default ButtonProps;