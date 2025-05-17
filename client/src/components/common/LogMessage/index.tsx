import React from "react";

import LogMessageTheme from "./Theme";
import LogMessageProps from "./LogMessageProps";
import * as styles from "./LogMessage.module.css";

const themeColours: Record<LogMessageTheme, string> = {
    info: "#2c94ff66",
    success: "#54ff7366",
    warn: "#ffeb5466",
    error: "#ef414666"
};

function LogMessage({
    children,
    style,
    theme,
    includeIcon = true
}: LogMessageProps) {
    return <span
        className={styles.wrapper}
        style={{
            backgroundColor: theme
                ? themeColours[theme]
                : themeColours["error"],
            ...style
        }}
    >
        {includeIcon
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

export default LogMessage;