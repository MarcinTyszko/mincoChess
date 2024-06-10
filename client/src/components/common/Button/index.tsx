import React from "react";

import ButtonProps from "./ButtonProps";

import * as styles from "./Button.module.css";

const iconDefaultHeight = 22;

function Button({ 
    children,
    colour,
    icon,
    onClick = () => null
}: ButtonProps) {
    return <button 
        className={styles.button} 
        style={{
            backgroundColor: colour
        }}
        onClick={event => onClick(event)}
    >
        <img src={icon} height={iconDefaultHeight} />
        {children}
    </button>;
}

export default Button;