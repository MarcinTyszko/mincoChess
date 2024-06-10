import React from "react";

import ButtonProps from "./ButtonProps";

import * as styles from "./Button.module.css";

const iconDefaultHeight = 22;

function Button({ children, colour, icon, altText }: ButtonProps) {
    return <>
        <button className={styles.button} style={{
            backgroundColor: colour
        }}>
            <img src={icon} alt={altText} height={iconDefaultHeight} />
            {children}
        </button>
    </>;
}

export default Button;