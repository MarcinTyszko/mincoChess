import { ReactNode, MouseEventHandler, CSSProperties } from "react";

import ButtonColour from "@constants/ButtonColour";

interface ButtonProps {
    children?: ReactNode;
    colour: ButtonColour | string;
    icon?: string;
    options?: {
        iconSize?: string;
        fontSize?: string;
    };
    style?: CSSProperties;
    onClick?: MouseEventHandler<HTMLButtonElement>;
}

export default ButtonProps;