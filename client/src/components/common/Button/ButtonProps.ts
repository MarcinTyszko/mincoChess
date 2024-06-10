import { ReactNode, MouseEventHandler } from "react";

import ButtonColour from "@constants/ButtonColour";

interface ButtonProps {
    children?: ReactNode;
    colour: ButtonColour | string;
    icon?: string;
    options?: {
        padding?: string;
        iconSize?: string;
        fontSize?: string;
    };
    onClick?: MouseEventHandler<HTMLButtonElement>;
}

export default ButtonProps;