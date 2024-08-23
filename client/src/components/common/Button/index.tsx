import React from "react";

import ButtonProps from "./ButtonProps";
import * as styles from "./Button.module.css";

function Button({
    children,
    icon,
    iconSize,
    highlighted,
    style,
    onClick
}: ButtonProps) {
    return <button
        className={styles.button}
        style={{
            filter: highlighted ? "brightness(1.1)" : "",
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