import { ReactNode, MouseEventHandler } from "react";

import ButtonColour from "@constants/ButtonColour";

interface ButtonProps {
    children?: ReactNode;
    colour: ButtonColour;
    icon: string;
    url?: string;
    onClick?: MouseEventHandler<HTMLButtonElement>;
}

export default ButtonProps;