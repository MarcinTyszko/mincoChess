import React from "react";

import TextFieldProps from "./TextFieldProps";
import * as styles from "./TextField.module.css";

function TextField({
    style,
    placeholder,
    value,
    onChange
}: TextFieldProps) {
    return <input
        className={styles.field}
        type="text"
        placeholder={placeholder}
        style={style}
        value={value}
        onChange={event => onChange?.(event.target.value)}
    />;
}

export default TextField;