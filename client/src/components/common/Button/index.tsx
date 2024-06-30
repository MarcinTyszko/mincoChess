import React from "react";

import ButtonProps from "./ButtonProps";
import * as styles from "./Button.module.css";

function Button({
    children,
    colour,
    icon,
    options,
    style,
    onClick
}: ButtonProps) {
    return <button 
        className={styles.button} 
        style={{
            backgroundColor: colour,
            fontSize: options?.fontSize || "1rem",
            padding: style?.padding || "10px",
            ...style
        }}
        onClick={onClick}
    >
        {icon == undefined
            ? ""
            : <img src={icon} height={options?.iconSize || "22px"} />
        }

        {children}
    </button>;
}

export default Button;