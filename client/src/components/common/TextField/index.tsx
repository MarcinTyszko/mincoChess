import React from "react";

import TextFieldProps from "./TextFieldProps";
import * as styles from "./TextField.module.css";

function TextField({
    className,
    style,
    placeholder,
    value,
    password,
    onChange
}: TextFieldProps) {
    return <input
        className={`${styles.field} ${className}`}
        type={password ? "password" : "text"}
        placeholder={placeholder}
        style={style}
        value={value}
        onChange={event => onChange?.(event.target.value)}
    />;
}

export default TextField;