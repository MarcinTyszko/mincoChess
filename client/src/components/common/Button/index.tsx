import React from "react";

import ButtonColour from "@constants/ButtonColour";

import ButtonProps from "./ButtonProps";
import * as styles from "./Button.module.css";

function Button({
    children,
    icon,
    iconSize,
    style,
    onClick
}: ButtonProps) {
    return <button
        className={styles.button}
        style={{
            backgroundColor: style?.backgroundColor || ButtonColour.GREY,
            padding: style?.padding || "10px",
            fontSize: style?.fontSize || "1.1rem",
            ...style
        }}
        onClick={onClick}
    >
        {
            !!icon 
            && <img src={icon} height={iconSize || "22px"} />
        }

        {children}
    </button>;
}

export default Button;