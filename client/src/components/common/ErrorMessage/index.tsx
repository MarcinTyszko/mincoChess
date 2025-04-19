import React from "react";

import ErrorMessageProps from "./ErrorMessageProps";
import * as styles from "./ErrorMessage.module.css";

function ErrorMessage({
    children,
    style,
    includeIcon = true
}: ErrorMessageProps) {
    return <span
        className={styles.wrapper}
        style={style}
    >
        {
            includeIcon
            && <img
                src={require("@assets/img/interface/error.svg")}
                height={25}
            />
        }

        <span className={styles.message}>
            {children}
        </span>
    </span>;
}

export default ErrorMessage;