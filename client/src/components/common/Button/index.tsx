import React from "react";

import ButtonProps from "./ButtonProps";

import * as styles from "./Button.module.css";

function Button({ children, colour }: ButtonProps) {
    return <>
        <button className={styles.button} style={{
            backgroundColor: colour
        }}>
            {children}
        </button>
    </>;
}

export default Button;