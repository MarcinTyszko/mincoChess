import { ReactNode } from "react";

import ButtonColour from "@constants/ButtonColour";

interface ButtonProps {
    children?: ReactNode;
    colour: ButtonColour;
    icon: string;
    altText?: string;
}

export default ButtonProps;