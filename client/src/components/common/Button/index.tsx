import React from "react";

import ButtonProps from "./ButtonProps";
import * as styles from "./Button.module.css";

function Button({
    children,
    icon,
    iconSize,
    highlighted,
    tooltip,
    className,
    style,
    onClick
}: ButtonProps) {
    return <button
        className={`${styles.button} ${className}`}
        style={{
            filter: highlighted ? "brightness(0.9)" : "",
            ...style
        }}
        onClick={onClick}
        title={tooltip}
    >
        {
            icon
            && <img
                src={icon}
                height={iconSize || "22px"}
            />
        }

        {children}
    </button>;
}

export default Button;