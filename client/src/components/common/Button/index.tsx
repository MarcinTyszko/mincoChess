import React from "react";

import ButtonProps from "./ButtonProps";

import * as styles from "./Button.module.css";

function Button({
    children,
    colour,
    icon,
    options,
    onClick = () => null
}: ButtonProps) {
    return <button 
        className={styles.button} 
        style={{
            backgroundColor: colour,
            fontSize: options?.fontSize || "1rem",
            padding: options?.padding || "10px"
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