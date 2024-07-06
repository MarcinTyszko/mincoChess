import React from "react";

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
            backgroundColor: style?.backgroundColor,
            padding: style?.padding,
            fontSize: style?.fontSize,
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